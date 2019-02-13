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
  var posts = firebase.database();
  // Save a new post to the database, using the input in the form
  var submitPost = function () {

  // Get input values from each of the form elements
  var question = document.getElementById('question').value;
  var description = document.getElementById('description').value;
  var bounty = document.getElementById('price').value;
  var category = document.getElementById('category').value;
  // Reference to the post object in Firebase database
  posts = posts.ref("Posts/" + category);
  
    // Push a new post to the database using those values

    posts.push({
    "question": question,
    "description": description,
    "bounty": bounty,
    "category": category
    });
  };

  function getPost(sub){
    posts.ref("Posts/" + sub).on('value', gotData, noData);
  }

  function gotData(data){
    try{
      var keys = data.val();
      var keysArray = Object.keys(keys);
      keysArray.forEach(element => {
        //var userName = keys[element].userName;
        //console.log(keys[element]);
        var question = keys[element].question;
        var description = keys[element].description;
        var bounty = keys[element].bounty;
        var category = keys[element].category;
        //console.log(question, "\n"+description, '\n'+bounty, "\n"+category);

        var html = [
          '<div class="post_topbar">',
              '<div class="usy-dt">',
              
                  '<div class="usy-name">',
                      '<h3>',
                      'getUsername()',
                      '</h3>',
                      '<span><img src="images/clock.png" alt="">$',
                      bounty,
                      '</span>',
                  '</div>',
              '</div>',
              '<div class="ed-opts">',
                  '<a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>',
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
    }
    catch(err){
      console.log(err);
    }
  }
  function noData(error){
    console.log("error!");
    console.log(error);
  }

  $(window).load(function() {
    $("#postForm").submit(submitPost);
  }, getPost(document.getElementById("pageTitle").innerText));