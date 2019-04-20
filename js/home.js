	/***********************************************************************
	 * Update top left div to display current user's profile name		   *
	 * Update top right drop-down menu to have user's profile name as well *
	 ***********************************************************************/
	firebase.auth().onAuthStateChanged(function (user) {
		if (user){
			if(document.getElementById('userRank') === '')
				document.location.reload(true);
			document.getElementById("usernameID").innerText = firebase.auth().currentUser.displayName, document.getElementById("userName").innerText = firebase.auth().currentUser.displayName;
		}
		else
			window.location = "index.html";
	});

	/***********************************************************************
	 * Logout the current user											   *
	 ***********************************************************************/
	function logOut(){
		firebase.auth().signOut().then(function() {alert("Logout Successful.")}).catch(function(error){alert("An Error Occured.")});
    }
    
    var handler = StripeCheckout.configure({
        key: 'pk_test_Q5ThBKpfol6VEp6vpjnxBywu00kkFXE6o8',
        image: 'https://files.stripe.com/files/f_test_ujyIlAmzpGTMyScSYWrAK4o8',
        locale: 'auto',
        token: function(token) {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          alert("Payment Successful!");
              $(".post-popup.job_post").addClass("active");
              $(".wrapper").addClass("overlay");
              document.getElementById('price').value = document.getElementById('userBounty').value;
              console.log(token.id);
      
              var tokenString = token.id;
              firebase.database().ref('Users/' + uid ).update({tokenString});
        }
        });
      
        document.getElementById('postButton').addEventListener('click', function(e) {
        // Open Checkout with further options:
          //console.log("curchat is::: " + curChatA);
          if(curChatA === 'null'){
            handler.open({
              name: 'AskAround',
              description: 'Bounty Payment',
              amount: document.getElementById('userBounty').value*100,
              zipCode: true
            });
            e.preventDefault();
          }
          else{
              alert("sorry only one post at a time!!");
          }
        });
      
        // Close Checkout on page navigation:
        window.addEventListener('popstate', function() {
          handler.close();
        });