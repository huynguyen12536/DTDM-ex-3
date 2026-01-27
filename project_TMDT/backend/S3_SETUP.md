# Hướng dẫn cấu hình AWS S3 cho Image Upload

## 📋 Yêu cầu

Để sử dụng S3 cho việc upload ảnh, bạn cần có:

1. **AWS Account** với quyền truy cập S3
2. **S3 Bucket** đã được tạo (ví dụ: `data.lababa`)
3. **AWS Access Key ID** và **Secret Access Key**
4. **Region** của bucket (ví dụ: `ap-southeast-2` cho Sydney)

---

## 🔧 Các bước cấu hình

### 1. Cài đặt Dependencies

Chạy lệnh sau trong thư mục `backend`:

```bash
npm install @aws-sdk/client-s3 uuid
```

### 2. Tạo AWS IAM User và Access Keys

1. Đăng nhập vào **AWS Console**
2. Vào **IAM** (Identity and Access Management)
3. Chọn **Users** → **Create user**
4. Đặt tên user (ví dụ: `s3-upload-user`)
5. Chọn **Attach policies directly** và chọn policy: **AmazonS3FullAccess** (hoặc tạo custom policy với quyền hạn chế hơn)
6. Sau khi tạo user, vào tab **Security credentials**
7. Click **Create access key**
8. Chọn **Application running outside AWS**
9. **Lưu lại** `Access Key ID` và `Secret Access Key` (chỉ hiển thị 1 lần!)

### 3. Cấu hình S3 Bucket

#### 3.1. Cấu hình Bucket Policy (cho phép public read)

1. Vào **S3 Console** → Chọn bucket của bạn (`data.lababa`)
2. Vào tab **Permissions**
3. Scroll xuống **Bucket policy** → Click **Edit**
4. Thêm policy sau (thay `data.lababa` bằng tên bucket của bạn):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::data.lababa/*"
        }
    ]
}
```

5. Click **Save changes**

#### 3.2. Tắt Block Public Access (nếu cần)

1. Vẫn trong tab **Permissions**
2. Scroll xuống **Block public access (bucket settings)**
3. Click **Edit**
4. **Bỏ chọn** "Block all public access" (hoặc chỉ bỏ chọn "Block public access to buckets and objects granted through new access control lists (ACLs)")
5. Xác nhận và **Save changes**

⚠️ **Lưu ý**: Chỉ làm điều này nếu bạn muốn ảnh có thể truy cập công khai qua URL.

#### 3.3. Cấu hình CORS (nếu cần cho frontend)

1. Vào tab **Permissions**
2. Scroll xuống **Cross-origin resource sharing (CORS)**
3. Click **Edit** và thêm cấu hình:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

4. Click **Save changes**

### 4. Cấu hình Environment Variables

Thêm các biến môi trường sau vào file `.env` của bạn:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=ap-southeast-2
S3_BUCKET_NAME=data.lababa
```

**Lưu ý**: 
- Thay `your_access_key_id_here` và `your_secret_access_key_here` bằng credentials thực tế
- Thay `ap-southeast-2` bằng region của bucket bạn (có thể kiểm tra trong S3 Console)
- Thay `data.lababa` bằng tên bucket của bạn

### 5. Kiểm tra Region của Bucket

Để biết region của bucket:
1. Vào **S3 Console**
2. Chọn bucket của bạn
3. Xem ở góc trên bên phải, sẽ hiển thị region (ví dụ: `Châu Á Thái Bình Dương (Sydney)` = `ap-southeast-2`)

**Một số region phổ biến:**
- `ap-southeast-2` - Sydney, Australia
- `ap-southeast-1` - Singapore
- `us-east-1` - US East (N. Virginia)
- `us-west-2` - US West (Oregon)
- `eu-west-1` - Europe (Ireland)

---

## 🧪 Kiểm tra

Sau khi cấu hình xong, bạn có thể test bằng cách:

1. Khởi động server: `npm start` hoặc `npm run start:dev`
2. Gửi POST request đến `/api/uploadImage` với body:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```
3. Nếu thành công, sẽ nhận được URL của ảnh trên S3

---

## 🔒 Bảo mật

⚠️ **Quan trọng**: 
- **KHÔNG** commit file `.env` lên Git
- Sử dụng **IAM roles** thay vì access keys khi deploy lên AWS (EC2, Lambda, etc.)
- Giới hạn quyền của IAM user chỉ cho bucket cụ thể (không dùng `AmazonS3FullAccess` trong production)

### Custom IAM Policy (Khuyến nghị)

Thay vì dùng `AmazonS3FullAccess`, tạo custom policy với quyền hạn chế:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::data.lababa/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::data.lababa"
        }
    ]
}
```

---

## 📝 Thông tin cần cung cấp

Nếu bạn cần hỗ trợ, hãy cung cấp:
1. ✅ Tên bucket: `data.lababa` (đã có)
2. ❓ Region của bucket: `?` (cần xác nhận)
3. ❓ AWS Access Key ID: `?` (cần tạo)
4. ❓ AWS Secret Access Key: `?` (cần tạo)

---

## 🆘 Troubleshooting

### Lỗi: "Access Denied"
- Kiểm tra lại Access Key ID và Secret Access Key
- Kiểm tra IAM policy có đủ quyền không
- Kiểm tra bucket policy

### Lỗi: "The bucket you are attempting to access must be addressed using the specified endpoint"
- Kiểm tra lại `AWS_REGION` trong `.env` có đúng với region của bucket không

### Lỗi: "InvalidAccessKeyId"
- Kiểm tra lại `AWS_ACCESS_KEY_ID` trong `.env`

### Ảnh không hiển thị (403 Forbidden)
- Kiểm tra bucket policy đã cho phép public read chưa
- Kiểm tra Block Public Access settings
