
/*
*post login
*/

exports.login = function(req,res)
{
	console.log(req.email);
	console.log(req.password);
	res.send("look at the log");
}