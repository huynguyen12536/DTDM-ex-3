const fs = require("fs");
const path = require("path");

console.log("🔍 Kiểm tra file .env...\n");

const envPath = path.join(__dirname, ".env");

// Load .env từ đường dẫn cụ thể
require("dotenv").config({ path: envPath });
const envExamplePath = path.join(__dirname, ".env.example");

// Kiểm tra file .env có tồn tại không
if (!fs.existsSync(envPath)) {
  console.log("❌ File .env KHÔNG TỒN TẠI!");
  console.log("\n📝 Tạo file .env từ .env.example...");
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("✅ Đã tạo file .env từ .env.example");
    console.log("⚠️  Vui lòng mở file .env và điền các giá trị thực tế!");
  } else {
    console.log("❌ File .env.example cũng không tồn tại!");
    console.log("\n📝 Tạo file .env mới...");
    const defaultEnv = `# AWS S3 Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-2
S3_BUCKET_NAME=data.lababa

# MongoDB Configuration
MONGODB_URL=mongodb://127.0.0.1:27017/lebaba_ecommerce

# Server Configuration
PORT=5000
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log("✅ Đã tạo file .env mới");
    console.log("⚠️  Vui lòng mở file .env và điền các giá trị!");
  }
  process.exit(1);
}

console.log("✅ File .env đã tồn tại\n");

// Kiểm tra các biến môi trường cần thiết cho S3
const requiredVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "S3_BUCKET_NAME"
];

console.log("📋 Kiểm tra các biến môi trường S3:\n");

let missingVars = [];
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === "" || value.includes("your_") || value.includes("here")) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: CHƯA ĐƯỢC CẤU HÌNH hoặc giá trị mẫu`);
  } else {
    if (varName.includes("SECRET") || varName.includes("KEY")) {
      const masked = value.substring(0, 4) + "***" + value.substring(value.length - 4);
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  }
});

if (missingVars.length > 0) {
  console.log("\n⚠️  Còn thiếu hoặc chưa cấu hình đúng các biến sau:");
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log("\n💡 Hướng dẫn:");
  console.log("   1. Mở file .env trong thư mục backend");
  console.log("   2. Điền các giá trị thực tế cho các biến trên");
  console.log("   3. Lưu file và chạy lại: npm run test:s3");
  console.log("\n📖 Xem hướng dẫn chi tiết trong file S3_SETUP.md");
  process.exit(1);
}

console.log("\n✅ Tất cả biến môi trường S3 đã được cấu hình!");
console.log("\n🚀 Bạn có thể chạy test: npm run test:s3");
