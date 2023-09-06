const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { randomBytes } = require("crypto");
const config = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
};
// Instantiate a new s3 client
const client = new S3Client(config);

const getSignedFileUrl = async (req, res) => {
  try {
    // STEP 1 : PROCESSING FILE INFORMATION
    const { fileType } = req.body;
    const rawBytes = randomBytes(16);
    const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
    const fileExtension = fileType && fileType.split("/")[1];
    const Key = `${fileName}.${fileExtension}`;
    //   STEP 2 : CREATING  THE COMMAND TO OUR BUCKET HOLDING THE NECESSARY KEY
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    res.status(201).json({ signedUrl, Key });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate signed url" });
  }
};
const getFile = async (req, res) => {
  const { fileKey } = req.params;
  console.log(`Fetching file ${fileKey}`);
  try {
    const downloadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new GetObjectCommand(downloadParams);
    const response = await client.send(command);

    response.Body.pipe(res);
  } catch (error) {
    res.status(400).json({ message: "Could not retrieve file from S3" });
  }
};

const deleteResourceFromS3Bucket = async ({ resourceID }) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: resourceID,
  });
  await client.send(command);
};

const deleteFile = async (req, res) => {
  try {
    const { fileKey } = req.params;
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });
    await client.send(command);
    res.status(200).json({ message: "File deleted successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Could not delete file from S3 Bucket" });
  }
};

module.exports = {
  getSignedFileUrl,
  getFile,
  deleteFile,
  deleteResourceFromS3Bucket,
};
