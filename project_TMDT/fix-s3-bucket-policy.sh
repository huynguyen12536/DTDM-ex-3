#!/bin/bash

# Script để sửa S3 bucket policy cho CloudFront
# Chạy script này nếu bạn muốn giữ CloudFront trỏ đến S3

DISTRIBUTION_ID="d39438he2ixn2j"

echo "=========================================="
echo "Sửa S3 Bucket Policy cho CloudFront"
echo "=========================================="

# Lấy thông tin distribution
ORIGIN_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' --output text)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Kiểm tra xem có phải S3 không
if [[ ! $ORIGIN_DOMAIN == *".s3."* ]] && [[ ! $ORIGIN_DOMAIN == *"s3.amazonaws.com"* ]]; then
    echo "❌ CloudFront không trỏ đến S3 bucket"
    echo "Origin hiện tại: $ORIGIN_DOMAIN"
    exit 1
fi

# Lấy tên bucket
BUCKET_NAME=$(echo $ORIGIN_DOMAIN | sed 's/\.s3\..*//' | sed 's/\.s3-.*//' | sed 's/^s3:\/\///' | sed 's/\/.*//')
echo "S3 Bucket: $BUCKET_NAME"
echo "Account ID: $ACCOUNT_ID"
echo "Distribution ID: $DISTRIBUTION_ID"
echo ""

# Lấy OAC ID nếu có
OAC_ID=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DistributionConfig.Origins.Items[0].OriginAccessControlId' --output text 2>/dev/null)

if [ -z "$OAC_ID" ] || [ "$OAC_ID" == "None" ]; then
    echo "⚠️  Distribution không sử dụng Origin Access Control (OAC)"
    echo "Cần tạo OAC hoặc sử dụng Origin Access Identity (OAI)"
    echo ""
    echo "Tạo OAC mới..."
    
    OAC_NAME="s3-oac-${BUCKET_NAME}"
    OAC_OUTPUT=$(aws cloudfront create-origin-access-control \
        --origin-access-control-config \
        Name=$OAC_NAME,OriginAccessControlOriginType=s3,SigningBehavior=always,SigningProtocol=sigv4 \
        --output json)
    
    OAC_ID=$(echo $OAC_OUTPUT | jq -r '.OriginAccessControl.Id')
    OAC_ARN=$(echo $OAC_OUTPUT | jq -r '.OriginAccessControl.OriginAccessControlConfig.OriginAccessControlArn')
    
    echo "✅ Đã tạo OAC: $OAC_ID"
    echo "OAC ARN: $OAC_ARN"
    echo ""
    echo "⚠️  Bạn cần cập nhật CloudFront distribution để sử dụng OAC này"
    echo "Sau đó chạy lại script này để cập nhật bucket policy"
    exit 0
fi

echo "OAC ID: $OAC_ID"
OAC_ARN=$(aws cloudfront get-origin-access-control --id $OAC_ID --query 'OriginAccessControl.OriginAccessControlConfig.OriginAccessControlArn' --output text)
echo "OAC ARN: $OAC_ARN"
echo ""

# Tạo bucket policy
echo "Tạo bucket policy..."
cat > bucket-policy.json << EOF
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
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}"
        }
      }
    }
  ]
}
EOF

echo "Bucket Policy:"
cat bucket-policy.json
echo ""

read -p "Bạn có muốn áp dụng bucket policy này? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Hủy bỏ. Policy đã được lưu trong bucket-policy.json"
    exit 0
fi

echo ""
echo "Áp dụng bucket policy..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

if [ $? -eq 0 ]; then
    echo "✅ Đã cập nhật bucket policy thành công!"
    echo ""
    echo "Kiểm tra policy:"
    aws s3api get-bucket-policy --bucket $BUCKET_NAME --output text | jq .
else
    echo "❌ Lỗi khi cập nhật bucket policy"
    echo "Kiểm tra quyền IAM của bạn"
fi

