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

  // Reference to the post object in Firebase database
  var posts = firebase.database().ref("Posts");
  
  // Save a new post to the database, using the input in the form
  var submitPost = function () {

  // Get input values from each of the form elements
  var question = document.getElementById('question').value;
  var description = document.getElementById('description').value;
  var bounty = document.getElementById('price').value;
  var category = document.getElementById('category').value;
  
    // Push a new post to the database using those values

    var key = posts.push({
    "question": question,
    "description": description,
    "bounty": bounty,
    "category": category
    });
    console.log(key);
  };

  $(window).load(function () {
    $("#postForm").submit(submitPost);
  });