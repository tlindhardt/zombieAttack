
var cradle = require('cradle');
var bcrypt = require('bcrypt-nodejs');

//uncoment the next three lines if you want to use a remote database

  var connection = new(cradle.Connection)('apt7r.us',3005,
 			{auth:{username:'zombie',password:'eatbrains'}});
 var users = connection.database('users');

var requests = connection.database('user_requests');
requests.destroy();
requests.create();


//users if you want a user (for now, just create a new entry here and )
var default_users = [{	name:'Greg Daniels',
						email:'gdaniels13@gmail.com',
						password:'greg',
						designer : false,
						player : false,
						admin : true,
						avatar : false},
						{ name:'designer',
						email:'designer@z.com',
						password:'designer',
						designer : true,
						player : false,
						admin : false,
						avatar : false},
						{name:'player',
						email:'player@z.com',
						password:'player',
						designer : true,
						player : false,
						admin : false,
						avatar : false},
						{name:'admin',
						email:'admin@z.com',
						password:'admin',
						designer : true,
						player : true,
						admin : true,
						avatar : false}];

var users_db = connection.database('users');
// users_db.destroy();
users_db.exists(function(err,exists){
	if(err){
		console.log('error',err);
	}
	else if(exists){
		console.log('database exists');
	}
	else
	{
		console.log('creating database and populating it');
		users_db.create()
		for (user in default_users){
			// console.log(default_users[user]);
			addUser(bcrypt,users_db,default_users[user])
		}
	}
});

function addUser(bcrypt,usersdb,user){
	   bcrypt.hash(user.password,null,null , function(err, hash) {
	   	user.password = hash
    	usersdb.save(user.email,user,function(err,res){
    		if(err)
    			console.log('failed to create user' + user.email);
    		else
    			console.log('successfully created user' + user.email);
    	});

    });
};



