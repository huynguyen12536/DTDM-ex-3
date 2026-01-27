const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME || "data.lababa";

module.exports = async (req, res) => {
  try {
    const { fileType } = req.body; // image/jpeg, image/png, etc.

    if (!fileType || !fileType.startsWith("image/")) {
      return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
    }

    const extension = fileType.split("/")[1] || "jpg";
    const key = `images/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60, // URL expires in 60 seconds
    });

    const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION || "ap-southeast-2"}.amazonaws.com/${key}`;

    res.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("Presigned URL Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
