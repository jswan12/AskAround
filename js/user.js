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