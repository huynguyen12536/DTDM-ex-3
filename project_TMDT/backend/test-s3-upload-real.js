const path = require("path");
const fs = require("fs");

// Đảm bảo load .env từ đúng thư mục
const envPath = path.join(__dirname, ".env");
require("dotenv").config({ path: envPath });

const uploadImage = require("./src/utils/uploadImage");

// Test với một base64 image lớn hơn (một ảnh PNG 2x2 pixel màu đỏ)
// Ảnh này sẽ rõ ràng hơn khi hiển thị
const testBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQIHWP4z8Dw/z8DHQMAFgABfR7H6gAAAABJRU5ErkJggg==";

console.log("🔍 Test upload ảnh lên S3 (ảnh lớn hơn)...\n");

// Kiểm tra các biến môi trường
const requiredEnvVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "S3_BUCKET_NAME"
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error("❌ Thiếu biến môi trường:", missingVars.join(", "));
  process.exit(1);
}

console.log("✅ Tất cả biến môi trường đã được cấu hình!");
console.log("🚀 Bắt đầu test upload...\n");

// Test upload
uploadImage(testBase64Image)
  .then((url) => {
    console.log("\n✅ Upload thành công!");
    console.log(`📸 URL ảnh: ${url}`);
    console.log("\n💡 Mở URL trên trình duyệt để kiểm tra:");
    console.log(`   ${url}`);
    console.log("\n🎉 Test hoàn tất! S3 upload đang hoạt động tốt.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload thất bại!");
    console.error("Lỗi:", error.message);
    console.error(error);
    process.exit(1);
  });
