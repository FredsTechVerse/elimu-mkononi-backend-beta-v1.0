# FIREBASE DEPLOYMENT OF EXPRESS APPLICATION.

This project is a guide to deploying an Express app using Firebase Functions.

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
