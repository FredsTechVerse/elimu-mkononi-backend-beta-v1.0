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

// Fetches our file in a stream. Meaning we can start consuming our data as it arrives.
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
  console.log(`Signed Url body is as follows ${JSON.stringify(req.body)}`);
  const { fileType } = await req.body;
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.fileType));
  // File name generation
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;

  // console.log(`File name during signing URL ${Key} & fileType ${fileType}`);
  // const contentType = (fileType) => {
  //   return fileType;
  // };
  // const params = {
  //   Bucket: bucketName, // The name of the bucket that you want to upload the file to
  //   ContentType: contentType(fileType), // This is the file type that you are uploading
  //   Key: Key, // Simply the name of the file at storage time
  //   Expires: 400, // The number of seconds the URL is valid for. Default is 900 seconds (15 minutes)
  // };

  const command = new GetObjectCommand({ Bucket: bucketName, Key: Key });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 400 }); // expires in seconds
  // const signedUrl = await client.getSignedUrl("putObject", params);
  console.log(`Signed URL Params ${signedUrl}`);
  res.status(201).json({ signedUrl, Key });
};

// EXPORTING THE TWO FUNCTIONS CREATED.
//======================================
module.exports = { getSignedUrl, getFileStream };
