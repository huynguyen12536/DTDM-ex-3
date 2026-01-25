# Hướng dẫn sửa lỗi CloudFront Access Denied

## Vấn đề
- ✅ Truy cập qua IP server `54.169.66.118` → Hoạt động bình thường
- ❌ Truy cập qua CloudFront `https://d39438he2ixn2j.cloudfront.net/shop` → Lỗi Access Denied

## Giải pháp nhanh (Khuyến nghị)

### Bước 1: Copy script lên server

Từ máy local (Windows), chạy lệnh sau để copy script lên server:

```powershell
# Từ thư mục project
scp -i ~/.ssh/pickleball_key.pem fix-cloudfront-all-in-one.sh ubuntu@54.169.66.118:~/
```

### Bước 2: SSH vào server và chạy script

```bash
# SSH vào server
ssh -i ~/.ssh/pickleball_key.pem ubuntu@54.169.66.118

# Cấp quyền thực thi
chmod +x fix-cloudfront-all-in-one.sh

# Chạy script
./fix-cloudfront-all-in-one.sh
```

Script sẽ tự động:
- Kiểm tra cấu hình CloudFront hiện tại
- Phát hiện nếu CloudFront đang trỏ đến S3 bucket
- Đề xuất và thực hiện đổi origin sang EC2 server
- Hướng dẫn các bước tiếp theo

### Bước 3: Đợi và test lại

1. **Đợi 15-20 phút** để CloudFront cập nhật cấu hình

2. **Invalidate cache** (chạy trên server):
```bash
aws cloudfront create-invalidation --distribution-id d39438he2ixn2j --paths "/*"
```

3. **Test lại URL:**
```
https://d39438he2ixn2j.cloudfront.net/shop
```

## Giải pháp thủ công (nếu script không chạy được)

### Cách 1: Sửa qua AWS Console (Dễ nhất)

1. **Vào AWS Console → CloudFront**
2. **Chọn distribution:** `d39438he2ixn2j`
3. **Tab "Origins and Origin Groups"**
4. **Nếu origin hiện tại là S3:**
   - Click "Create origin"
   - **Origin domain:** `54.169.66.118`
   - **Origin protocol:** `HTTP`
   - **HTTP port:** `80`
   - **Origin protocol policy:** `HTTP Only`
   - Click "Create origin"

5. **Tab "Behaviors"**
   - Chọn default behavior
   - Click "Edit"
   - **Origin and origin groups:** Chọn origin EC2 mới tạo
   - Click "Save changes"

6. **Đợi 15-20 phút** và invalidate cache

### Cách 2: Sửa S3 Bucket Policy (nếu muốn giữ S3)

Nếu bạn muốn giữ CloudFront trỏ đến S3, cần sửa bucket policy:

1. **Lấy thông tin:**
```bash
# Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Distribution ID
DISTRIBUTION_ID="d39438he2ixn2j"

# Tên bucket (từ CloudFront origin)
ORIGIN_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' --output text)
BUCKET_NAME=$(echo $ORIGIN_DOMAIN | sed 's/\.s3\..*//')
```

2. **Tạo bucket policy file:**
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

Thay `BUCKET_NAME` và `ACCOUNT_ID` bằng giá trị thực tế.

3. **Áp dụng policy:**
```bash
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
```

## Kiểm tra sau khi sửa

1. **Kiểm tra Security Group của EC2:**
   - Đảm bảo cho phép HTTP (port 80) từ `0.0.0.0/0`
   - Nếu dùng HTTPS, cho phép port 443

2. **Kiểm tra Nginx:**
   - Đảm bảo Nginx đang chạy: `sudo systemctl status nginx`
   - Kiểm tra config có `try_files $uri $uri/ /index.html;` cho SPA routing

3. **Test kết nối:**
```bash
curl -I http://54.169.66.118
```

## Các script có sẵn

- `fix-cloudfront-all-in-one.sh` - Script tổng hợp tự động (KHUYẾN NGHỊ)
- `fix-cloudfront-access.sh` - Script kiểm tra và chẩn đoán
- `fix-cloudfront-origin.sh` - Script đổi origin sang EC2
- `fix-s3-bucket-policy.sh` - Script sửa S3 bucket policy

## Lưu ý quan trọng

⚠️ **CloudFront distribution update mất 15-20 phút**
- Sau khi sửa, phải đợi distribution deploy xong
- Có thể kiểm tra status trong AWS Console

⚠️ **Invalidate cache sau khi sửa**
- Chạy: `aws cloudfront create-invalidation --distribution-id d39438he2ixn2j --paths "/*"`
- Mất vài phút để cache được xóa

⚠️ **Nếu vẫn lỗi sau 20 phút**
- Kiểm tra lại Security Group
- Kiểm tra Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Kiểm tra CloudFront logs trong AWS Console

