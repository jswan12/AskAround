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



exports.createUser = functions.auth.user().onCreate(function(user, context) {
  return admin.database().ref("Users/" + user.uid).set({
      "Name": "Anonymous",
      "Email": user.email,
      "Rank": 0,
      "conWith" : "null",
      "curChat": "null",
      "curPostId": "null",
      "curPostType": "null",
      "tokenString": "null"
    })
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
  return admin.database().ref('Users/' + user.uid).remove();
});


///////////////////TESTING EMAILS//////////////////////
'use strict';
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'AskAround';

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.

  return sendWelcomeEmail(email, displayName);
});

exports.sendByeEmail = functions.auth.user().onDelete((user) => {
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});

function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. We hope you will find our site useful.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}

function sendGoodbyeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName || ''}!, This is a confirmation that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Account deletion confirmation email sent to:', email);
  });
}

  exports.sendNotificationEmail = functions.database.ref("Posts/Mathematics/").onCreate(event => {
    const dataSnapshot = event.data;
      email = 'jswan12@lsu.edu';
      displayName = 'Jacob Swanson';
      return sendNotificationEmail(email, displayName);
    /*admin.database().ref('Users/').once('value', function (data) {
      data.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var email = childData.email;
        var Name = childData.Name;
        
        return sendNotificationEmail(email, Name);
      });
    });*/
  });


  function sendNotificationEmail(email, displayName) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
    };
  
    mailOptions.subject = `New Posting!`;
    mailOptions.text = `Hey ${displayName || ''}!, A user just posted a new bounty! Be the first to claim it from ${APP_NAME}.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Notification email sent to:', email);
    });
  }