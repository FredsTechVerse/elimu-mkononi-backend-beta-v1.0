const crypto = require("crypto");
const S3 = require("aws-sdk/clients/s3");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
const fs = require("fs");

// S3 CREDENTIALS
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Configuring credentials
//========================
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const getSignedUrl = async (req, res) => {
  const { fileType } = req.body;
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  const params = {
    Bucket: bucketName,
    ContentType: fileType,
    Key: Key,
    Expires: 300,
  };
  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  // const signedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${Key}`;
  res.status(201).json({ signedUrl, Key });
};

const deleteFile = async (req, res) => {
  const { Key } = req.body; // The name of the file you want to delete

  const params = {
    Bucket: bucketName,
    Key: Key,
  };

  try {
    await s3.deleteObject(params).promise();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete file" });
  }
};

// EXPORTING THE TWO FUNCTIONS CREATED.
//======================================
module.exports = { getSignedUrl, getFileStream, deleteFile };
