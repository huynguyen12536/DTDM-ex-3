#!/bin/bash

# Script để kiểm tra và sửa lỗi CloudFront Access Denied
# Chạy script này trên server EC2

echo "=========================================="
echo "Kiểm tra cấu hình CloudFront và S3"
echo "=========================================="

# Kiểm tra AWS CLI đã cài đặt chưa
if ! command -v aws &> /dev/null; then
    echo "AWS CLI chưa được cài đặt. Đang cài đặt..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

echo ""
echo "1. Kiểm tra CloudFront Distribution..."
echo "Distribution ID: d39438he2ixn2j"
echo ""

# Lấy thông tin CloudFront distribution
aws cloudfront get-distribution --id d39438he2ixn2j --query 'Distribution.DistributionConfig.Origins.Items[0]' --output json

echo ""
echo "=========================================="
echo "2. Kiểm tra Origin Domain..."
echo "=========================================="

ORIGIN_DOMAIN=$(aws cloudfront get-distribution --id d39438he2ixn2j --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' --output text)
ORIGIN_ID=$(aws cloudfront get-distribution --id d39438he2ixn2j --query 'Distribution.DistributionConfig.Origins.Items[0].Id' --output text)

echo "Origin Domain: $ORIGIN_DOMAIN"
echo "Origin ID: $ORIGIN_ID"

# Kiểm tra xem origin có phải là S3 bucket không
if [[ $ORIGIN_DOMAIN == *".s3."* ]] || [[ $ORIGIN_DOMAIN == *"s3.amazonaws.com"* ]]; then
    echo ""
    echo "⚠️  Phát hiện: CloudFront đang trỏ đến S3 bucket"
    echo "Nếu bạn muốn dùng EC2 server (54.169.66.118), cần thay đổi origin"
    echo ""
    
    # Lấy tên bucket
    BUCKET_NAME=$(echo $ORIGIN_DOMAIN | sed 's/\.s3\..*//' | sed 's/\.s3-.*//')
    echo "S3 Bucket: $BUCKET_NAME"
    
    echo ""
    echo "3. Kiểm tra S3 Bucket Policy..."
    aws s3api get-bucket-policy --bucket $BUCKET_NAME --output text 2>/dev/null || echo "Bucket không có policy hoặc không có quyền truy cập"
    
    echo ""
    echo "=========================================="
    echo "GIẢI PHÁP:"
    echo "=========================================="
    echo ""
    echo "Có 2 cách để sửa:"
    echo ""
    echo "CÁCH 1: Sửa S3 Bucket Policy (nếu muốn dùng S3)"
    echo "----------------------------------------"
    echo "Tạo file bucket-policy.json với nội dung:"
    cat << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
EOF
    echo ""
    echo "Sau đó chạy:"
    echo "aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json"
    echo ""
    echo "CÁCH 2: Đổi CloudFront Origin sang EC2 (KHUYẾN NGHỊ)"
    echo "----------------------------------------"
    echo "Cần cập nhật CloudFront distribution để trỏ đến EC2 server"
    echo "Origin Domain: 54.169.66.118"
    echo "Origin Protocol: HTTP hoặc HTTPS"
    echo ""
    echo "Chạy script fix-cloudfront-origin.sh để tự động sửa"
    
elif [[ $ORIGIN_DOMAIN == *"54.169.66.118"* ]] || [[ $ORIGIN_DOMAIN == *"ec2"* ]]; then
    echo ""
    echo "✅ CloudFront đang trỏ đến EC2 server"
    echo "Vấn đề có thể là:"
    echo "1. Security Group của EC2 không cho phép CloudFront IP ranges"
    echo "2. Nginx trên EC2 không cấu hình đúng"
    echo ""
    echo "Kiểm tra Security Group..."
    INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
    echo "Instance ID: $INSTANCE_ID"
    
else
    echo ""
    echo "Origin domain không xác định: $ORIGIN_DOMAIN"
fi

echo ""
echo "=========================================="
echo "Kiểm tra Nginx trên server..."
echo "=========================================="

if [ -f "/etc/nginx/conf.d/default.conf" ]; then
    echo "Nginx config hiện tại:"
    cat /etc/nginx/conf.d/default.conf
elif [ -f "/etc/nginx/sites-available/default" ]; then
    echo "Nginx config hiện tại:"
    cat /etc/nginx/sites-available/default
else
    echo "Không tìm thấy file cấu hình Nginx"
fi

echo ""
echo "Kiểm tra Nginx có đang chạy không..."
systemctl status nginx --no-pager || service nginx status

