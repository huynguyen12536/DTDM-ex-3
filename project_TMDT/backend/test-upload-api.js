const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Test với một base64 image
const testBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQIHWP4z8Dw/z8DHQMAFgABfR7H6gAAAABJRU5ErkJggg==";

const API_URL = process.env.API_URL || "http://localhost:5000/api/uploadImage";

console.log("🧪 Test Upload API...\n");
console.log(`📡 API URL: ${API_URL}\n`);

// Sử dụng fetch hoặc axios
const http = require("http");
const url = require("url");

const parsedUrl = url.parse(API_URL);
const postData = JSON.stringify({ image: testBase64Image });

const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
  path: parsedUrl.path,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

console.log("📤 Sending request...");
console.log(`   Host: ${options.hostname}:${options.port}`);
console.log(`   Path: ${options.path}`);
console.log(`   Image data size: ${testBase64Image.length} bytes\n`);

const req = http.request(options, (res) => {
  console.log(`📥 Response Status: ${res.statusCode}`);
  console.log(`📋 Response Headers:`, res.headers);
  console.log();

  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    if (res.statusCode === 200) {
      console.log("✅ Upload successful!");
      console.log(`📸 Image URL: ${data}`);
    } else {
      console.error("❌ Upload failed!");
      console.error(`   Status: ${res.statusCode}`);
      try {
        const error = JSON.parse(data);
        console.error(`   Error:`, error);
      } catch (e) {
        console.error(`   Response:`, data);
      }
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request error:", error.message);
  console.error("\n💡 Gợi ý:");
  console.error("   - Đảm bảo server đang chạy: npm start");
  console.error("   - Kiểm tra API_URL trong .env hoặc thay đổi trong script");
});

req.write(postData);
req.end();
