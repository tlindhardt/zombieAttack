var cradle = require('cradle');
var connection = new(cradle.Connection)('apt7r.us',3005,
 			{auth:{username:'zombie',password:'eatbrains'}});
var users = connection.database('users');
var userRequests_db = connection.database('user_requests');


users.view('_id',function(err,res){
	if(err){
		console.log(err);
	}
	res.forEach(function(row){
		console.log(row);
	});
});