    var line = '';                                                              //stores the message thread to be stored as a string
    var btn = document.getElementById("mybutton");                              //reference to the submit button on the chat
    var download = document.getElementById("downLog");                          //reference to the download button
    var chan  = "";                                                             //stores the channel name as a string
    var messageVal = document.getElementById("message").value;                  //reference to the value of what is in the message box
    var name;                                                                   //stores your username
    var poster;                                                                 //True if you are the question poster False otherwise
    var myUid;                                                                  //stores the your uid
    var chatRef;                                                                //reference to firebase database (has to be defined once the Authentication has been loaded)
    var txtBox = document.getElementById("txtBox");                             //reference to the text box
    var uvote = document.getElementById("upvote");                              //reference to the upvote button
    var dvote = document.getElementById("downvote");                            //reference to the downvote button
    var formRef = document.getElementById('myMess');                            //reference to message form


    //firebase.auth().signInWithEmailAndPassword("priver3@lsu.edu", "password"); // placeholder account for offline testing

    //This event is triggered once the Authentication status of the user has been loaded.
    //Creation of events, references, and varaibles that require Authentication to have
    //already been loaded were placed within here.
    //Callbacks are a possible alternative, but they proved difficult to implement
    firebase.auth().onAuthStateChanged(function(user){
     if(user){
       //assign the current user dispayname
		   name = user.displayName;

       //area where all the events, varaibles, and references to the user's
       //database variables are defined
       firebase.database().ref('Users/' + user.uid).once('value', function(data){
         //define the current chat as the curChat (short for current chat) variable in the user's information in the database
         chan = data.val().curChat;
         //save the users uid as a varaible for later reference
         myUid = user.uid;

         //if you are the answerer then adjust the screen and your database values
         if(user.uid != chan){
           //remove the upvote and downvote
           formRef.removeChild(dvote);
           formRef.removeChild(uvote);

           //since you are the answerer then make the boolean false
           poster = false;

           //redefine the  poster's conWith (short for connection with) variable in the database
           //to be the answerer's uid (this is used so that the poster can edit the rank of the
           //answerer)
           var conWith = user.uid;
           firebase.database().ref('Users/' + data.val().curChat).update({conWith});

           //update the user's token string to be the poster's token string
           //this is used to make the stripe payment
           firebase.database().ref('Users/' + chan).once('value', function(data){
             var tokenString = data.val().tokenString;
             firebase.database().ref('Users/' + myUid).update({tokenString});
           });

         }
         //if you are the poster than set the boolean to true
         else{
           poster = true;
         }


         //Create an event to be triggered when something is added to the chat channel in the database
         firebase.database().ref('chats/'+chan+'/txts').on('child_added', function(msg){
           //convert the value from a json string to a string
           var mess = JSON.stringify(msg);
           //remove the quotation marks from the message
           mess = mess.slice(1,mess.length-1);

           //if the message contains the string has left then trigger the end of the chat
           if(mess.indexOf("has left") >= 0){
             //remove the chat box and send button from the user
             document.getElementById('myMess').removeChild(document.getElementById('message'));
             document.getElementById('myMess').removeChild(document.getElementById('mybutton'));

             //set the current chat to null
             var curChat = "null";
             firebase.database().ref('Users/' + myUid).update({curChat});

             //if you are the answerer then send them to the payout page
             if(!poster){
               document.location.replace('Payout.html');
             }
           }


           //create a list item to store the message then append it to the list
           //of messages arleady shown on screen
           var messLi = document.createElement("LI");
           var messTxt= document.createTextNode(mess);
           messLi.appendChild(messTxt);
           document.getElementById("txtBox").appendChild(messLi);

           //store the message so that it may be part of the log
           line = line +(mess+ "\n");

           //make the screen default to show the most recent messages
           txtBox.scrollTop = txtBox.scrollHeight;
         });


         //things that should happen before the page is closed
         //resets chat values to null and removes the chat from the db
         window.onbeforeunload = function(){
           //if you are the answerer and the poster has not left yet prompt the user to not leave yet
           if( data.val().curChat != 'null' && !poster){
             return 'please do not leave ';
           }
           //send the user has left message
           autoMessage('left');

           //delete the chat from the databse
           firebase.database().ref("chats/" + myUid + '/txts').remove();

           //define the variables that will be used to null out the users fields in the database
           var curChat = "null";
           var conWith = "null";
           var curPostId  = "null";
           var curPostType= "null";

           //if you are the poster then clear the value of the token string
           if(poster){
             var tokenString = 'null';
             firebase.database().ref('Users/'+ user.uid).update({tokenString});
           }

           //clear out the chat specific variables for both the poster and the answerer
           firebase.database().ref('Users/' +  user.uid ).update({curChat});
           firebase.database().ref('Users/' +  user.uid ).update({conWith});
           firebase.database().ref('Users/' +  user.uid ).update({curPostId});
           firebase.database().ref('Users/' +  user.uid ).update({curPostType});
         };
         //end of onbeforeunload block

         //send message to say that you have joined the chat
         autoMessage("joined");
       });
		 }
	  });


    //sends an auto generated message
    //this is called when you enter and leave the chat
    function autoMessage(x){
        document.getElementById("message").value = ' has ' + x;
        setTimeout(sendMessage(),3000);
    }
    //call back function so that we can ensure that the
    //message has gotten to the text box before the button is clicked
    function sendMessage(){
      btn.click();
    }

    //create event that is triggered when the send button is clicked
    //store the value in the text box in messageVal
    //edit the message to fit as json and store it in messJ
    //push the message the chatroom in the database
    //clear the message box
    btn.addEventListener("click", function(){
      messageVal = document.getElementById("message").value;
      messJ = name + ": " + messageVal;
      firebase.database().ref('chats/'+chan+'/txts').push(messJ);
      document.getElementById("message").value = '';
    });

    //if enter is pressed in the message box it will push the send button without
    //the page reloading
    document.getElementById("message").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
          document.getElementById("mybutton").click();
      }
    });

    //create text file of log for user to keep
    //there is a bug where the message is getting outputted as a single line
    //the file is downloaded as a text file with the name of it as the current date
    download.addEventListener("click", function(){
      //generate current date information and format it as a string
      var date = new Date();
      var d = "messageOn-"+ date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + ".txt"

      //create an invisible atribute that will act as the downloader with the name of the file as the date
      var atr = document.createAttribute("download");
      atr.value = d;
      this.setAttributeNode(atr);

      //generate a blob that stores the txt file with the messages in it
      var blob = new Blob([line], {type: "text/plain;charset=utf-8"});

      //create an url for the blob then trigger the download
      var downloadUrl = URL.createObjectURL(blob);
      this.setAttribute("href", downloadUrl);
    });


    //create events for when the upvote and downvote buttons are clicked
    uvote.addEventListener("click", function(){ vote(1);});
    dvote.addEventListener("click", function(){ vote(0);});

    //function to increment up or donw the rank of the answerer
    function vote(val){

      //hide the upvote and downvote buttons
      //posters can only vote once per chat
      uvote.style.visibility = "hidden";
      dvote.style.visibility = "hidden";

      //if upvote
      if(val ===1){

        //reference to the user's database values
        firebase.database().ref("Users/" + myUid).once("value", function(values){
          var Rank;                                                             //stores the answerer's rank
          var them = values.val().conWith;                                      //stores the uid of the answerer

          //send a message that the poster has upvoted
          document.getElementById("message").value = ' has up-voted';
          setTimeout(sendMessage(),3000);

          //access the database information of the answerer
          firebase.database().ref("Users/" + them).once("value", function(data){
            //increment their rank
            Rank = data.val().Rank + 1;
            firebase.database().ref('Users/' + them ).update({Rank});
          });
        });
      }

      //if downvote
      if(val ===0){
        //assume that the poster would like a log of the messages so far
        download.click();

        //inform the answerer that the poster has downvoted
        document.getElementById("message").value = ' has down-voted';
        setTimeout(sendMessage(),3000);

        //reference to the user's database values
        firebase.database().ref("Users/" + myUid).once("value", function(values){
          var Rank;                                                             //stores the answerer's rank
          var them = values.val().conWith;                                      //stores the uid of the answerer

          //access the database information of the answerer
          firebase.database().ref("Users/" + them).once("value", function(data){
            //decrement their rank
            Rank = data.val().Rank - 1;
            firebase.database().ref('Users/' + them ).update({Rank});
          });
        });
      }
    }
