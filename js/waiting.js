var flag = false;
//firebase.auth().signInWithEmailAndPassword("priver3@lsu.edu", "password"); // placeholder account for offline testing
firebase.auth().onAuthStateChanged(function(user){
  if(user){
    var curPostType= '';
    firebase.database().ref('Users/' + user.uid).once('value', function(data){
      curPostType = data.val().curPostType;
      firebase.database().ref('Posts/' + curPostType + '/').once('value',function(data){
        data.forEach(function(child){
          if(child.val().uid === user.uid){
            var curPostId = child.key;
            console.log(child.val().uid);
            firebase.database().ref('Users/' + user.uid ).update({curPostId});
          }
        });
      });
    });
    var cancel = document.getElementById("cancel");
    window.onbeforeunload = function(){
      if(!flag){
        cancel.click();
      }
    };

    firebase.database().ref('chats/'+ user.uid +'/txts').once('child_added', function(msg){
      //flag=true;
      window.open('chat.html');
      console.log('hello there');
      window.open('','_self','');
      window.close();
    });

    cancel.addEventListener("click", function(){
      flag = true;
      var visibility = "hidden";
      var curChat = 'null';
      var curPostId  = 'null';
      curPostType= 'null';
      firebase.database().ref('Users/' + user.uid).once('value', function(data){
        var id = data.val().curPostId;
        var type=data.val().curPostType;
        console.log(id);
        console.log(type);
        firebase.database().ref('Posts/' + type + '/' + id ).update({visibility});
        firebase.database().ref('Users/' + user.uid ).update({curChat});
        firebase.database().ref('Users/' + user.uid ).update({curPostId});
        firebase.database().ref('Users/' + user.uid ).update({curPostType});
        window.open('','_self','');
        window.close();
      });
    });

  }
});