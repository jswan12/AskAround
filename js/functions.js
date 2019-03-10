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
var uid = null;
var displayName = null;
// Save a new post to the database, using the input in the form
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    uid = firebase.auth().currentUser.uid;
    displayName = firebase.auth().currentUser.displayName;
    getRank();
  }
  else {
    uid = null;
    display = 'anonymous';
  }
});






var submitPost = function () {


  // Get input values from each of the form elements
    var myUid = uid;
    var mydisplayName = displayName;
    var question = document.getElementById('question').value;
    var description = document.getElementById('description').value;
    var bounty = document.getElementById('price').value;
    var category = document.getElementById('category').value;
    // Reference to the post object in Firebase database
    dataBase = dataBase.ref("Posts/" + category);
    //alert(displayName + "\n" + uid + "\n" + question + "\n" + description + "\n" + bounty + "\n" + category);
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
      var category = childData.category;//may not be used
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
          '</div>'
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
  firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).once('value',
    function(data){
      var visibility = data.val().visibility;
      visibility = 'hidden';
      firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).update({visibility});
      window.open("chat.html");
      document.location.reload(true);
    }, function (err) { 
      console.log("Could not set post " + postKey + " to hidden."); 
    }
  );
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

$(window).load(function () {
  $("#postForm").submit(submitPost);
}, getPost(document.getElementById("pageTitle").innerText));