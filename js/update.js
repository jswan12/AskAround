firebase.database().ref("Posts/").on('child_changed', function(childSnapshot, prevChildKey){
    update();
});

function update(){
    var page = document.getElementById("pageTitle").innerText;
    document.getElementById('posts-section').innerHTML =  "<div class=\"post-bar company-title\"><center><h3 id=\"pageTitle\">" + page + "</h3></center></div>";
    getPost(page);
    //HIDE THIS LOG WHEN LAUCHING
    console.log('child_changed trigger called');
}