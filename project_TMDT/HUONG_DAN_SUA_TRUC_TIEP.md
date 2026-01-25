# Hướng dẫn sửa lỗi CloudFront Access Denied - TRỰC TIẾP

## ✅ Đã hoàn thành trên server:
1. ✅ Đã cài đặt AWS CLI
2. ✅ Đã khởi động lại frontend container (server đang hoạt động tốt - HTTP 200 OK)
3. ✅ Server đã sẵn sàng nhận request từ CloudFront

## 🔧 Bước tiếp theo: Sửa CloudFront qua AWS Console

Vì server chưa có AWS credentials, bạn cần sửa CloudFront qua AWS Console:

### Cách 1: Sửa qua AWS Console (KHUYẾN NGHỊ - Dễ nhất)

1. **Đăng nhập AWS Console:**
   - Vào https://console.aws.amazon.com
   - Đăng nhập với tài khoản AWS của bạn

2. **Vào CloudFront:**
   - Tìm "CloudFront" trong search bar
   - Click vào service CloudFront

3. **Chọn Distribution:**
   - Tìm distribution có ID: `d39438he2ixn2j`
   - Click vào distribution ID để xem chi tiết

4. **Tab "Origins and Origin Groups":**
   - Xem origin hiện tại (có thể là S3 bucket)
   - Click **"Create origin"** hoặc **"Edit"** origin hiện tại

5. **Cấu hình Origin mới cho EC2:**
   - **Origin domain:** `54.169.66.118`
   - **Name:** `ec2-origin` (hoặc tên bạn muốn)
   - **Origin protocol:** `HTTP Only` (vì server chưa có SSL)
   - **HTTP port:** `80`
   - **HTTPS port:** `443`
   - **Origin protocol policy:** `HTTP Only`
   - Click **"Create origin"** hoặc **"Save changes"**

6. **Tab "Behaviors":**
   - Chọn default behavior (hoặc behavior bạn muốn sửa)
   - Click **"Edit"**
   - **Origin and origin groups:** Chọn origin EC2 mới tạo (`ec2-origin`)
   - Click **"Save changes"**

7. **Đợi CloudFront deploy:**
   - Status sẽ chuyển từ "Deployed" sang "In Progress"
   - Đợi **15-20 phút** để CloudFront cập nhật

8. **Invalidate Cache:**
   - Vào tab **"Invalidations"**
   - Click **"Create invalidation"**
   - **Object paths:** `/*`
   - Click **"Create invalidation"**
   - Đợi vài phút để cache được xóa

9. **Test lại:**
   - Truy cập: `https://d39438he2ixn2j.cloudfront.net/shop`
   - Nếu vẫn lỗi, đợi thêm vài phút và thử lại

### Cách 2: Cấu hình AWS CLI trên server (nếu muốn dùng script)

Nếu bạn muốn chạy script tự động, cần cấu hình AWS credentials:

1. **SSH vào server:**
```bash
ssh -i ~/.ssh/pickleball_key.pem ubuntu@54.169.66.118
```

2. **Cấu hình AWS credentials:**
```bash
aws configure
```

Nhập thông tin:
- **AWS Access Key ID:** [Access key của bạn]
- **AWS Secret Access Key:** [Secret key của bạn]
- **Default region name:** `ap-southeast-1` (hoặc region của bạn)
- **Default output format:** `json`

3. **Hoặc tạo file credentials thủ công:**
```bash
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

cat > ~/.aws/config << EOF
[default]
region = ap-southeast-1
output = json
EOF
```

4. **Test AWS CLI:**
```bash
aws sts get-caller-identity
```

5. **Chạy script sửa CloudFront:**
```bash
# Script đã được tạo sẵn trên server tại ~/fix-cloudfront-all-in-one.sh
# Nếu chưa có, copy từ local:
# scp -i ~/.ssh/pickleball_key.pem fix-cloudfront-all-in-one.sh ubuntu@54.169.66.118:~/

chmod +x ~/fix-cloudfront-all-in-one.sh
~/fix-cloudfront-all-in-one.sh
```

## 📋 Checklist sau khi sửa:

- [ ] CloudFront origin đã trỏ đến `54.169.66.118`
- [ ] Default behavior đã sử dụng origin EC2
- [ ] CloudFront distribution đã deploy xong (status = "Deployed")
- [ ] Đã invalidate cache với path `/*`
- [ ] Test lại URL: `https://d39438he2ixn2j.cloudfront.net/shop`

## ⚠️ Lưu ý quan trọng:

1. **Security Group của EC2:**
   - Đảm bảo Security Group cho phép HTTP (port 80) từ `0.0.0.0/0`
   - CloudFront cần truy cập được vào EC2 server

2. **Thời gian deploy:**
   - CloudFront distribution update mất **15-20 phút**
   - Không thể rush được, phải đợi

3. **Cache:**
   - Sau khi sửa, **phải invalidate cache** để thấy thay đổi ngay
   - Nếu không invalidate, có thể phải đợi TTL của cache (có thể vài giờ)

4. **Nếu vẫn lỗi sau 20 phút:**
   - Kiểm tra Security Group
   - Kiểm tra Nginx logs: `docker logs project_tmdt_nginx_1`
   - Kiểm tra CloudFront logs trong AWS Console

## 🎯 Tóm tắt:

**Vấn đề:** CloudFront đang trỏ đến S3 bucket nhưng bucket không có quyền → Lỗi Access Denied

**Giải pháp:** Đổi CloudFront origin từ S3 sang EC2 server (54.169.66.118)

**Cách làm:** Sửa qua AWS Console (Cách 1) hoặc dùng AWS CLI với script (Cách 2)

**Thời gian:** 15-20 phút để CloudFront deploy + vài phút để invalidate cache

