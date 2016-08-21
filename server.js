
// require express sessions
session = require('express-session');
// init express server
var app = require('express')();
// adds sessions to app
app.use(session({
    secret: 'no secret',
    resave: true,
    saveUninitialized: true
}));
// inits http to the server
var http = require('http').Server(app);
// requires socket.io and syncs it with http
var io = require('socket.io')(http);
var path = require('path');


// routing for index.html
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});


// io socket listener for on connenction
io.on('connection', function(socket){
  console.log('a user connected');
// listens for response from client side (index.html line 46)
  socket.on('chat message', function(msg){
  	io.emit('message', msg);
  });
// for when client socket side disconnects
  socket.on('disconnect', function(){
  	console.log('user disconnect');
  });
});


require('./control.js')(app);

http.listen(3000, function(){
  console.log('listening on :3000');
});

