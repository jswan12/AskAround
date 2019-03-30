// Initialize Firebase
var config = {
    apiKey: "AIzaSyCpwgCgLOfU9l27TvFGVYkFQdeyJJnB-ck",
    authDomain: "askaround-01.firebaseapp.com",
    databaseURL: "https://askaround-01.firebaseio.com/",
    projectId: "askaround-01",
    storageBucket: "askaround-01.appspot.com",
    messagingSenderId: "527860430663"
  };
  
firebase.initializeApp(config);

var dataBase = firebase.database();


function pushNewUser(aUID, aName) {
    dataBase = dataBase.ref("Users/" + aUID);
    dataBase.push({
        "displayName": aName,
        "Rank": 0,
        "curChat": null,
        "curPostId": null,
        "curPostType": null,
      });
}