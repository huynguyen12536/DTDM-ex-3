const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const https = require("https");
const fs = require("fs");

// URL ảnh cần kiểm tra (thay bằng URL thực tế của bạn)
const imageUrl = process.argv[2] || "https://data.lababa.s3.ap-southeast-2.amazonaws.com/images/ca8be9dc-6577-46bd-8e85-b1778b6185aa.png";

console.log("🔍 Kiểm tra ảnh trên S3...\n");
console.log(`📸 URL: ${imageUrl}\n`);

// Download và kiểm tra ảnh
https.get(imageUrl, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`);
  console.log(`   Content-Type: ${res.headers["content-type"]}`);
  console.log(`   Content-Length: ${res.headers["content-length"]} bytes`);
  console.log(`   Content-Encoding: ${res.headers["content-encoding"] || "none"}`);
  console.log(`   Cache-Control: ${res.headers["cache-control"] || "none"}`);
  
  if (res.statusCode !== 200) {
    console.error(`\n❌ Lỗi: HTTP ${res.statusCode}`);
    process.exit(1);
  }
  
  const chunks = [];
  res.on("data", (chunk) => {
    chunks.push(chunk);
  });
  
  res.on("end", () => {
    const buffer = Buffer.concat(chunks);
    console.log(`\n✅ Đã tải xuống: ${buffer.length} bytes`);
    
    // Kiểm tra magic bytes để xác định loại file
    const magicBytes = buffer.slice(0, 8);
    const hex = magicBytes.toString("hex");
    
    console.log(`\n🔍 Magic Bytes (hex): ${hex}`);
    
    let fileType = "Unknown";
    if (hex.startsWith("89504e47")) {
      fileType = "PNG";
    } else if (hex.startsWith("ffd8ff")) {
      fileType = "JPEG";
    } else if (hex.startsWith("474946")) {
      fileType = "GIF";
    } else if (hex.startsWith("52494646")) {
      fileType = "WEBP";
    }
    
    console.log(`📄 Loại file phát hiện: ${fileType}`);
    
    // Kiểm tra nếu tất cả bytes đều giống nhau (có thể là ảnh đen)
    const firstByte = buffer[0];
    const allSame = buffer.every(byte => byte === firstByte);
    
    if (allSame && buffer.length > 100) {
      console.log(`\n⚠️  CẢNH BÁO: Tất cả bytes đều giống nhau (${firstByte.toString(16)})`);
      console.log(`   Điều này có thể cho thấy ảnh bị corrupt hoặc chỉ có một màu.`);
    }
    
    // Lưu file để kiểm tra thủ công
    const outputPath = path.join(__dirname, "test-downloaded-image.png");
    fs.writeFileSync(outputPath, buffer);
    console.log(`\n💾 Đã lưu ảnh tại: ${outputPath}`);
    console.log(`   Mở file này để kiểm tra ảnh có hiển thị đúng không.`);
    
    if (buffer.length < 100) {
      console.log(`\n⚠️  CẢNH BÁO: File quá nhỏ (${buffer.length} bytes), có thể bị corrupt.`);
    }
    
    console.log("\n✅ Kiểm tra hoàn tất!");
  });
}).on("error", (error) => {
  console.error("\n❌ Lỗi khi tải ảnh:", error.message);
  process.exit(1);
});
