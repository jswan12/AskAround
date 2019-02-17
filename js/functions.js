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
messaging.requestPermission().then(function () {
  console.log('Have permission');
}).catch(function (err) {
  console.log("error occured");
})


//var authData = firebase.getAuth();
var dataBase = firebase.database();
// Save a new post to the database, using the input in the form
var submitPost = function () {

  // Get input values from each of the form elements
  //var uid = authdata.uid;
  var question = document.getElementById('question').value;
  var description = document.getElementById('description').value;
  var bounty = document.getElementById('price').value;
  var category = document.getElementById('category').value;
  // Reference to the post object in Firebase database
  dataBase = dataBase.ref("Posts/" + category);

  // Push a new post to the database using those values

  dataBase.push({
    "uid": uid,
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
      var uid = childData.uid;
      //console.log(question, "\n"+description, '\n'+bounty, "\n"+category);   

      var html = [
        '<div class="post_topbar">',
        '<div class="usy-dt">',

        '<div class="usy-name">',
        '<h3>',
        //getName(uid),
        'getName(uid)',
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

