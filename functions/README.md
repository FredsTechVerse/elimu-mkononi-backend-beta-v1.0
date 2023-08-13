# FIREBASE DEPLOYMENT OF EXPRESS APPLICATION.

This project is a guide to deploying an Express app using Firebase Functions.

# ELIMU HUB BACKEND

- Where we make revision easy and fun!

## TO DO

- User should not be able to update password until proper protocol for authentication , decryption and encryption after update is followed
- Swap most of the let with const in the db especially where we append the data once

#### MONGOOSE OPERATORS

A way for us to interact with our data stored in a bucket , the database.

- Enables us to conveniently issue instructions to the db in a precise yet shorter way.
- This operators are used as key value pairs where the key is the operator and the value is the value to be used in the operation. eg `Inventory.find({"quantity": { $gt: 5000}})`
- Not to forget that the operator is preceded by a dollar sign.
- They will go a long away in aiding in precision query. Eg the pull operator manipulates the database directly while removing token.
- Be careful with the order of the operator and key!

#### A DEEPER DIVE INTO THE S3 BUCKET

- Bucket policies, ACLs, and IAM policies provide various ways to control access to S3 buckets and their objects
- The "Block Public Access" checkbox is a master switch that overrides these permissions and blocks all public access when enabled.
- When both a bucket policy and an IAM policy apply to a user, the more restrictive policy takes precedence.
- Error messages are quite sleek. We get to know the error by the first line then additional found in the $metadataObject... All in betweeen is whining about where the error could be .
- CORS (Cross origin resource sharing) - Simply involves two domains talking to each other and that is why we have the CORS policy you know and the CORS configuration in the index.js you know , incase another domain wants to access our resources eg the way the frontend is accessing resources in the backend which are on two different domains.

#### DEFINATIONS

**_ Policy _** - This is a JSON document that defines who has access and explicitly states to which resources they have access to and what actions they can perform on those resources.
**_Statement_**- This is a JSON block [Array so can contain multiple objects] that contains the permissions being granted / denied as well us conditions (optional) associated with the permissions.

- It is worth noting that a policy can contain multiple statements and each statement can contain multiple permissions which grant/deny access to one or more resources.

**_Bucket Policies_**: Used to control access to an S3 bucket. They are applied at the bucket level and define who (principal) can perform specific actions (such as GetObject, PutObject, DeleteObject) on the objects within the bucket.

- Bucket policies are useful when you want to grant or restrict access to your bucket to specific principals, including AWS accounts, IAM users, IAM roles, or even anonymous users. They are typically used for cross-account access or granting public access to specific resources.

- **_IAM Policies:_** Used to control access to AWS resources at a broader level. They are attached to IAM users, groups, or roles and define what actions those entities can perform on which resources.
- IAM policies are not specific to S3 buckets but apply to a wide range of AWS services. They are used to manage access within an AWS account and are more granular and flexible compared to bucket policies.
- IAM policies can be used to control access to multiple buckets or other AWS resources, not just S3 buckets.

**_Access Control List (ACL)_** is a legacy method for controlling access to individual objects within an S3 bucket. It predates bucket policies and is an older permission system for S3.
**_ CORS (Cross-Origin Resource Sharing) policies _**come into play when you want to control access to resources in an S3 bucket from a web page served from a different origin.

#### IS A CORS POLICY NECESSARY IN BUCKET PERMISSIONS ?

- Bucket policies control access to S3 resources at the bucket level, defining who can perform specific actions on the bucket and its objects. On the other hand, CORS policies control access to S3 resources from web browsers when making cross-origin requests.
- In the sample CORS policy you provided, the configuration allows requests from any origin (AllowedOrigins: ["*"]) to access the S3 resources using the specified methods (AllowedMethods: ["PUT", "HEAD", "GET", "POST"]). It also allows any headers (AllowedHeaders: ["*"]) and doesn't specify any headers to be exposed (ExposeHeaders: []).

- By configuring the CORS policy, you enable cross-origin requests from web browsers, which is necessary if you plan to serve resources from your S3 bucket on web pages hosted on different origins. The CORS policy works alongside the bucket policy to provide the necessary access control and security measures.

**_IAM AND BUCKET POLICY STRUCTURES_**

Let's summarize the different properties in the provided bucket and IAM policies and explain what they mean:

**_Bucket Policy_**

- Version: Specifies the version of the policy language being used. In this case, it is "2012-10-17," indicating the policy language version.
- Id: An optional identifier for the policy. It can be used for reference or management purposes.
- Statement: An array of policy statements. Each statement defines a set of permissions.
  - Sid: An optional identifier for the statement, used for reference or management purposes.
  - Effect: Specifies whether the permissions defined in the statement are allowed or denied. In this case, it is set to "Allow," indicating the specified actions are allowed.
  - Principal: Specifies the entity to which the policy applies. In this case, it is set to "\_" (asterisk), indicating any user or entity.
  - Action: Specifies the actions allowed or denied. In this case, "s3:GetObject," "s3:PutObject," and "s3:DeleteObject" actions are allowed.
  - Resource: Specifies the ARN (Amazon Resource Name) of the bucket or objects to which the policy applies. In this case, it is set to "arn:aws:s3:::aws-rocking-bucket/\_," indicating the policy applies to objects within the "aws-rocking-bucket" bucket.

**_IAM Policy_**

- Version: Specifies the version of the policy language being used. In this case, it is "2012-10-17," indicating the policy language version.
- Statement: An array of policy statements. Each statement defines a set of permissions.
- Sid: An optional identifier for the statement, used for reference or management purposes.
  - Effect: Specifies whether the permissions defined in the statement are allowed or denied. In this case, it is set to "Allow," indicating the specified actions are allowed.
  - Action: Specifies the actions allowed or denied. In this case, "s3:PutObject," "s3:GetObject," and "s3:DeleteObject" actions are allowed.
  - Resource: Specifies the ARNs of the resources to which the policy applies. In this case, it includes the ARNs for three buckets: "arn:aws:s3:::kapesha001-demo/," "arn:aws:s3:::aws-rocking-bucket/," and "arn:aws:s3:::freds-portfolio/\_."

**_IAM Policy_**
`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::kapesha001-demo/*",
                "arn:aws:s3:::aws-rocking-bucket/*",
                "arn:aws:s3:::freds-portfolio/*"
            ]
        }
    ]
}`
**_Bucket Policy_**

{
"Version": "2012-10-17",
"Id": "Policy1675663952753",
"Statement": [
{
"Sid": "Stmt1675663908702",
"Effect": "Allow",
"Principal": "_",
"Action": [
"s3:GetObject",
"s3:PutObject",
"s3:DeleteObject"
],
"Resource": "arn:aws:s3:::aws-rocking-bucket/_"
}
]
}

To summarize, thE bucket policy allows any user (represented by "\_") to perform "s3:GetObject," "s3:PutObject," and "s3:DeleteObject" actions on objects within the "aws-rocking-bucket" bucket. The IAM policy grants an IAM user or role permissions to perform the same actions on objects within the "kapesha001-demo," "aws-rocking-bucket," and "freds-portfolio" buckets. Both policies use the "Allow" effect, indicating that the specified actions are permitted.

## TIPS I HAVE GATHERED ALONG THE WAY

- **_Cluster_**Its simply a group of computers that can host serveral database(s) with a limit to not the no of databases it can hold but the total number collections and space that they can take up!
- While dealing with the s3 bucket , incase of conflict of policies , the more restrictive policy takes precedence eg when we define both a bucket and iam policy.
- Youtube api scope is like policy in aws.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

### WORKING WITH ENVIROMENT VARIABLES

1. Exclude apostrophes when defining string values,they will be placed automatically when the varibale is needed
2. KEY must always be writtend in capital letters underscore separated if need be.
3. Import dotenv in the root route... After this we do not need to import it again as it will already have served its purpose of loading the enviroment variables into the process.env object. This is only done locally hence using the following code
   `if (process.env.NODE_ENV !== "production") { require("dotenv").config();}`

### WORKING WITH THE AWS SDK

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

## OPTIMIZATIONS

- Refactor auth controllers futher by passing the role ... Do this optimization , make sure they work properly... Then see how we can even improve perfomance using react hook forms.

## BACKEND TIPS

- By handling errors for each request, it really helps avoid crushing the server without reasonable cause.

### CONNECTION TEST

- This was a life saver .... Helps know exactly what the issue is.
  const db = mongoose.connection;

db.on("open", function (ref) {
connected = true;
});

db.on("connected", function (ref) {
connected = true;
});

db.on("disconnected", function (ref) {
connected = false;
});

db.on("close", function (ref) {
connected = false;
});

db.on("error", function (err) {
connected = false;
if (err.code == "ESERVFAIL") {
} else {
}
});

db.on("reconnect", function (ref) {
connected = true;
});

## REQUIREMENTS

- Firebase account
- Firebase CLI installed
- Node.js and npm installed

## TECHNOLOGIES INVOLVED

- MongoDB database
- .env variables
- aws bucket

## STEPS

1. Create a Firebase application on the Firebase console and switch to the Blaze plan.
2. Initialize the Firebase app from terminal via `firebase init` and choose the functions service. Invokes the CLI which creates the following files :-
   - functions folder
   - .firebaserc
   - firebase.json
3. Set up your project in the functions folder, which will be our new home. Nothing changes except the fact that we omit the `app.listen` property on the _index.js_. The rest, including modules, models, routes, controllers, and anything in between, works fine.
4. The _.env_ variables will be loaded automatically on deployment.
5. Ensure you are using the **latest npm version** while executing the steps above.
6. Test your app locally using `firebase serve`.
7. Deploy using command `firebase deploy`.

## KEY NOTES

- The **firebase.json** defaults are good.
- If it works locally `node index.js`, then it works via simulation `firebase serve`, and it will definitely work well on deployment `firebase deploy`.
- Remember to delete previous Firebase initializations on your desktop. (This was the main issue I encountered)
- No funny directories or sub-directories should be created.

## GRANTING PUBLIC ACCESS

After successful deployment , only authenticated users can access the server , to allow public access:

- [Go to console](https://console.cloud.google.com/functions/list)
- Select the function to which you want to give public access
- Click on PERMISSIONS
- Click on ADD PRINCIPAL
- Type allUsers
- Select role Cloud Functions > Cloud Functions Invoker
- Hit Save

## CONCLUSION

- Using Firebase Functions makes hosting your backend cheap and seamless. The steps outlined above will guide you in deploying your Express app using Firebase.
- Ensure you have stable internet; it might be the cause of some funny errors between simulation and deployment.
