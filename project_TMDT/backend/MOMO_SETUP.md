# Hướng dẫn tích hợp MoMo Payment Gateway

## 1. Đăng ký tài khoản MoMo

1. Truy cập: https://developers.momo.vn/
2. Đăng ký tài khoản merchant
3. Tạo ứng dụng và lấy thông tin:
   - Partner Code
   - Access Key
   - Secret Key

## 2. Cấu hình Environment Variables

Thêm vào file `.env` trong thư mục `backend`:

```env
# MoMo Payment Gateway Configuration
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_API_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# Frontend URL (for redirect after payment)
FRONTEND_URL=http://localhost:5173

# Backend URL (for MoMo callback)
BACKEND_URL=http://localhost:5000
```

**Lưu ý:**
- Sử dụng `https://test-payment.momo.vn` cho môi trường test
- Sử dụng `https://payment.momo.vn` cho môi trường production

## 3. Cấu hình Callback URL

Trong MoMo Developer Portal, cấu hình:
- **Return URL**: `http://localhost:5173/success` (hoặc domain production của bạn)
- **Notify URL (IPN)**: `http://localhost:5000/api/orders/momo-callback` (hoặc domain production của bạn)

## 4. Test Payment

1. Khởi động backend và frontend
2. Đăng nhập vào hệ thống
3. Thêm sản phẩm vào giỏ hàng
4. Bấm "Thanh toán MoMo"
5. Sẽ redirect đến trang thanh toán MoMo
6. Sử dụng tài khoản MoMo test để thanh toán

## 5. Xử lý Callback

Backend tự động xử lý callback từ MoMo và cập nhật trạng thái đơn hàng:
- `resultCode = 0`: Thanh toán thành công → Order status = "pending"
- `resultCode != 0`: Thanh toán thất bại → Order status = "failed"

## 6. Troubleshooting

### Lỗi "Invalid signature"
- Kiểm tra lại MOMO_SECRET_KEY trong `.env`
- Đảm bảo signature được tạo đúng theo format của MoMo

### Lỗi "Cannot connect to MoMo"
- Kiểm tra MOMO_API_ENDPOINT
- Kiểm tra kết nối internet
- Kiểm tra firewall/network settings

### Payment link không hoạt động
- Kiểm tra Return URL và Notify URL trong MoMo Developer Portal
- Đảm bảo URLs là public accessible (không dùng localhost cho production)


