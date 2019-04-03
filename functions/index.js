const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const auth = admin.auth();

/**
 * Gets all the users (1000 MAX) from Firebase auth.
 *
 * @param {Object} req Express Request Object.
 * @param {Object} res Express Response Object
 */
// const getAllUsers = (req, res) => {
//   const maxResults = 1; // optional arg.

//   auth.listUsers(maxResults).then((userRecords) => {
//     userRecords.users.forEach((user) => console.log(user.toJSON()));
//     res.end('Retrieved users list successfully.');
    
//   }).catch((error) => console.log(error));
// };

// module.exports = {
//   api: functions.https.onRequest(getAllUsers),
// };


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });


exports.createUser = functions.auth.user().onCreate(function(user, context) {
  admin.database().ref("Users/" + user.uid).set({
      "Name": "Anonymous",
      "Email": user.email,
      "Rank": 0,
      "conWith" : "null",
      "curChat": "null",
      "curPostId": "null",
      "curPostType": "null",
      "tokenString": "null"
    })

    return sendWelcomeEmail(user.email, user.displayName);
});


///////////////////TESTING EMAILS//////////////////////
'use strict';

const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'AskAround';

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
// exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
// // [END onCreateTrigger]
//   // [START eventAttributes]
//   const email = user.email; // The email of the user.
//   const displayName = user.displayName; // The display name of the user.
//   // [END eventAttributes]

//   return sendWelcomeEmail(email, displayName);
// });
// [END sendWelcomeEmail]

// [START sendByeEmail]
/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
// [START onDeleteTrigger]
exports.sendByeEmail = functions.auth.user().onDelete((user) => {
// [END onDeleteTrigger]
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});
// [END sendByeEmail]

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}

// Sends a goodbye email to the given user.
function sendGoodbyeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Account deletion confirmation email sent to:', email);
  });
}

  exports.sendNotificationEmail = functions.https.onRequest((req, res) => {
    admin.database().ref('Users/').once('value', function (data) {
      data.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var email = childData.email;
        var Name = childData.Name;
        
        return sendNotificationEmail(email, Name);
      });
      res.end();
    });
  });


  function sendNotificationEmail(email, displayName) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
    };
  
    // The user unsubscribed to the newsletter.
    mailOptions.subject = `New Posting!`;
    mailOptions.text = `Hey ${displayName || ''}!, A user just posted a new bounty! Be the first to claim it from ${APP_NAME}.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Notification email sent to:', email);
    });
  }
// // Sends a goodbye email to the given user.
// function sendGoodbyeEmail(email, displayName) {
//   const mailOptions = {
//     from: `${APP_NAME} <noreply@firebase.com>`,
//     to: email,
//   };

//   // The user unsubscribed to the newsletter.
//   mailOptions.subject = `Bye!`;
//   mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
//   return mailTransport.sendMail(mailOptions).then(() => {
//     return console.log('Account deletion confirmation email sent to:', email);
//   });
// }