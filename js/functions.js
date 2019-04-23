//Initialize variables
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

    //add a possible while loop here.
    if(!user.emailVerified){
      user.sendEmailVerification().then(function() {
        sendMail();
        console.log("email has been sent");
        document.location.replace('emailVerify.html');
      }).catch(function(error){
        console.log("can not seem to send email");
      });
    }

    //////////////////////////////////////////////////////////////////
    firebase.database().ref('Users/' + user.uid).on('child_changed', function(data){
      //console.log(data.key);
      if(data.val() === user.uid || data.key === 'curChat' ){
        curChatA = data.val();
      }
      if(data.val() === 'null'){
        document.location.reload(true);
      }
    });
    //////////////////////////////////////////////////////////////////

    firebase.database().ref('Users/' + user.uid).once('value', function(data){
      if(data.val().Name != displayName){
        var Name = displayName;
        firebase.database().ref('Users/' + uid ).update({Name});
      }
      curChatA = data.val().curChat;
      console.log(curChatA);
    });
  }
  else {
    uid = null;
    displayName = 'Anonymous';
  }
});


//when submitPost is called, it will run the function below
//this function will send the Post attributes to our database
var submitPost = function () {
  //if the User does not have a active chat
  if(curChatA == 'null'){
    //Update the User's channel data in the database
    var curChat = uid;
    var curPostType = document.getElementById('category').value;
    firebase.database().ref('Users/' + uid ).update({curChat});
    firebase.database().ref('Users/' + uid ).update({curPostType});
    ///end of User's channel update
    var myUid = uid;
    var mydisplayName = displayName;
    var question = document.getElementById('question').value;
    var description = document.getElementById('description').value;
    var bounty = document.getElementById('price').value;
    var category = document.getElementById('category').value;
    dataBase = dataBase.ref("Posts/" + category);
    // Push a new post to the database using those values
    dataBase.push({
      "uid": myUid,
      "displayName": mydisplayName,
      "question": question,
      "description": description,
      "bounty": bounty,
      "category": category,
      "visibility": 'visible'
    });
    //End of post push to database
    //Open the loading page for the user.
    window.open("waiting.html");
  }
  //If the user tries to make a post while in another chat, they will be denied
  else
    alert("You can only have one post at a time. Sorry.");
};

//This function returns the current user's rank from the database
function getRank() {
  firebase.database().ref("Users/" + uid).once('value', function (data) {
      document.getElementById('userRank').innerText = data.val().Rank;
  }, function (error) { console.log(error); });
}


//This function injects html to the page to display that there are
//currently no active posts for that category.
function insertNoPost(sub){
  //create the html to be injected
  var html = ['<p style="text-align: center; margin-top: 115px;">','There are currently no active bounties for ',sub,'</p>'].join('');
  var div = document.createElement('div');
  div.setAttribute('id', 'noBounties');
  div.innerHTML = html;
  //add the div with the html elements inside to the posts section of the page
  document.getElementById('posts-section').appendChild(div);
}

//This function will display all of the active posts for a category
function getPost(sub) {
  dataBase.ref("Posts/" + sub).once('value', function (data) {
    //if there are no posts in the database under the category then say there are no posts
    if(data.numChildren() === 0)
      insertNoPost(sub)
    else{
      //keep track of how many of the elements in this category are hidden
      var hiddenCount = 0
      //for each post in this category grab all the data out out it
      data.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var postID = childSnapshot.key;
        var question = childData.question;
        var description = childData.description;
        var bounty = childData.bounty;
        var category = childData.category;
        var visibility = childData.visibility;
        var displayName = childData.displayName;
        var myUid = childData.uid;

        //If the post is listed as visible in the database then display it to the page
        if(visibility == 'visible'){
          //create the html to be injected
          var html = [
            '<div class="post_topbar">',
              '<div class="usy-dt">',
                '<div class="usy-name">',
                  '<h3>',displayName,'</h3>',
                  '<span>$',bounty,'</span>',
                '</div>',
              '</div>',
              '<div class="ed-opts">',
                '<a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>',
                '<input id="button',postID,'" type="button" value="Claim Bounty" onclick="openChatPage(\'',postID,'\');" style="float:right; background-color: green; color: white; height: 25px; width: 100px; border: none;"></input>',
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
              '<h3>',question,'</h3>',
              '<p>',description,'</p>',
            '</div>'
          ].join('');
          var div = document.createElement('div');
          div.setAttribute('class', 'post-bar');
          div.setAttribute('id', postID);
          div.innerHTML = html;
          //add the div with the html elements inside to the posts section of the page
          document.getElementById('posts-section').appendChild(div);
        }
        //Increment count of hidden items
        else{hiddenCount++}

        //If all posts within the category are hidden, then display that there are
        //currently no posts for that category
        if(data.numChildren() === hiddenCount)
          insertNoPost(sub)
      });
    }
  });
}

//This function will open the chat for the current User that claims the bounty
function openChatPage(postKey) {
  var chan;
  firebase.database().ref('Users/' + uid).once('value', function(data){
    //Make sure that the user claiming it is:
    //1. not the user that posted it
    //2. not in another chat
    if(data.val().curChat == "null"){
      firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).once('value',
        function(data){
          //get variables needed for payout
          var claimAmount = data.val().bounty;
          var visibility = data.val().visibility;
          //update the post's visiblity state to hidden and update the channel of the claimer
          visibility = 'hidden';
          chan = data.val().uid;
          var curChat = chan;
          firebase.database().ref('Users/' + uid ).update({curChat});
          firebase.database().ref('Users/' + uid ).update({claimAmount});
          firebase.database().ref('Posts/' + document.getElementById("pageTitle").innerText + '/' + postKey).update({visibility});
          ///end of updates to database
          //open the chat page for the claimer
          window.open("chat.html");
          //reload the mainpage to insure that the visibility of the post is active
          document.location.reload(true);
        }, function (err) {
          console.log(err);
        }
      );
    }
    else
      alert("You cannot claim a bounty when in another chat or while waiting for your post to be claimed");
  });
}

//This function sets the notifications for a user
function getNotification(sub) {
  dataBase.ref("Posts/" + sub).once('value', function (data) {
    //For each post within the category, get the data
    data.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      var question = childData.question;
      var visibility = childData.visibility;
      var displayName = childData.displayName;

      //if the post has the attribute: visible then give the notification
      if(visibility == 'visible'){
        //create the html to be injected
        var html = [
            '<div class="notification-info">',
              '<h3><a href="#" title="">', displayName, '</a></h3>',
							'<p>',question,'</p>',
            '</div>',
        ].join('');
        var div = document.createElement('div');
        div.setAttribute('class', 'notification-details');
        div.innerHTML = html;
        //add the div with the html elements inside to the posts section of the page
        document.querySelector('.nott-list').appendChild(div);
      }
    });
  });
}

//Get notifications for each category
getNotification('Mathematics');
getNotification('Computer Science');
getNotification('Science');

//When the window is loaded, add a eventlistener to the submit post button
//to call the submit post function.
//get the Posts and display them on the screnn when the page is loaded as well
$(window).load(function () {
  $("#postForm").submit(submitPost);
}, getPost(document.getElementById("pageTitle").innerText));
