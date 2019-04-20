if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log("user check passed")
            var displayName = firebase.auth().currentUser.displayName;
            document.getElementById('hiUser').innerText = "Hey there,\n " + displayName;
            var uid = firebase.auth().currentUser.uid;
            var done = false;
            firebase.database().ref('Users/' + uid).once('value', function(data){
                var claimAmount0 = data.val().claimAmount;
                var stripeID0 = data.val().stripeID;
                document.getElementById('attribute0').innerText = "$"+ claimAmount0;
                document.getElementById('attribute1').innerText = stripeID0;
                done = true;
                console.log('finished setting DOM obj to data')
            }).then(function(){
                console.log('reseting firebase database')
                claimAmount = 0.00, tokenString = "null";
                //reset claim to 0.00
        
                // var stripe = require('stripe')(sk_test_LEoxihDqCYeW1QVhG6shShQn00BFRodwbs);
                // stripe.payouts.create(
                // {
                // 	amount: 'claimAmount',
                // 	currency: 'usd',
                // 	method: 'instant',
                // },{stripe_account: 'stripeID'});
                firebase.database().ref('Users/' + uid ).update({claimAmount});
                firebase.database().ref('Users/' + uid ).update({tokenString});
            });
        }
        else{
                console.error("Can't fetch data, user not logged in!");
                document.getElementById('hiUser').innerText = "Hey there,\n " + "Mr. Null";
                document.getElementById('attribute0').innerText = "$"+ 0.00;
                document.getElementById('attribute1').innerText = "not connected";
        }
        console.log('finished function');
    });
}

function payout(){
    alert("Congrats you have claimed your cash!\nPlease monitor your Stripe account for the amount to be posted");
    window.close();
}