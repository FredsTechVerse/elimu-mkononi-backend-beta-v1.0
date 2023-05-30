# FIREBASE DEPLOYMENT OF EXPRESS APPLICATION.

This project is a guide to deploying an Express app using Firebase Functions.

## REQUIREMENTS

- Firebase account
- Firebase CLI installed
- Node.js and npm installed

## PARTIES INVOLVED

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

Using Firebase Functions makes hosting your backend easy and seamless. The steps outlined above will guide you in deploying your Express app using Firebase.
Ensure you have stable internet; it might be the cause of some funny errors between simulation and deployment.
