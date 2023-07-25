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
    const rawBytes = await randomBytes(16);
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
  try {
    const downloadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new GetObjectCommand(downloadParams);
    const response = await client.send(command);
    const str = await response.Body.transformToString();

    res.send(str);
  } catch (error) {
    res.status(401).json({ message: "Could not retrieve file from S3" });
  }
};
const deleteFile = async (req, res) => {
  const { Key } = req.body;
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Key,
  });
  try {
    const response = await client.send(command);
    res.status(201).json({ message: response });
  } catch (err) {}
};

module.exports = { getSignedFileUrl, getFile, deleteFile };
