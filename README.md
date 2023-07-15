# ELIMU MKONONI BACKEND

- Where we make revision easy and fun!

## TIPS I HAVE GATHERED ALONG THE WAY

- Its simply a group of computers that can host serveral database(s) with a limit attached not to the no of databases but the total number collections and space that they can take up!
- Scope is like policy in aws.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

### OBSERVATIONS MADE WHILE WORKING WITH ENVIROMENT VARIABLES

1. Exclude apostrophes when defining string values,they will be placed automatically when the varibale is needed
2. KEY must always be writtend in capital letters underscore separated if need be.
3. Import dotenv in the root route... After this we do not need to import it again as it will already have served its purpose of loading the enviroment variables into the process.env object. This is only done locally hence using the following code
   `if (process.env.NODE_ENV !== "production") { require("dotenv").config();}`
