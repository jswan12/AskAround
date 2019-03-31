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

//firebase.auth().signInWithEmailAndPassword("priver3@lsu.edu", "password"); // placeholder account for offline testing

var dataBase = firebase.database();
var uid = null;
var displayName = null;

var curChatA;

// Save a new post to the database, using the input in the form
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    uid = firebase.auth().currentUser.uid;
    displayName = firebase.auth().currentUser.displayName;
    getRank();

    firebase.database().ref('Users/' + user.uid).once('value', function(data){
      curChatA = data.val().curChat;
      console.log(curChatA);
    });
  }
  else {
    uid = null;
    display = 'anonymous';
  }
});

var submitPost = function () {
  if(curChatA == 'null'){
    ///channel update
    var curChat = uid;
    //var curPostId =
    var curPostType = document.getElementById('category').value;
    console.log('curChat = '+curChat);
    firebase.database().ref('Users/' + uid ).update({curChat});
    firebase.database().ref('Users/' + uid ).update({curPostType});
    ///end of channel update
    var myUid = uid;
    var mydisplayName = displayName;
    var question = document.getElementById('question').value;
    var description = document.getElementById('description').value;
    var bounty = document.getElementById('price').value;
    //category variable may not be used
    var category = document.getElementById('category').value;
    // Reference to the post object in Firebase database
    dataBase = dataBase.ref("Posts/" + category);
    // Push a new post to the database using those values
    dataBase.push({
      "uid": myUid,
      "displayName": displayName,
      "question": question,
      "description": description,
      "bounty": bounty,
      "category": category,
      "visibility": 'visible'
    });
    console.log("I just posted");
    window.open("waiting.html");
  }
  else{
    alert("You can only have one post at a time. Sorry.");
  }
};




//var count = 0;
//calling addCount() actually works, but idk how to get it when a post is submited
function addCount(){
firebase.database().ref("Counter/").once('value',
    function(data){
      var postCount = data.val().postCount;
      postCount++;
      document.getElementById('notification').innerText = "Notification " + postCount;
      console.log(postCount);
      firebase.database().ref('Counter/').update({postCount});

    }, function (err) {
      console.log("notificaion is not working: " + error);
    }
  );
}

//   function getName(aUID){
//   // return name based on a UID input
//   var currUser = firebase.database().ref("Users/" + aUID).once('value',
//   function(data){
//     document.getElementById('userName').innerText = data.val().Name;
//   }, function(error){ console.log(error); }
//   );
// }

function getRank() {
  // return rank
  var currUser = firebase.database().ref("Users/" + uid).once('value',
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
      var childData = childSnapshot.val();
      var postID = childSnapshot.key;
      var question = childData.question;
      var description = childData.description;
      var bounty = childData.bounty;
      //category variable may not be used
      var category = childData.category;
      var visibility = childData.visibility;
      var displayName = childData.displayName;
      var myUid = childData.uid;

      if(visibility == 'visible'){
        var html = [
          '<div class="post_topbar">',
          '<div class="usy-dt">',

          '<div class="usy-name">',
          '<h3>',
          displayName + ' ----- ' + myUid,
          //'getName(uid)',
          '</h3>',
          '<span>$',
          bounty,
          '</span>',
          '</div>',
          '</div>',
          '<div class="ed-opts">',
          '<a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>',
          '<input id="button',
          postID,
          '" type="button" value="Claim Bounty" onclick="openChatPage(\'',
          postID,
          '\');" style="float:right; background-color: green; color: white; height: 25px; width: 100px; border: none;"></input>',
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
          '</div>',
          '<script></script>'
        ].join('');
        var div = document.createElement('div');
        div.setAttribute('class', 'post-bar');
        div.setAttribute('id', postID);
        div.innerHTML = html;
        document.getElementById('posts-section').appendChild(div);
      }
      /* MAKE SURE TO TAKE THIS LOG OUT LATER*/
      else{console.log("hidding post " + postID);}
    });
  });
}

function openChatPage(postKey) {
  var chan;
  //if claiming posts is broken chance once to on
  firebase.database().ref('Users/' + uid).once('value', function(data){
    //console.log(data.val().curChat)
    if(data.val().curChat == "null"){
      console.log('hello');
      firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).once('value',
        function(data){
          var visibility = data.val().visibility;
          visibility = 'hidden';
          ///channel update
          chan = data.val().uid;
          var curChat = chan;
          firebase.database().ref('Users/' + uid ).update({curChat});
          ///end of channel update
          console.log('chan = '+chan);
          firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).update({visibility});
          window.open("chat.html");
          document.location.reload(true);
        }, function (err) {
          console.log("Could not set post " + postKey + " to hidden.");
        }
      );
    }
    /*else{
      console.log(data.val().curChat);
    }*/
  });
}

function deletePost(postKey) {
    if(confirm("Are you sure you want to delete post " + postKey + "?")){
      firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).remove().then(function(){
        document.location.reload(true);
      }).catch(function(error){
        console.log('Delete Failed');
      });
    }
    console.log("Deletion Canceled");
}


//send email
function sendEmail(user) {
  // 5. Send welcome email to new users
  const mailOptions = {
          from: '"Dave" <dave@example.net>',
          to: '${user.email}',
          subject: 'Welcome!',
          html: `<YOUR-WELCOME-MESSAGE-HERE>`
  }
  // 6. Process the sending of this email via nodemailer
  return mailTransport.sendMail(mailOptions)
          .then(() => console.log('dbCompaniesOnUpdate:Welcome confirmation email'))
          .catch((error) => console.error('There was an error while sending the email:', error))
}


//get notifications function
function getNotification(sub) {

  console.log("some text here 1");
  dataBase.ref("Posts/" + sub).once('value', function (data) {
    data.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      var postID = childSnapshot.key;
      var question = childData.question;
      var description = childData.description;
      var bounty = childData.bounty;
      var category = childData.category;//may not be used
      var visibility = childData.visibility;
      var displayName = childData.displayName;

      console.log("ive made it here you dumbfuck");

      if(visibility == 'visible'){
        console.log(question + "is the question");
        var html = [
            '<div class="notification-info">',
              '<h3><a href="#" title="">', displayName, '</a></h3>',
							'<p>',question,'</p>',
							'<span>2 min ago</span>',
            '</div>',
        ].join('');
        console.log('some text here');
        var div = document.createElement('div');
        div.setAttribute('class', 'notification-details');
        div.innerHTML = html;
        document.querySelector('.nott-list').appendChild(div);
      }

    });
  });
}

getNotification('Mathematics');

$(window).load(function () {
  $("#postForm").submit(submitPost);
}, getPost(document.getElementById("pageTitle").innerText));
