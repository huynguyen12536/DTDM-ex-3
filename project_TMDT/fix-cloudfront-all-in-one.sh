#!/bin/bash

# Script tổng hợp để sửa lỗi CloudFront Access Denied
# Chạy script này trên EC2 server sau khi SSH vào

set -e

DISTRIBUTION_ID="d39438he2ixn2j"
EC2_ORIGIN_DOMAIN="54.169.66.118"
EC2_ORIGIN_ID="ec2-origin"

echo "=========================================="
echo "SỬA LỖI CLOUDFRONT ACCESS DENIED"
echo "=========================================="
echo ""

# Kiểm tra AWS CLI
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI chưa được cài đặt"
    echo "Đang cài đặt AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
    echo "✅ Đã cài đặt AWS CLI"
fi

# Kiểm tra jq
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq chưa được cài đặt"
    echo "Đang cài đặt jq..."
    sudo apt-get update -qq
    sudo apt-get install -y jq
    echo "✅ Đã cài đặt jq"
fi

echo ""
echo "1. Kiểm tra CloudFront Distribution..."
echo "----------------------------------------"

# Lấy thông tin distribution
DIST_INFO=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Không thể truy cập CloudFront distribution"
    echo "Kiểm tra quyền IAM của bạn"
    exit 1
fi

ETAG=$(echo $DIST_INFO | jq -r '.ETag')
CONFIG=$(echo $DIST_INFO | jq '.Distribution.DistributionConfig')
CURRENT_ORIGIN_DOMAIN=$(echo $CONFIG | jq -r '.Origins.Items[0].DomainName')
CURRENT_ORIGIN_ID=$(echo $CONFIG | jq -r '.Origins.Items[0].Id')
DEFAULT_ORIGIN_ID=$(echo $CONFIG | jq -r '.DefaultCacheBehavior.TargetOriginId')

echo "Distribution ID: $DISTRIBUTION_ID"
echo "Origin hiện tại: $CURRENT_ORIGIN_DOMAIN (ID: $CURRENT_ORIGIN_ID)"
echo "Default Origin ID: $DEFAULT_ORIGIN_ID"
echo ""

# Kiểm tra xem origin có phải là S3 không
IS_S3=false
if [[ $CURRENT_ORIGIN_DOMAIN == *".s3."* ]] || [[ $CURRENT_ORIGIN_DOMAIN == *"s3.amazonaws.com"* ]]; then
    IS_S3=true
    BUCKET_NAME=$(echo $CURRENT_ORIGIN_DOMAIN | sed 's/\.s3\..*//' | sed 's/\.s3-.*//' | sed 's/^s3:\/\///' | sed 's/\/.*//')
    echo "⚠️  Phát hiện: CloudFront đang trỏ đến S3 bucket: $BUCKET_NAME"
elif [[ $CURRENT_ORIGIN_DOMAIN == *"$EC2_ORIGIN_DOMAIN"* ]]; then
    echo "✅ CloudFront đã trỏ đến EC2 server"
    echo "Kiểm tra các vấn đề khác..."
else
    echo "⚠️  Origin không xác định: $CURRENT_ORIGIN_DOMAIN"
fi

echo ""
echo "2. Kiểm tra Nginx trên server..."
echo "----------------------------------------"

if systemctl is-active --quiet nginx || service nginx status &>/dev/null; then
    echo "✅ Nginx đang chạy"
    
    # Kiểm tra cấu hình nginx
    NGINX_CONF=""
    if [ -f "/etc/nginx/conf.d/default.conf" ]; then
        NGINX_CONF="/etc/nginx/conf.d/default.conf"
    elif [ -f "/etc/nginx/sites-available/default" ]; then
        NGINX_CONF="/etc/nginx/sites-available/default"
    fi
    
    if [ -n "$NGINX_CONF" ]; then
        echo "Nginx config: $NGINX_CONF"
        # Kiểm tra xem có try_files cho SPA không
        if grep -q "try_files.*index.html" $NGINX_CONF; then
            echo "✅ Nginx đã cấu hình SPA routing"
        else
            echo "⚠️  Nginx chưa cấu hình SPA routing (try_files)"
        fi
    fi
else
    echo "⚠️  Nginx không chạy hoặc không tìm thấy"
fi

echo ""
echo "3. Đề xuất giải pháp..."
echo "----------------------------------------"

if [ "$IS_S3" = true ]; then
    echo ""
    echo "🔧 GIẢI PHÁP: Đổi CloudFront origin sang EC2 server"
    echo ""
    read -p "Bạn có muốn đổi CloudFront origin sang EC2? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo ""
        echo "Đang cập nhật CloudFront origin..."
        
        # Kiểm tra xem origin EC2 đã tồn tại chưa
        EC2_ORIGIN_EXISTS=$(echo $CONFIG | jq -r ".Origins.Items[] | select(.Id == \"$EC2_ORIGIN_ID\") | .Id")
        
        if [ -z "$EC2_ORIGIN_EXISTS" ] || [ "$EC2_ORIGIN_EXISTS" == "null" ]; then
            # Thêm origin mới
            NEW_CONFIG=$(echo $CONFIG | jq --arg domain "$EC2_ORIGIN_DOMAIN" --arg id "$EC2_ORIGIN_ID" '
                .Origins.Items += [{
                    "Id": $id,
                    "DomainName": $domain,
                    "CustomOriginConfig": {
                        "HTTPPort": 80,
                        "HTTPSPort": 443,
                        "OriginProtocolPolicy": "http-only",
                        "OriginSslProtocols": {
                            "Quantity": 1,
                            "Items": ["TLSv1.2"]
                        },
                        "OriginReadTimeout": 30,
                        "OriginKeepaliveTimeout": 5
                    }
                }] |
                .Origins.Quantity = (.Origins.Items | length)
            ')
        else
            # Origin đã tồn tại, chỉ cập nhật
            NEW_CONFIG=$(echo $CONFIG | jq --arg domain "$EC2_ORIGIN_DOMAIN" --arg id "$EC2_ORIGIN_ID" '
                .Origins.Items = (.Origins.Items | map(
                    if .Id == $id then
                        .DomainName = $domain |
                        .CustomOriginConfig.HTTPPort = 80 |
                        .CustomOriginConfig.HTTPSPort = 443 |
                        .CustomOriginConfig.OriginProtocolPolicy = "http-only"
                    else
                        .
                    end
                ))
            ')
        fi
        
        # Đặt default origin thành EC2
        NEW_CONFIG=$(echo $NEW_CONFIG | jq --arg id "$EC2_ORIGIN_ID" '.DefaultCacheBehavior.TargetOriginId = $id')
        
        # Lưu config
        echo $NEW_CONFIG > /tmp/new-cloudfront-config.json
        
        # Cập nhật
        echo "Đang gửi yêu cầu cập nhật CloudFront..."
        UPDATE_RESULT=$(aws cloudfront update-distribution \
            --id $DISTRIBUTION_ID \
            --if-match "$ETAG" \
            --distribution-config file:///tmp/new-cloudfront-config.json \
            --output json 2>&1)
        
        if [ $? -eq 0 ]; then
            echo "✅ Đã gửi yêu cầu cập nhật CloudFront thành công!"
            echo ""
            echo "⚠️  Lưu ý: CloudFront distribution sẽ mất 15-20 phút để cập nhật"
            echo ""
            echo "Bước tiếp theo:"
            echo "1. Đợi 15-20 phút"
            echo "2. Invalidate cache:"
            echo "   aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"
            echo "3. Test lại URL: https://d39438he2ixn2j.cloudfront.net/shop"
        else
            echo "❌ Lỗi khi cập nhật CloudFront:"
            echo "$UPDATE_RESULT"
            echo ""
            echo "Có thể do:"
            echo "- ETag đã thay đổi (distribution đang được cập nhật)"
            echo "- Thiếu quyền IAM"
            echo ""
            echo "Thử lại sau vài phút hoặc cập nhật thủ công qua AWS Console"
        fi
        
        rm -f /tmp/new-cloudfront-config.json
    else
        echo "Bỏ qua. Bạn có thể chạy lại script sau."
    fi
else
    echo ""
    echo "CloudFront đã trỏ đến EC2. Kiểm tra các vấn đề khác:"
    echo ""
    echo "1. Kiểm tra Security Group của EC2:"
    echo "   - Đảm bảo cho phép HTTP (port 80) từ 0.0.0.0/0"
    echo ""
    echo "2. Kiểm tra Nginx config có đúng không"
    echo ""
    echo "3. Test kết nối trực tiếp:"
    echo "   curl -I http://$EC2_ORIGIN_DOMAIN"
fi

echo ""
echo "=========================================="
echo "Hoàn tất!"
echo "=========================================="

