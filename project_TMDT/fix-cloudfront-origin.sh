#!/bin/bash

# Script để đổi CloudFront origin từ S3 sang EC2 server
# CẢNH BÁO: Script này sẽ tạo một distribution config mới
# Bạn cần có quyền CloudFront Full Access

DISTRIBUTION_ID="d39438he2ixn2j"
EC2_ORIGIN_DOMAIN="54.169.66.118"
EC2_ORIGIN_ID="ec2-origin"

echo "=========================================="
echo "Cập nhật CloudFront Origin sang EC2"
echo "=========================================="
echo "Distribution ID: $DISTRIBUTION_ID"
echo "EC2 Origin: $EC2_ORIGIN_DOMAIN"
echo ""

# Lấy cấu hình hiện tại
echo "1. Lấy cấu hình distribution hiện tại..."
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > current-config.json

ETAG=$(jq -r '.ETag' current-config.json)
CONFIG=$(jq '.DistributionConfig' current-config.json)

echo "ETag: $ETAG"
echo ""

# Tạo origin mới cho EC2
echo "2. Tạo origin mới cho EC2..."

# Kiểm tra xem origin đã tồn tại chưa
EXISTING_ORIGIN=$(echo $CONFIG | jq -r ".Origins.Items[] | select(.Id == \"$EC2_ORIGIN_ID\")")

if [ -z "$EXISTING_ORIGIN" ] || [ "$EXISTING_ORIGIN" == "null" ]; then
    echo "Thêm origin mới cho EC2..."
    
    # Thêm origin mới vào danh sách
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
    echo "Origin đã tồn tại, cập nhật..."
    NEW_CONFIG=$(echo $CONFIG | jq --arg domain "$EC2_ORIGIN_DOMAIN" --arg id "$EC2_ORIGIN_ID" '
        .Origins.Items = (.Origins.Items | map(
            if .Id == $id then
                .DomainName = $domain
            else
                .
            end
        ))
    ')
fi

# Đặt default origin thành EC2
NEW_CONFIG=$(echo $NEW_CONFIG | jq --arg id "$EC2_ORIGIN_ID" '.DefaultCacheBehavior.TargetOriginId = $id')

# Lưu config mới
echo $NEW_CONFIG > new-config.json

echo ""
echo "3. Xem trước cấu hình mới..."
echo "Default Origin ID: $(echo $NEW_CONFIG | jq -r '.DefaultCacheBehavior.TargetOriginId')"
echo "Origins:"
echo $NEW_CONFIG | jq -r '.Origins.Items[] | "  - \(.Id): \(.DomainName)"'

echo ""
read -p "Bạn có muốn cập nhật CloudFront distribution? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Hủy bỏ. Config đã được lưu trong new-config.json"
    exit 0
fi

echo ""
echo "4. Cập nhật CloudFront distribution..."
aws cloudfront update-distribution \
    --id $DISTRIBUTION_ID \
    --if-match $ETAG \
    --distribution-config file://new-config.json \
    --output json > update-result.json

echo ""
echo "✅ Đã gửi yêu cầu cập nhật!"
echo "CloudFront distribution đang được cập nhật (có thể mất 15-20 phút)"
echo ""
echo "Kiểm tra trạng thái:"
echo "aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.Status' --output text"

# Dọn dọn file tạm
rm -f current-config.json new-config.json update-result.json

