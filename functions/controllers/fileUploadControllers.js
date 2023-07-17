import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
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
  // STEP 1 : PROCESSING FILE INFORMATION
  const { fileType } = req.body;
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  //   STEP 2 : CREATING  THE COMMAND TO OUR BUCKET HOLDING THE NECESSARY KEY
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Key,
  });
  try {
    const signedUrl = getSignedUrl(client, command, { expiresIn: 3000 });
    res.status(201).json({ signedUrl, Key });
  } catch (err) {
    console.error(err);
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

export { getSignedFileUrl, deleteFile };
