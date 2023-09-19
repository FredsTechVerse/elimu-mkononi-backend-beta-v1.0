# FIREBASE DEPLOYMENT OF EXPRESS APPLICATION.

This project is a guide to deploying an Express app using Firebase Functions.

# ELIMU HUB BACKEND

- Where we make revision easy and fun!

## TO DO

- Apply data aggregation to simplify dashboard.
- Work on password recovery , let user confirm contact , send reset code let it be submitted with the new password.

## TIPS I HAVE GATHERED ALONG THE WAY

- Mongoose operators are preceded by a .sign followed by brackets eg .find() whereas mongodb operators are preceded by a $ sign and sometimes followed by curly braces.
- To make data aggregation possible children have to keep track of parents so as to be able to group the children by the parents ID.
- To populate parents data effectively , parents have to keep track of their children ID'S
- While dealing with the s3 bucket , incase of conflict of policies , the more restrictive policy takes precedence eg when we define both a bucket and iam policy.
- Youtube api scope is like policy in aws.
- By handling errors for each request, it really helps avoid crushing the server without reasonable cause.
- I have a unified response body where i send a message `   res.status(200).json({ message: "Course deleted successfully" });` or the actual file if need arises `res.json(courseData);`

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
