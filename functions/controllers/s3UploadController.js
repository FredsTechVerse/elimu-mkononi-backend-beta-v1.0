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
  // We shall specify version if needed.
});

// Fetches our file in a stream. Meaning we can start consuming our data as it arrives.
const getFileStream = async (fileKey) => {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    const data = await s3.getObject(downloadParams).createReadStream();
    return data;
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};

// Only interested with the file type.
const getSignedUrl = async (req, res) => {
  //The body simply contains the file type.
  const { fileType } = req.body;
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  console.log(`File name during signing URL ${Key} & fileType ${fileType}`);
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
  console.log(`Signed URL Params ${signedUrl}`);
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
    console.log(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

// EXPORTING THE TWO FUNCTIONS CREATED.
//======================================
module.exports = { getSignedUrl, getFileStream, deleteFile };
