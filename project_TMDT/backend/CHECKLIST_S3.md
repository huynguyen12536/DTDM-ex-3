# ✅ Checklist Kiểm tra S3 Upload

## 📋 Các bước đã hoàn thành

- [x] Code đã được cập nhật để sử dụng S3
- [x] Dependencies đã được thêm vào package.json
- [x] File test đã được tạo

## 🔍 Kiểm tra cấu hình

### 1. Kiểm tra file .env

Đảm bảo file `.env` trong thư mục `backend` có các biến sau:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-southeast-2
S3_BUCKET_NAME=data.lababa
```

### 2. Kiểm tra packages đã cài đặt

Chạy lệnh:
```bash
cd DTDM-ex-3/project_TMDT/backend
npm install
```

Đảm bảo các package sau đã được cài:
- `@aws-sdk/client-s3`
- `uuid`

### 3. Kiểm tra S3 Bucket

Đảm bảo:
- ✅ Bucket `data.lababa` đã được tạo
- ✅ Bucket policy cho phép public read (xem S3_SETUP.md)
- ✅ Block Public Access đã được tắt (nếu cần public access)
- ✅ IAM user có quyền upload vào bucket

## 🧪 Test Upload

### Cách 1: Chạy script test (Khuyến nghị)

```bash
cd DTDM-ex-3/project_TMDT/backend
npm run test:s3
```

Hoặc:

```bash
cd DTDM-ex-3/project_TMDT/backend
node test-s3-upload.js
```

### Cách 2: Test qua API

1. Khởi động server:
```bash
cd DTDM-ex-3/project_TMDT/backend
npm start
```

2. Gửi POST request đến `http://localhost:5000/api/uploadImage` với body:
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

3. Nếu thành công, sẽ nhận được URL của ảnh trên S3

## ❌ Xử lý lỗi thường gặp

### Lỗi: "Access Denied" hoặc "InvalidAccessKeyId"
- Kiểm tra lại `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY` trong `.env`
- Đảm bảo IAM user có quyền `s3:PutObject` và `s3:GetObject`

### Lỗi: "The bucket you are attempting to access must be addressed using the specified endpoint"
- Kiểm tra `AWS_REGION` có đúng với region của bucket không
- Region phổ biến:
  - `ap-southeast-2` - Sydney
  - `ap-southeast-1` - Singapore
  - `us-east-1` - US East

### Lỗi: "NoSuchBucket"
- Kiểm tra `S3_BUCKET_NAME` có đúng không
- Đảm bảo bucket đã được tạo trong AWS Console

### Ảnh upload thành công nhưng không hiển thị (403 Forbidden)
- Kiểm tra bucket policy đã cho phép public read chưa
- Kiểm tra Block Public Access settings

## 📝 Checklist cuối cùng

Trước khi test, đảm bảo:

- [ ] File `.env` có đủ 4 biến môi trường
- [ ] Đã chạy `npm install`
- [ ] S3 bucket đã được cấu hình đúng
- [ ] IAM user có đủ quyền
- [ ] Đã sẵn sàng để test!
