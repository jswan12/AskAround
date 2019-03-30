
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


function getNotification(sub) {
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