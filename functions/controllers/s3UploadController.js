require("dotenv").config();
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

const getFileStream = (key, { start, end } = {}) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Range: `bytes=${start || 0}-${end || ""}`,
  };

  return s3.getObject(params).createReadStream();
};

const getSignedUrl = async (req, res) => {
  const { fileType } = req.body;
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  const contentType = (fileType) => {
    return fileType;
  };
  const params = {
    Bucket: bucketName, // The name of the bucket that you want to upload the file to
    ContentType: contentType(fileType), // This is the file type that you are uploading
    Key: Key, // Simply the name of the file at storage time
    Expires: 400, // The number of seconds the URL is valid for. Default is 900 seconds (15 minutes)
  };
  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  res.status(201).json({ signedUrl, Key });
};

const deleteFile = async (req, res) => {
  const { Key } = req.body; // The key of the file you want to delete

  const params = {
    Bucket: bucketName, // The name of your S3 bucket
    Key: Key, // The key of the file to delete
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
