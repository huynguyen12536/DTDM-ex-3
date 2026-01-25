# Hướng dẫn sửa lỗi CloudFront Access Denied

## Vấn đề
Khi truy cập qua CloudFront URL `https://d39438he2ixn2j.cloudfront.net/shop`, gặp lỗi:
```xml
<Error>
<Code>AccessDenied</Code>
<Message>Access Denied</Message>
</Error>
```

Nhưng truy cập trực tiếp qua server IP `54.169.66.118` thì hoạt động bình thường.

## Nguyên nhân
CloudFront đang trỏ đến S3 bucket nhưng bucket không có quyền cho CloudFront truy cập, hoặc CloudFront chưa được cấu hình đúng để trỏ đến EC2 server.

## Giải pháp

### Cách 1: Đổi CloudFront Origin sang EC2 Server (KHUYẾN NGHỊ)

Nếu bạn muốn CloudFront trỏ trực tiếp đến EC2 server:

1. **SSH vào server:**
```bash
ssh -i ~/.ssh/pickleball_key.pem ubuntu@54.169.66.118
```

2. **Tải các script:**
```bash
# Tải script từ local hoặc tạo trực tiếp trên server
```

3. **Chạy script kiểm tra:**
```bash
chmod +x fix-cloudfront-access.sh
./fix-cloudfront-access.sh
```

4. **Cập nhật CloudFront origin:**
```bash
chmod +x fix-cloudfront-origin.sh
./fix-cloudfront-origin.sh
```

**Hoặc cập nhật thủ công qua AWS Console:**
- Vào CloudFront Console
- Chọn distribution `d39438he2ixn2j`
- Tab "Origins and Origin Groups"
- Edit origin hiện tại hoặc tạo origin mới:
  - **Origin Domain**: `54.169.66.118`
  - **Origin Protocol**: `HTTP` (hoặc HTTPS nếu có SSL)
  - **HTTP Port**: `80`
  - **HTTPS Port**: `443`
  - **Origin Protocol Policy**: `HTTP Only` (nếu chưa có SSL) hoặc `Match Viewer`

5. **Cập nhật Default Cache Behavior:**
- Chọn origin mới (EC2) làm default origin
- Save changes

6. **Kiểm tra Security Group của EC2:**
Đảm bảo Security Group cho phép traffic từ CloudFront:
- Inbound rule: HTTP (port 80) từ `0.0.0.0/0` hoặc CloudFront IP ranges
- Inbound rule: HTTPS (port 443) nếu dùng HTTPS

### Cách 2: Sửa S3 Bucket Policy (nếu muốn dùng S3)

Nếu bạn muốn giữ CloudFront trỏ đến S3:

1. **SSH vào server và chạy:**
```bash
chmod +x fix-s3-bucket-policy.sh
./fix-s3-bucket-policy.sh
```

2. **Hoặc tạo bucket policy thủ công:**

Lấy thông tin cần thiết:
```bash
# Lấy Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Lấy Distribution ID (đã biết: d39438he2ixn2j)
DISTRIBUTION_ID="d39438he2ixn2j"

# Lấy tên S3 bucket từ CloudFront origin
ORIGIN_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' --output text)
BUCKET_NAME=$(echo $ORIGIN_DOMAIN | sed 's/\.s3\..*//')
```

Tạo file `bucket-policy.json`:
```json
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
```

Thay `BUCKET_NAME`, `ACCOUNT_ID`, và `DISTRIBUTION_ID` bằng giá trị thực tế.

Áp dụng policy:
```bash
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
```

3. **Kiểm tra Origin Access Control (OAC):**
- Vào CloudFront Console
- Kiểm tra origin có sử dụng OAC không
- Nếu chưa có, tạo OAC mới và gán cho origin

## Kiểm tra sau khi sửa

1. **Invalidate CloudFront cache:**
```bash
aws cloudfront create-invalidation \
    --distribution-id d39438he2ixn2j \
    --paths "/*"
```

2. **Đợi 15-20 phút** để CloudFront cập nhật cấu hình

3. **Test lại URL:**
```
https://d39438he2ixn2j.cloudfront.net/shop
```

## Lưu ý

- CloudFront distribution update có thể mất 15-20 phút
- Sau khi sửa, cần invalidate cache để thấy thay đổi ngay
- Nếu dùng EC2 origin, đảm bảo Nginx đã cấu hình đúng để serve SPA (fallback về index.html)
- Nếu dùng S3 origin, cần đảm bảo bucket có OAC hoặc OAI được cấu hình đúng

