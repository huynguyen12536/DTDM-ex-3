const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const bucket = process.env.S3_BUCKET_NAME || "data.lababa";
const key = "images/c1e9b7a1-a338-4bd1-93db-b917c5d1e43e.png";

async function check() {
  try {
    const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
    const response = await client.send(command);
    console.log("✅ File exists in S3!");
    console.log("   Content-Type:", response.ContentType);
    console.log("   Size:", response.ContentLength);
    console.log("   Metadata:", response.Metadata);
  } catch (error) {
    console.error("❌ File NOT found or S3 error:", error.message);
  }
}

check();
