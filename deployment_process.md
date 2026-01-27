# Quy trình Deploy Thủ công (Manual Docker Deployment)

Quy trình này mô tả cách triển khai ứng dụng lên Server một cách thủ công mà không phụ thuộc vào GitHub Actions hay các hệ thống tự động (GHCR).

## 1. Chuẩn bị trên máy cá nhân
Trước khi deploy, hãy đảm bảo bạn đã đẩy toàn bộ thay đổi lên GitHub:
```powershell
git add .
git commit -m "update code"
git push origin main
```

---

## 2. Quy trình Deploy thủ công trên Server

Bạn cần thực hiện các bước sau mỗi khi muốn cập nhật ứng dụng:

### Bước 1: SSH vào Server
Dùng Terminal (hoặc PowerShell) để kết nối vào VPS của bạn:
```bash
ssh -i "duong/dan/den/key.pem" ubuntu@<SERVER_IP>
```

### Bước 2: Cập nhật mã nguồn mới nhất
Di chuyển vào thư mục dự án và kéo code mới từ GitHub về:
```bash
cd project/project_TMDT
git pull origin main
```

### Bước 3: Build và khởi động lại ứng dụng
Sử dụng Docker Compose để build lại các image trực tiếp trên server và khởi chạy container:
```bash
# Build lại các image từ source code vừa pull về
sudo docker compose build

# Khởi động lại các container
sudo docker compose up -d
```

---

## 3. Cách kiểm tra trạng thái

- **Kiểm tra các container đang chạy**:
  ```bash
  sudo docker ps
  ```
- **Xem nhật ký (logs) để kiểm tra lỗi**:
  ```bash
  sudo docker compose logs -f backend
  ```
- **Xóa các image cũ để giải phóng bộ nhớ (không bắt buộc)**:
  ```bash
  sudo docker image prune -f
  ```

---

## 4. Lưu ý quan trọng
- **Tốc độ**: Quy trình này sẽ chậm hơn deploy tự động vì Server phải tự mình thực hiện các bước Build (tốn CPU và RAM).
- **Tính nhất quán**: Đảm bảo file `.env` trên Server đã được cấu hình đầy đủ các tham số bí mật (Secrets).
- **Thủ công**: Bạn phải lặp lại các bước này trên **từng Server** nếu bạn có nhiều máy chủ.

---
> [!IMPORTANT]
> **Khi nào dùng cách này?** Khi bạn muốn kiểm soát hoàn toàn quá trình build hoặc khi hệ thống CI/CD gặp sự cố.
