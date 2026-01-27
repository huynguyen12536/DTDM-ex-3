const path = require("path");
const fs = require("fs");

// Đảm bảo load .env từ đúng thư mục
const envPath = path.join(__dirname, ".env");
require("dotenv").config({ path: envPath });

// Debug: Kiểm tra file .env
if (!fs.existsSync(envPath)) {
  console.error("❌ File .env KHÔNG TỒN TẠI tại:", envPath);
  console.log("\n💡 Hướng dẫn:");
  console.log("   1. Tạo file .env trong thư mục backend");
  console.log("   2. Thêm các biến môi trường sau:");
  console.log("      AWS_ACCESS_KEY_ID=your_access_key");
  console.log("      AWS_SECRET_ACCESS_KEY=your_secret_key");
  console.log("      AWS_REGION=ap-southeast-2");
  console.log("      S3_BUCKET_NAME=data.lababa");
  console.log("\n📖 Xem hướng dẫn chi tiết trong file S3_SETUP.md");
  process.exit(1);
}

const uploadImage = require("./src/utils/uploadImage");

// Test với một base64 image nhỏ (1x1 pixel red PNG)
const testBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

console.log("🔍 Kiểm tra cấu hình S3...");
console.log(`📁 Đường dẫn .env: ${envPath}\n`);

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
    console.log(`❌ ${varName}: CHƯA ĐƯỢC CẤU HÌNH`);
  } else {
    // Ẩn giá trị nhạy cảm
    if (varName.includes("SECRET") || varName.includes("KEY")) {
      const value = process.env[varName];
      const masked = value.substring(0, 4) + "***" + value.substring(value.length - 4);
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    }
  }
});

if (missingVars.length > 0) {
  console.log("\n⚠️  Còn thiếu các biến môi trường sau:");
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log("\nVui lòng thêm vào file .env và thử lại!");
  process.exit(1);
}

console.log("\n✅ Tất cả biến môi trường đã được cấu hình!");
console.log("\n🚀 Bắt đầu test upload...\n");

// Test upload
uploadImage(testBase64Image)
  .then((url) => {
    console.log("✅ Upload thành công!");
    console.log(`📸 URL ảnh: ${url}`);
    console.log("\n🎉 Test hoàn tất! S3 upload đang hoạt động tốt.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Upload thất bại!");
    console.error("Lỗi:", error.message);
    
    // Gợi ý khắc phục
    if (error.message.includes("Access Denied") || error.message.includes("InvalidAccessKeyId")) {
      console.log("\n💡 Gợi ý:");
      console.log("   - Kiểm tra lại AWS_ACCESS_KEY_ID và AWS_SECRET_ACCESS_KEY");
      console.log("   - Đảm bảo IAM user có quyền truy cập S3 bucket");
    } else if (error.message.includes("endpoint")) {
      console.log("\n💡 Gợi ý:");
      console.log("   - Kiểm tra AWS_REGION có đúng với region của bucket không");
    } else if (error.message.includes("NoSuchBucket")) {
      console.log("\n💡 Gợi ý:");
      console.log("   - Kiểm tra S3_BUCKET_NAME có đúng không");
      console.log("   - Đảm bảo bucket đã được tạo");
    }
    
    process.exit(1);
  });
