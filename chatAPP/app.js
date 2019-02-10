// in order to run this begin by installing node js
// then in the command line type node app.js
//then from there open a web browser and type localhost:3000
var app = require('express')();
var http = require('http').Server(app);
var io  = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){
  console.log('New Connection from: ' + socket.request.connection.remoteAddress );
  socket.on('messToServer', function(msg){
    console.log(msg);
    socket.broadcast.emit('messFromServer', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:' + 3000);
});
