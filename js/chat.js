var line = ''; //stores the message thread to be downloaded
    var btn = document.getElementById("mybutton");//submit post button reference
    var download = document.getElementById("downLog");//download post button reference
    var chan  = ""; //string to sotre the current chat
    var messA = document.getElementById("message").value;//stores a renference to the message box
    var name; //stores your username
    var poster;//used as a boolean for if you are the poster or not
    var me; //stores the your uid
    var chatRef; //stores the reference to firebase chat
    var txtBox = document.getElementById("txtBox");//reference to the text box
    var uvote = document.getElementById("upvote");//upvote button reference
    var dvote = document.getElementById("downvote");//downvote button reference
    var formRef = document.getElementById('myMess');//reference to message form


    //firebase.auth().signInWithEmailAndPassword("priver3@lsu.edu", "password"); // placeholder account for offline testing

    //this area will be once the page recognizes that hte user is logged in
    //allows for easy acces to the current user's information as well as control
    //the timing the creation of each section
    firebase.auth().onAuthStateChanged(function(user){
     if(user){
		   name = user.displayName;
       firebase.database().ref('Users/' + user.uid).once('value', function(data){
         chan = data.val().curChat;
         me = user.uid;
         if(user.uid != chan){
           //THIS IS WHEN YOU ARE THE ANSWERER
           //removes the upvote and downvote
           //gives your uid to the poster through conWith
           //retrieves the tokenString from the poster
           formRef.removeChild(dvote);
           formRef.removeChild(uvote);
           console.log("You are not the poster");
           poster = false;
           var conWith = user.uid;
           firebase.database().ref('Users/' + data.val().curChat).update({conWith});

           firebase.database().ref('Users/' + chan).once('value', function(data){
             var tokenString = data.val().tokenString;
             firebase.database().ref('Users/' + me).update({tokenString});
           });

         }
         else{
           //THIS IS WHEN YOU ARE THE POSTER
           poster = true;
         }

         //if a new message is added to the db then this event will grab it from the db and add it to the screen
         firebase.database().ref('chats/'+chan+'/txts').on('child_added', function(msg){
           var mess = JSON.stringify(msg);
           mess = mess.slice(1,mess.length-1);
           if(mess.indexOf("has left") >= 0){
             document.getElementById('myMess').removeChild(document.getElementById('message'));
             document.getElementById('myMess').removeChild(document.getElementById('mybutton'));
             var curChat = "null";
             firebase.database().ref('Users/' + me).update({curChat});
             if(!poster){
               document.location.replace('Payout.html');
             }
           }
           var messLi = document.createElement("LI");
           var messTxt= document.createTextNode(mess);
           messLi.appendChild(messTxt);
           document.getElementById("txtBox").appendChild(messLi);
           line = line +(mess+ "\n");
           txtBox.scrollTop = txtBox.scrollHeight;
         });

         //things that should happen before the page is closed
         //resets chat values to null and removes the chat from the db
         window.onbeforeunload = function(){
           if( data.val().curChat != 'null' && !poster){
             return 'please do not leave ';
           }
           intro('left');
           firebase.database().ref("chats/" + me + '/txts').remove();
           var curChat = "null";
           var conWith = "null";
           var curPostId  = "null";
           var curPostType= "null";
           if(poster){
             var tokenString = 'null';
             firebase.database().ref('Users/'+ user.uid).update({tokenString});
           }
           firebase.database().ref('Users/' +  user.uid ).update({curChat});
           firebase.database().ref('Users/' +  user.uid ).update({conWith});
           firebase.database().ref('Users/' +  user.uid ).update({curPostId});
           firebase.database().ref('Users/' +  user.uid ).update({curPostType});
         };
         //send message to say that you have joined the chat
         intro("joined");
       });
		 }
	  });

    //sends an auto generated message
    //this is called when you enter and leave the chat
    function intro(x){
        document.getElementById("message").value = ' has ' + x;
        setTimeout(second(),3000);
    }
    //call back function so that we can ensure that the
    //message has gotten to the text box before the button is
    //clicked
    function second(){
      btn.click();
    }

    //when the user adds a message this sends it to the db
    btn.addEventListener("click", function(){
      messA = document.getElementById("message").value;
      messJ = name + ": " + messA;
      firebase.database().ref('chats/'+chan+'/txts').push(messJ);
      document.getElementById("message").value = '';
    });

    //allows for the enter button to be pressed to submit a message
    document.getElementById("message").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
          document.getElementById("mybutton").click();
      }
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
    uvote.addEventListener("click", function(){ vote(1);});
    dvote.addEventListener("click", function(){ vote(0);});
    //function for dealing with hiding the buttons and updating the db
    function vote(val){
      uvote.style.visibility = "hidden";
      dvote.style.visibility = "hidden";
      //if upvote
      if(val ===1){
        firebase.database().ref("Users/" + me).once("value", function(values){
          var Rank;
          var them = values.val().conWith;
          document.getElementById("message").value = ' has up-voted';
          setTimeout(second(),3000);
          firebase.database().ref("Users/" + them).once("value", function(data){
            Rank = data.val().Rank + 1;
            console.log(Rank);
            firebase.database().ref('Users/' + them ).update({Rank});
          });
        });
      }
      //if downvote
      if(val ===0){
        download.click();
        document.getElementById("message").value = ' has down-voted';
        setTimeout(second(),3000);
        firebase.database().ref("Users/" + me).once("value", function(values){
          var Rank;
          var them = values.val().conWith;
          console.log(them);
          firebase.database().ref("Users/" + them).once("value", function(data){
            console.log('here');
            console.log(data.val().Rank);
            Rank = data.val().Rank - 1;
            console.log(Rank);
            firebase.database().ref('Users/' + them ).update({Rank});
          });
        });
      }
    }