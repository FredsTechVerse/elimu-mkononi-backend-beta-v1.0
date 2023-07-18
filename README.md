# ELIMU MKONONI BACKEND

- Where we make revision easy and fun!

## TO DO

- Get rid of the access denied error when fetching course image by setting the bucket rules correctly!

## TIPS I HAVE GATHERED ALONG THE WAY

- Its simply a group of computers that can host serveral database(s) with a limit attached not to the no of databases but the total number collections and space that they can take up!
- Scope is like policy in aws.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

### OBSERVATIONS MADE WHILE WORKING WITH ENVIROMENT VARIABLES

1. Exclude apostrophes when defining string values,they will be placed automatically when the varibale is needed
2. KEY must always be writtend in capital letters underscore separated if need be.
3. Import dotenv in the root route... After this we do not need to import it again as it will already have served its purpose of loading the enviroment variables into the process.env object. This is only done locally hence using the following code
   `if (process.env.NODE_ENV !== "production") { require("dotenv").config();}`

### WORKING WITH THE S3 BUCKET

- Things have been harmnized and made simple where there is a common pattern to this operations :-

  1.  Generating a command with the following syntax body ` const command = new DeleteObjectCommand({   Bucket: process.env.AWS_BUCKET_NAME,Key: Key,});`

  - The command entails kinda like a callback function for performing our operation which is then passed to the specific bucket and the fileName (Key)
  - The commands include :-
    - GetObjectComand - Used for fetching a resource from the bucket
    - PutObjectCommand - Used for uploading a resource to the bucket
    - DeleteObjectCommand - Used for deleting a resource from the bucket
    - ListObjectsCommand - Used for listing all the resources in the bucket

  2.  We then invoke the method ` const response = await client.send(command);` and wallah we are done!What we do with our signed url is upto us!
  3.  Generating a presigned url is also simplified where we specify our command as normal ,then invoke the method `    const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });` and just like that we are done!

- Let us consume utilize jwt effectively by using the user data harnessed if possible instead of passing it manually.
