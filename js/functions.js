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

//firebase notifications
const messaging = firebase.messaging();

//configure web credentials
messaging.usePublicVapidKey("BHDJhQ4VQjqBLCp96vZ4jgE9GWamgjBuPsHvAK8_FtqTN6CJYoKg0oBi-zSnTlprosTvoekancmKv4F-JXzD_3U");


//[START refresh_token]
//Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function(){
  messaging.getToken().then(function(refreshedToken){
    console.log("Token refreshed.");
    setTokenSentToServer(false);
    sendTokenToServer(refreshedToken);
    resetUI();
  }).catch(function(err){
    console.log('Unable to retrieve refreshed token' , err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});

//[START receive_message]
messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
  // [START_EXCLUDE]
  // Update the UI to include the received message.
  appendMessage(payload);
  // [END_EXCLUDE]
});
// [END receive_message]

function resetUI() {
  clearMessages();
  showToken('loading...');
  // [START get_token]
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  // [END get_token]
}

function showToken(currentToken) {
  // Show token in console and UI.
  var tokenElement = document.querySelector('#token');
  tokenElement.textContent = currentToken;
}

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}



function requestPermission() {
  console.log('Requesting permission...');
  // [START request_permission]
  messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // [START_EXCLUDE]
    // In many cases once an app has been granted notification permission, it
    // should update its UI reflecting this.
    resetUI();
    // [END_EXCLUDE]
  }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });
  // [END request_permission]
}

function deleteToken() {
  // Delete Instance ID token.
  // [START delete_token]
  messaging.getToken().then(function(currentToken) {
    messaging.deleteToken(currentToken).then(function() {
      console.log('Token deleted.');
      setTokenSentToServer(false);
      // [START_EXCLUDE]
      // Once token is deleted update UI.
      resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to delete token. ', err);
    });
    // [END delete_token]
  }).catch(function(err) {
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
  });
}


resetUI();

//var authData = firebase.getAuth();
var dataBase = firebase.database();
// Save a new post to the database, using the input in the form
var submitPost = function () {

  // Get input values from each of the form elements
  //var uid = authdata.uid;
  firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			var uid = firebase.auth().currentUser.uid;
    }
    else {
      var uid = null;
    }
	});
  var question = document.getElementById('question').value;
  var description = document.getElementById('description').value;
  var bounty = document.getElementById('price').value;
  var category = document.getElementById('category').value;
  // Reference to the post object in Firebase database
  dataBase = dataBase.ref("Posts/" + category);

  // Push a new post to the database using those values

  dataBase.push({
    "uid": uid,
    "displayName": firebase.auth().currUser.displayName,
    "question": question,
    "description": description,
    "bounty": bounty,
    "category": category
  });
};


//   function getName(aUID){
//   // return name based on a UID input
//   var currUser = firebase.database().ref("Users/" + aUID).once('value', 
//   function(data){
//     document.getElementById('userName').innerText = data.val().Name;
//   }, function(error){ console.log(error); }
//   );
// }

function getRank(aUID) {
  // return rank based on a UID input
  var currUser = firebase.database().ref("Users/" + aUID).once('value',
    function (data) {
      document.getElementById('userRank').innerText = data.val().Rank;
    }, function (error) { console.log(error); }
  );
}




function pushUser(aUID, aName, aRank) {
  // push user to database
  // var userBase = firebase.database().ref('Users/' + aUID);
  // dataBase.push({
  //   "Name": aName,
  //   "Rank": aRank
  //   });
}



function getPost(sub) {
  dataBase.ref("Posts/" + sub).once('value', function (data) {
    data.forEach(function (childSnapshot) {
      //each post's id
      //var key = childSnapshot.key();
      var childData = childSnapshot.val();
      var question = childData.question;
      var description = childData.description;
      var bounty = childData.bounty;
      var category = childData.category;
      var displayName = childData.displayName;
      var uid = childData.uid;
      //var uid = childData.uid;
      //console.log(question, "\n"+description, '\n'+bounty, "\n"+category);   

      var html = [
        '<div class="post_topbar">',
        '<div class="usy-dt">',

        '<div class="usy-name">',
        '<h3>',
        displayName,
        //'getName(uid)',
        '</h3>',
        '<span><img src="images/clock.png" alt="">$',
        bounty,
        '</span>',
        '</div>',
        '</div>',
        '<div class="ed-opts">',
        '<a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>',
        '<form action="chat.html" target="_blank">',
        '<button style="float:right; background-color: green; color: white; padding: 5px 7px; border: none;" >Claim Bounty</button>',
        '</form>',
        '<ul class="ed-options">',
        '<li><a href="#" title="">Edit Post</a></li>',
        '<li><a href="#" title="">Unsaved</a></li>',
        '<li><a href="#" title="">Unbid</a></li>',
        '<li><a href="#" title="">Close</a></li>',
        '<li><a href="#" title="">Hide</a></li>',
        '</ul>',
        '</div>',
        '</div>',

        '<div class="job_descp">',
        '<h3>',
        question,
        '</h3>',

        '<p>',
        description,
        '</p>',
        '</div>'
      ].join('');
      var div = document.createElement('div');
      div.setAttribute('class', 'post-bar');
      div.innerHTML = html;
      document.getElementById('posts-section').appendChild(div);
    });
  });
}


var placeholderUID = "KuopYAm6v4Y2BpsJo2SR0JZ5lq83"; // Evan's

$(window).load(function () {
  $("#postForm").submit(submitPost);
}, getPost(document.getElementById("pageTitle").innerText),
  getRank(placeholderUID));

