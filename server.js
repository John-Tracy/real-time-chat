
// require mongodb
var mongojs = require('mongojs');
// Database configuration
var databaseUrl = 'real-time';
var collections = ["user"];
//  mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});
// socket namespace constructor
function NameSpace(name){
	this.name = name;
};

// init express server
var app = require('express')();
// Sets up the Express app to handle data parsing 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// inits http to the server
var http = require('http').Server(app);
// requires socket.io and syncs it with http
var io = require('socket.io')(http);
var path = require('path');


// routing for index.html
app.post('/login', function(req, res){

		db.user.find({"name": req.body.user}, function(err, docs){
		if(docs != null || undefined){
			res.json({
					name: docs[0].name,
					message: "success"
			})
		}
		else{
			res.json({
				message: "invalid"
			})
		}
	});
})

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
})

// io socket listener for on connenction
io.on('connection', function(socket){
	// listens for response from client side (index.html line 46)
	  socket.on('chat message', function(msg, userId){
	  	io.emit('message', msg, userId);
	  });
	// for when client socket side disconnects
	  socket.on('disconnect', function(){
	  	console.log('user disconnect');
	  });
 });


http.listen(3000, function(){
  console.log('listening on :3000');
});

