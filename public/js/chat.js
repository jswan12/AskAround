
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

console.log(firebase.auth().currentUser);
var line = '';
var btn = document.getElementById("mybutton");
var download = document.getElementById("downLog");
var chan = 'a';
var messA = document.getElementById("message").value;
var name = /*firebase.auth().currentUser;*/document.getElementById("myName").value;
console.log(name);
firebase.database().ref('chats/' + chan + '/').once('value', function (chat) {
    chat.forEach(function (el) {
        var element = el.val();
        var mess = JSON.stringify(element);
        mess = mess.slice(1, mess.length - 1);
        var messLi = document.createElement("LI");
        var messTxt = document.createTextNode(mess);
        messLi.appendChild(messTxt);
        document.getElementById("txtBox").appendChild(messLi);
        line = line + (mess + "\n");
    });
});

btn.addEventListener("click", function () {
    messA = document.getElementById("message").value;
    name = document.getElementById("myName").value;
    if (name == null) {
        name = "anon";
    }
    messJ = name + ": " + messA;
    firebase.database().ref('chats/' + chan + '/').push(messJ);
    document.getElementById("message").value = '';

});
var chatRef = firebase.database().ref('chats/' + chan + '/');

chatRef.on('child_added', function (msg) {
    var mess = JSON.stringify(msg);
    mess = mess.slice(1, mess.length - 1);
    var messLi = document.createElement("LI");
    var messTxt = document.createTextNode(mess);
    messLi.appendChild(messTxt);
    document.getElementById("txtBox").appendChild(messLi);
    line = line + (mess + "\n");
});

download.addEventListener("click", function () {
    var date = new Date();
    var d = "messageOn-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + ".txt"
    var atr = document.createAttribute("download");
    atr.value = d;
    this.setAttributeNode(atr);
    var blob = new Blob([line], { type: "text/plain;charset=utf-8" });
    var downloadUrl = URL.createObjectURL(blob);
    this.setAttribute("href", downloadUrl);
});