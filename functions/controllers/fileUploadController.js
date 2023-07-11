require("dotenv").config();
const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
const fs = require("fs");
// S3 CONFIGS
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// S3 CREDENTIALS
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Configuring credentials
//========================
const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const getFileStream = async (fileKey) => {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    const command = new GetObjectCommand(downloadParams);
    const response = await client.send(command);
    return response.Body;
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};

const getSignedUrl = async (req, res) => {
  const { fileType } = await req.body;
  // File name generation
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex");
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  const command = new GetObjectCommand({ Bucket: bucketName, Key: Key });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 400 }); // expires in seconds
  res.status(201).json({ signedUrl, Key });
};

module.exports = { getSignedUrl, getFileStream };
