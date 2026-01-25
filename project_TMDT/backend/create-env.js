const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, ".env.example");

console.log("📝 Tạo file .env...\n");

// Kiểm tra file .env đã tồn tại chưa
if (fs.existsSync(envPath)) {
  console.log("⚠️  File .env đã tồn tại!");
  console.log(`📁 Đường dẫn: ${envPath}`);
  console.log("\nNếu muốn tạo lại, hãy xóa file .env trước.");
  process.exit(0);
}

// Tạo file .env từ .env.example nếu có
if (fs.existsSync(envExamplePath)) {
  console.log("📋 Copy từ .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ Đã tạo file .env từ .env.example");
} else {
  // Tạo file .env mặc định
  console.log("📋 Tạo file .env mặc định...");
  const defaultEnv = `# AWS S3 Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-2
S3_BUCKET_NAME=data.lababa

# MongoDB Configuration
MONGODB_URL=mongodb://127.0.0.1:27017/lebaba_ecommerce

# Server Configuration
PORT=5000

# MoMo Payment Gateway Configuration (optional)
# MOMO_PARTNER_CODE=
# MOMO_ACCESS_KEY=
# MOMO_SECRET_KEY=
# MOMO_API_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
# FRONTEND_URL=http://localhost:5173
# BACKEND_URL=http://localhost:5000
`;
  fs.writeFileSync(envPath, defaultEnv);
  console.log("✅ Đã tạo file .env mới");
}

console.log(`\n📁 File .env đã được tạo tại: ${envPath}`);
console.log("\n⚠️  Vui lòng mở file .env và điền các giá trị thực tế!");
console.log("   Đặc biệt là các biến AWS S3:");
console.log("   - AWS_ACCESS_KEY_ID");
console.log("   - AWS_SECRET_ACCESS_KEY");
console.log("   - AWS_REGION");
console.log("   - S3_BUCKET_NAME");
console.log("\n📖 Xem hướng dẫn chi tiết trong file S3_SETUP.md");
