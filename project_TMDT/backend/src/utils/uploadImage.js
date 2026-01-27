/**
 * Upload image to S3 using base64
 * Nhận base64 string từ frontend và upload lên S3
 */

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

// Cấu hình S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  },
  forcePathStyle: true, // Required for bucket names with dots like data.lababa
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "data.lababa";

/**
 * Chuyển đổi base64 string thành buffer
 * @param {string} base64String - Base64 string (có thể có prefix data:image/...)
 * @returns {Object} - { buffer: Buffer, contentType: string }
 */
function base64ToBuffer(base64String) {
  if (!base64String || typeof base64String !== "string") {
    throw new Error("Invalid base64 string");
  }

  // Loại bỏ prefix nếu có (data:image/jpeg;base64, hoặc data:image/png;base64,)
  let base64Data = base64String;
  let contentType = "image/jpeg"; // default

  // Xác định content type từ base64 string và loại bỏ prefix
  if (base64String.startsWith("data:")) {
    const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      contentType = matches[1];
      base64Data = matches[2];
    } else {
      // Nếu có data: nhưng không đúng format, thử loại bỏ phần đầu
      base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    }
  }

  // Xác định content type nếu chưa có
  if (contentType === "image/jpeg" && base64String.includes("data:image/png")) {
    contentType = "image/png";
  } else if (base64String.includes("data:image/jpeg") || base64String.includes("data:image/jpg")) {
    contentType = "image/jpeg";
  } else if (base64String.includes("data:image/gif")) {
    contentType = "image/gif";
  } else if (base64String.includes("data:image/webp")) {
    contentType = "image/webp";
  }

  // Validate base64 string
  if (!base64Data || base64Data.trim() === "") {
    throw new Error("Empty base64 data after removing prefix");
  }

  // Decode base64
  let buffer;
  try {
    buffer = Buffer.from(base64Data, "base64");
  } catch (error) {
    throw new Error(`Invalid base64 encoding: ${error.message}`);
  }

  // Validate buffer không rỗng
  if (!buffer || buffer.length === 0) {
    throw new Error("Decoded buffer is empty");
  }

  return { buffer, contentType };
}

/**
 * Upload image lên S3
 * @param {string} image - Base64 string của image
 * @returns {Promise<string>} - URL của image đã upload
 */
module.exports = (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Chuyển đổi base64 sang buffer
      const { buffer, contentType } = base64ToBuffer(image);

      // Tạo tên file unique
      const fileExtension = contentType.split("/")[1] || "jpg";
      const fileName = `images/${uuidv4()}.${fileExtension}`;

      // Upload lên S3
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "max-age=31536000", // Cache 1 year
      };

      // ACL chỉ hoạt động nếu bucket cho phép (có thể bỏ qua nếu dùng bucket policy)
      // Nếu bucket đã cấu hình public read qua bucket policy, không cần ACL
      if (process.env.S3_USE_ACL === "true") {
        uploadParams.ACL = "public-read";
      }

      const command = new PutObjectCommand(uploadParams);

      console.log(`📤 Uploading to S3: ${fileName}`);
      console.log(`   Bucket: ${BUCKET_NAME}`);
      console.log(`   Content-Type: ${contentType}`);
      console.log(`   Buffer size: ${buffer.length} bytes`);

      const result = await s3Client.send(command);

      console.log(`✅ Upload successful to S3`);
      console.log(`   ETag: ${result.ETag}`);

      // Build the final image URL
      const cdnUrl = process.env.IMAGE_CDN_URL || process.env.CLOUDFRONT_URL;
      const region = process.env.AWS_REGION || "ap-southeast-2";
      let imageUrl;

      if (cdnUrl) {
        // Ensure cdnUrl doesn't end with /
        const baseCdn = cdnUrl.endsWith('/') ? cdnUrl.slice(0, -1) : cdnUrl;
        imageUrl = `${baseCdn}/${fileName}`;
      } else {
        // Fallback to S3 path-style URL (Required for bucket names with dots)
        imageUrl = `https://s3.${region}.amazonaws.com/${BUCKET_NAME}/${fileName}`;
      }

      console.log(`   URL: ${imageUrl}`);

      return resolve(imageUrl);
    } catch (error) {
      console.error("❌ S3 Upload Error:");
      console.error("   Message:", error.message);
      console.error("   Code:", error.Code || error.code);
      console.error("   Stack:", error.stack);
      return reject({
        message: error.message,
        code: error.Code || error.code,
        details: error.toString()
      });
    }
  });
};












