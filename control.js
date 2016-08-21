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


// require express server
module.exports = function(app){

app.get('/login/:name', function(req, res){
	db.user.find({"name": req.params.name}, function(err, docs){
		res.send(docs);
	});
})

};