
importScripts('https://www.gstatic.com/firebasejs/5.8.3/firebase.js');

var config = {
    apiKey: "AIzaSyCpwgCgLOfU9l27TvFGVYkFQdeyJJnB-ck",
    authDomain: "askaround-01.firebaseapp.com",
    databaseURL: "https://askaround-01.firebaseio.com",
    projectId: "askaround-01",
    storageBucket: "askaround-01.appspot.com",
    messagingSenderId: "527860430663"
};
firebase.initializeApp(config);

//get data from the html and create some needed variables
var conMe = document.getElementById('me');
var conYou = document.getElementById('you');
var line = '';
var btn = document.getElementById("mybutton");
var download = document.getElementById("downLog");
var chan  = "";
var messA = document.getElementById("message").value;
var name;
var chatRef; // = firebase.database().ref('chats/'+chan+'/txts');
firebase.auth().signInWithEmailAndPassword("priver3@lsu.edu", "password"); // placeholder account for offline testing
firebase.auth().onAuthStateChanged(function(user){
 if(user){
   name = user.email;
   firebase.database().ref('Users/' + user.uid).once('value', function(data){
     data = data.val().curChat;
     console.log(data);
     chan = data;
     chatRef = firebase.database().ref('chats/'+chan+'/txts');

     //if a new message is added to the db then this event will grab it from the db and add it to the screen
     chatRef.on('child_added', function(msg){
       var mess = JSON.stringify(msg);
       mess = mess.slice(1,mess.length-1);
       var messLi = document.createElement("LI");
       var messTxt= document.createTextNode(mess);
       messLi.appendChild(messTxt);
       document.getElementById("txtBox").appendChild(messLi);
       line = line +(mess+ "\n");
       txtBox.scrollTop = txtBox.scrollHeight;
     });
     window.onbeforeunload = function(){
       curChat = 'null';
       firebase.database().ref('Users/' +  user.uid ).update({curChat});
     };
     //if there is an update on the connections list then grab the new connection
/*         firebase.database().ref('chats/'+chan+'/connections').on("child_added", function(per){
       var s = JSON.stringify(per);
       s = s.slice(1,s.length-1);
       //console.log(s);
       if(document.getElementById("me").textContent != s){
         document.getElementById("you").textContent = s;
       }
     });*/
   });
   conMe.appendChild(document.createTextNode(user.uid));
 }
});
var txtBox = document.getElementById("txtBox");

//when the user adds a message send it to the db
btn.addEventListener("click", function(){
  messA = document.getElementById("message").value;
  messJ = name + ": " + messA;
  firebase.database().ref('chats/'+chan+'/txts').push(messJ);
  document.getElementById("message").value = '';
});


//create text file of log for user to keep
//new line is curretnly not working but this is not an easy feature
download.addEventListener("click", function(){
  var date = new Date();
  var d = "messageOn-"+ date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + ".txt"
  var atr = document.createAttribute("download");
  atr.value = d;
  this.setAttributeNode(atr);
  var blob = new Blob([line], {type: "text/plain;charset=utf-8"});
  var downloadUrl = URL.createObjectURL(blob);
  this.setAttribute("href", downloadUrl);
});


//get the elements create an event then call the functions
var uvote = document.getElementById("upvote");
var dvote = document.getElementById("downvote");
uvote.addEventListener("click", function(){ stuff(1);});
dvote.addEventListener("click", function(){ stuff(0);});
//function for dealing with hiding the buttons and updating the db
function stuff(val){
  uvote.style.visibility = "hidden";
  dvote.style.visibility = "hidden";
  //if upvote
  if(val ===1){
    //var them =  "KuopYAm6v4Y2BpsJo2SR0JZ5lq83"; //hard code test please disregard
    var them = document.getElementById("you").textContent;
    var Rank;
    firebase.database().ref("Users/" + them).once("value", function(data){
      Rank = data.val().Rank + 1;
      console.log(Rank);
      firebase.database().ref('Users/' + them ).update({Rank});
    });

    //prepare to delete the conversation when it is finished
    //

  }
  //if downvote
  if(val ===0){
    //var them =  "KuopYAm6v4Y2BpsJo2SR0JZ5lq83"; //hard code test please diregard
    var them = document.getElementById("you").textContent;
    var Rank;
    firebase.database().ref("Users/" + them).once("value", function(data){
      Rank = data.val().Rank - 1;
      console.log(Rank);
      firebase.database().ref('Users/' + them ).update({Rank});
    });

    //prepare to keep the conversation for review
    //

  }
}
