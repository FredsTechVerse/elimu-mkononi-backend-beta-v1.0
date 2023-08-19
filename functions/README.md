# FIREBASE DEPLOYMENT OF EXPRESS APPLICATION.

This project is a guide to deploying an Express app using Firebase Functions.

# ELIMU HUB BACKEND

- Where we make revision easy and fun!

## TO DO

- User should not be able to update password until proper protocol for authentication , decryption and encryption after update is followed
- Write a list of the CRUD functionalities to go testing the go ticking while making the necessary adjustments.
- I will group similar functionailites later and sort out by the path to the controller. But this has to happen after all the routes are working.

## TIPS I HAVE GATHERED ALONG THE WAY

- While dealing with the s3 bucket , incase of conflict of policies , the more restrictive policy takes precedence eg when we define both a bucket and iam policy.
- Youtube api scope is like policy in aws.
- By handling errors for each request, it really helps avoid crushing the server without reasonable cause.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

## OPTIMIZATIONS

- Refactor auth controllers futher by passing the role ... Do this optimization , make sure they work properly... Then see how we can even improve perfomance using react hook forms.
