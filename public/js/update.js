setInterval(function() {
    update();
    //cache_clear()
  }, 25000);

  
function update(){
    var page = document.getElementById("pageTitle").innerText;
    document.getElementById('posts-section').innerHTML =  "<div class=\"post-bar company-title\"><center><h3 id=\"pageTitle\">" + page + "</h3></center></div>";
    getPost(page);
    console.log('reloaded');
}

/*$(document).ready(function() {
    setInterval(function() {
      cache_clear()
    }, 3000);
  });*/
  
  function cache_clear() {
    window.location.reload(true);
    // window.location.reload(); use this if you do not remove cache
  }