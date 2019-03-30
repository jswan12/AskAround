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


function pushNewUser(aUID, aName) {
    dataBase = firebase.database().ref("Users/" + aUID);
    dataBase.set({
        "Name": aName,
        "Rank": 0,
        "curChat": "null",
        "curPostId": "null",
        "curPostType": "null",
      });
}
//pushNewUser(firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName);