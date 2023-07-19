const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
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
    console.log(`File Type passed ${fileType}`);
    const rawBytes = await randomBytes(16);
    const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
    const fileExtension = fileType && fileType.split("/")[1];
    const Key = `${fileName}.${fileExtension}`;
    //   STEP 2 : CREATING  THE COMMAND TO OUR BUCKET HOLDING THE NECESSARY KEY
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    console.log(signedUrl);
    res.status(201).json({ signedUrl, Key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate signed url" });
  }
};
const getFile = async (req, res) => {
  const { fileKey } = req.params;
  console.log(`File key ${fileKey}`);
  try {
    const downloadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new GetObjectCommand(downloadParams);
    const response = await client.send(command);
    const str = await response.Body.transformToString();
    // Get the image content as a buffer
    // const imageBuffer = await response.Body.transformToByteArray();

    // Determine the content type based on the file extension or other methods
    const contentType = "image/jpeg"; // Replace with the appropriate content type for your image
    res.set("Content-Type", contentType);
    res.send(str);
  } catch (error) {
    console.log(error);
    console.log(`S3 Resource retrieval access denied error!`);
    res.status(500).json({ message: "Could not retrieve file from S3" });
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
  } catch (err) {
    console.error(
      `Error that occured while deleting file ${JSON.stringify(err)}`
    );
  }
};

module.exports = { getSignedFileUrl, getFile, deleteFile };
