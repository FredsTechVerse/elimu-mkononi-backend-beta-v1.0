# THE ULTIMATE GOAL

- Finalizing the content sections to get this product up and running with some real users will really achieve its objective.
- Gaining Ksh 10,000 as a result of building this logic will also be a great achievement.
- This product will have achieved its objective as we keep on building.

# ELIMU HUB BACKEND

- Where we make revision easy and fun!

## SOME IDEAS AS WE WRAP UP!

- Make the workflow easier and fun after adding the required resources.
- Each unit will be having its reference books. Ensure we have a section for that under the resources.
- Optimize file upload , can be made asynchronous by giving false positive response and then uploading the file.
- Reinstall modules with package.lock cleared and retry deployment.

## TIPS I HAVE GATHERED ALONG THE WAY

- Firebase claim to tools works with node v16 or higher.
- Mongoose operators are preceded by a .sign followed by brackets eg .find() whereas mongodb operators are preceded by a $ sign and sometimes followed by curly braces.
- To make data aggregation/analysis easy children have to keep track of parents so as to be able to group the children by the parents ID / Name
- To populate parents data effectively , parents have to keep track of their children ID'S
- While dealing with the s3 bucket , incase of conflict of policies , the more restrictive policy takes precedence eg when we define both a bucket and iam policy.
- Youtube api scope is like policy in aws.
- By handling errors for each request, it really helps avoid crushing the server without reasonable cause.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

## FIREBASE FUNCTION DEPLOYMENT CHALLENGES

- Firebase tools works with version 16 or higher.
- `node v18.17.1 (npm v9.6.7)` worked while deploying to firebase functions
- I used `node v16.15.1` to re-install and upgrade package.json files.
- An uknown package reported to only use `node v14` during reinstallation and update.
- The issue could have been installing the packages using `node v18.17.1` or the default (`system`)

## OPTIMIZATIONS

- Refactor auth controllers futher by passing the role ... Do this optimization , make sure they work properly... Then see how we can even improve perfomance using react hook forms.

### USING NODEMAILER

- We can send emails as a html body by setting {html:html} instead of {text:text}

```js
const html = `  <p className="test">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
    obcaecati.
    <a
      href="http://localhost:3000"
      style={{
        backgroundColor: "blue",
        display: "block",
        color: "white",
        height: "50px",
        width: "250px",
      }}
    >
      Go to home
    </a>
  </p>`;
```
