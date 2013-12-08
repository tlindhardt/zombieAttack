//random constants and other things
var TIMEOUT = 1200000;
	//TIMEOUT = 10000
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var cradle = require('cradle');
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var userFunctions = require('./usefulscripts/adduser');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('zombiesarefun'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkAuth);
app.use(express.static(path.join(__dirname, 'private')));
app.use(express.bodyParser({uploadDir:'/testTemp'}));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//setup the users database//

// var connection = new(cradle.Connection)('apt7r.us',3005,
//  			{auth:{username:'zombie',password:'eatbrains'}});

var connection = new(cradle.Connection)("162.248.11.179",5983,
 			{auth:{username:'acm',password:'foobar'}});
var users = connection.database('users');
var userRequests_db = connection.database('user_requests');
var maps = connection.database('maps');


//done
app.post('/', function(req,res)
{
	var id = req.body.email;
	var pass = req.body.password;
	var response = Object();
	response.result = "fail";

	users.get(id, function(err,doc){
		if(err){
			console.log("failed to get user from database");
			response.result = "Invalid userName or password";
			res.json(response);
		}
		else{
			var newhash=doc.password;
			bcrypt.compare(pass,newhash,function(err,result){
				if(result){
					console.log("successfully authenticated " + doc._id);
					req.session.user = doc;
					req.session.lastActivity = new Date().getTime();
					response.result = "Success";
                    response.user = req.body.email;
                    req.session.curPage = 'main'
					res.json(response);
				}
				else{
					console.log('failed to compare');
					response.result = "Invalid userName or password";
					res.json(response);
				}
			});
		}
	});
});

//done
app.get('/currentuser', function(req,res){
	if(req.session.user)
	{
		var response = req.session.user;
		response.page = req.session.curPage;
		res.json(response);
	}
	else
		res.json({result:"failure"});
});

app.post('/updatePage', checkAuth, function(req,res){
	req.session.curPage = req.body.page;
	res.json({result:'success'});
});

// ------------ MAP REQUESTS --------------- //

//done
app.post('/map', checkAuth, checkDesigner, function(req, res) {

	var map = req.body.map;
        console.log(map);
    
    map.author = req.session.user.name;

	var toReturn = {};

	if(map._id){
		var mapId;	
		mapId = map._id;
	    delete map._rev;

		maps.save(mapId,map, function(err,reso){
			console.log(reso);
			if(err)
			{
				toReturn.result = "failure";
			}
			else
			{
				toReturn.mapData = reso
				toReturn.result = "success"
			}
	        res.json(toReturn);
		});
	}
	else
	maps.save(map, function(err,reso){
			console.log(reso);
			if(err)
			{
				toReturn.result = "failure";
			}
			else
			{
				toReturn.mapData = reso;
				toReturn.result = "success"
			}
	        res.json(toReturn);
		});
});

app.post('/updatemap', checkDesigner, function(req, res) {

	var lastActivity = new Date().getTime() - req.session.lastActivity;
	var toReturn = {};

  if (!req.session.user) {
  	toReturn.result = "failure"
  	toReturn.message = "Unauthorized"
    res.json(toReturn);
  } 
  else {
  	if(lastActivity>TIMEOUT)
  	{
  		delete req.session.user;
  		delete req.session.lastActivity;
  		toReturn.result = "failure"
  		toReturn.messge = 'you have been logged out due to innactivity, please login again';
  		res.json(toReturn);
  	}
  }

	var map = req.body.map;
        console.log(map);
    
    	var mapId= map._id;
	    delete map._rev;
		maps.save(mapId,map, function(err,reso){
			console.log(reso);
			if(err)
			{
				toReturn.result = "failure";
				toReturn.message = "Database Error"
			}
			else
			{
				toReturn.mapData = reso
				toReturn.result = "success"
			}
	        res.json(toReturn);
		});
	
});


app.post('/uploadImage',checkAuth,function(req,res){
	console.log("UPLOADE IMAGE: " + request.body);
	res.json({result:'success'});
});

//done
app.get('/map/:id?', checkAuth, checkDesigner,function(req, res) {
	var mapId = req.route.params.id;
	maps.get(mapId, function(error, map){
		if(error)
		{
			res.json({"result":"failure"});
		}
		else
		{
			req.session.user.currentMap = mapId;
			res.json(map);
		}
	});
});



app.post('/deletemap', checkAuth,checkAdmin, function(request, response){
	maps.remove(request.body.id,function(error,res){
		if(error)
		{
			response.json({"result":"failure"});
		}
		else
		{
			response.json({"result":"success"});
		}
	});
});

app.post('/newmap', checkAuth, checkDesigner, function(request, response){
	maps.get('default',function(error,res){
		if(error){
			console.log("error bad things happening with the database");
		}
		else
		{
			delete res._id ;
			delete res._rev;
			console.log(request.body.name);
			res.title = request.body.name;
			res.author = request.session.user.name;

				if(request.body.random ==='true'){
					console.log('random');
					var b = res.data.bottom;
					// console.log(b);
					for(var j = 0; j<b.length; ++j){
						for(var i = 0; i<b[j].length; ++i)
						{
							b[j][i] =Math.floor(Math.random()*43);
						}
					}
				}


			//console.log (request);
			maps.save(res,function(erro, resp){
				if(erro)
					console.log('problems');
				else
				{
					resp.result = 'success';
					
					response.json(resp);
				}
			});
		}
	});
});

//done
app.post('/playMap', checkAuth, checkPlayer, function(req, res){

	var mapId = req.body.mapid;

	maps.get(mapId,function(error, doc){
		if(error){
			console.log("error requesting map: " + mapId);
			res.send("failure");
		}
		else{
			delete doc._id;
			delete doc._rev;

			var options = {

				method: 'POST',
				url:"http://zombie-attack.aws.af.cm/uploadMap/d7f073fb-55c8-91bf-4d63-b65268a626d4",
				json: {map:doc}
			};
			request(options, function(err, resp, body){
				res.send(body);
			});
		}
	});
});

// ------------------------------------------ //


app.get('/mapsrequest', checkAuth, function(req, res){
	maps.get('_design/company/_view/all', function(error, response){
		if(error)
			console.log('error requesting maps');
		else
		{
			console.log("successfully retrievd maps");
			res.json(response);
		}
	});
});

app.get('/users', checkAuth, checkAdmin, function(req,res){
	users.get('_design/company/_view/all', function(error, response){
		if(error)
		{
			console.log('error requesting users')
		}
		else
		{
			console.log('successfully retrieved users');
			res.json(response);
		}
	});
});

app.get('/userrequests', checkAuth,checkAdmin ,function(req,res){
	userRequests_db.get('_design/company/_view/all', function(error, response){
		if(error)
		{
			console.log('error requesting users')
		}
		else
		{
			console.log('successfully retrieved users');
			res.json(response);
		}
	});
});
//done
app.post('/approve', checkAuth,checkAdmin, function(req,res){

	var response = Object();
	response.result = "failure";
	userRequests_db.get(req.body.id, function(error, newUser){
		if(error){
			console.log('error requesting ' + req.body.id);
			res.json(response);
		}
		else
		{
			delete newUser._id;
			delete newUser._rev;
			newUser.admin = false;
			newUser.player = true;
			newUser.designer = false;
			newUser.avatar = false;
			users.save(newUser.email, newUser,function(err,respon){
    		if(err)
    		{

    			console.log('failed to create user' + newUser.email);
    			res.json(response);
    		}
    		else
    		{
    			console.log('successfully created user' + newUser.email);
    			userRequests_db.remove(req.body.id,function(err,respons){
    				if(err)
    				{
    					console.log('error deleting ' + req.body.id);
    					res.json(response);
    				}
    				else{
    					console.log('successfully deleted ' + req.body.id);
    					response.result = "success";
    					res.json(response);
    				}
    			});
    		}
    	});
		}
	});

});

//done
app.post('/deleteuser', checkAuth,checkAdmin, function(request, response){
	users.remove(request.body.id,function(error,res){
		if(error)
		{
			response.json({"result":"failure"});
		}
		else
		{
			response.json({"result":"success"});
		}
	});

});

//done
app.post('/deny', checkAuth, checkAdmin, function(request, response){
	userRequests_db.remove(request.body.id,function(error,res){
		if(error)
		{
			response.json({"result":"failure"});
		}
		else
		{
			response.json({"result":"success"});
		}
	});

});



//done
app.get('/logout', function(req,res){
	req.session.destroy();
	// delete req.session.user;
	// delete req.session.lastActivity;
	res.json({result:"logged out"})
	// res.redirect('');
});


//done
app.post('/newuserrequest',function(req,res){
	userFunctions.newUserRequest(bcrypt,userRequests_db,req.body,res);
});

//done
app.post('/createUser',checkAuth,checkAdmin, function(req,res){
	var user = new Object();
	user['name'] = req.body.name;
	user['password']= req.body.password;
	user['email']=req.body.email;
	userFunctions.adduser(bcrypt,users,user);
	res.send('<h1>success<h1>');
});


//done
app.post('/editpassword',checkAuth,function(request, response){
	var password = request.body.password;
	var user = request.session.user;
	//console.log(password);
	bcrypt.hash(password, null, null, function(err,hash){
			user.password = hash;
			//console.log(hash);
			users.save(user._id, user._rev,user, function(er, re){
				if(er)
				{
					response.json({"result":"failure"})
				}
				else
				{
					response.json({"result":"success"})
				}
		});
	});
});

app.post('/editname',checkAuth,function(request, response){
	
	var user = request.session.user;

	user.name =  request.body.name;
	users.merge(user._id, {name:user.name}, function(er, re){
		if(er)
		{
			response.json({"result":"failure"});
		}
		else
		{
			response.json({"result":"success"});
		}
	});
});

function evaluateStringBoolean(string)
{
	if(string =='true')
		return true;
	else
		return false;
}

app.post('/upgrade',checkAuth, checkAdmin,function(request, response){
	
	
	users.get(request.body.id, function(err, user){
		user.admin =  evaluateStringBoolean( request.body.admin);
		user.player =  evaluateStringBoolean( request.body.player);
		user.designer =  evaluateStringBoolean( request.body.designer);

		if(err){
			response.json({"result":"failure"})
		}
		else {
			users.save(user._id, user._rev,user, function(er, re){
				if(er)
				{
					response.json({"result":"failure"})
				}
				else
				{
					response.json({"result":"success"})
				}
			});
		}
	});
});


function checkAdmin(req, res, next)
{
	if(req.session.user.admin)
	{
		next();
	}
	else
	{
		res.json({"result":"failure","message":"you are not an administrator"});
	}
}

function checkPlayer(req,res,next)
{
	if(req.session.user.player)
	{
		next();
	}
	else
	{
		res.json({"result":"failure","message":"you are not a player"})
	}
}
function checkDesigner(req,res,next)
{
	if(req.session.user.designer)
	{
		next();
	}
	else
	{
		res.json({"result":"failure","message":"you are not a designer"})
	}
}


function checkAuth(req, res, next) {
	var lastActivity = new Date().getTime() - req.session.lastActivity;
	//console.log(lastActivity);
  if (!req.session.user) {
  	//console.log(lastActivity);
  		res.redirect('/logout');
  
  } 
  else {
  	if(lastActivity>TIMEOUT)
  	{
  		req.session.destroy();
  		res.redirect('/logout');
  	}
  	else
  	{
  		req.session.lastActivity = new Date().getTime();
		next();
	}
  }
}



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
