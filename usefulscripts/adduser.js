
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "zombieattackeditor@gmail.com",
        pass: "eatbrains"
    }
});

exports.addUser = function(bcrypt,usersdb,user){

	//need to add checks to see if the user already exists
	   bcrypt.hash(user.password,null,null , function(err, hash) {
	   	user.password = hash;
    	usersdb.save(user.email,user,function(err,res){
    		if(err)
    			console.log('failed to create user' + user.email);
    		else
    			console.log('successfully created user' + user.email);
    	});

	});
};


exports.newUserRequest = function(bcrypt, request_db, user,responder){

	//need to add checks to see if the user has already requested an account or
	//already has one


	bcrypt.hash(user.password,null,null , function(err, hash) {
	   	user.password = hash;
    	request_db.save(user.email,user,function(err,res){
    		if(err){
    			console.log('failed to submit' + user.email);
    		}
    		else
    		{
    			console.log('successfully created user' + user.email);
	    		var response = Object();
	    		response.result = "Success";
	    		responder.json(response);
                sendSuccessRequestEmail(user);
    		}

    	});

    });
};


function sendSuccessRequestEmail(user){
    var mailOptions= {
        from: "Zombie Attack <zombieattackeditor@gmail.com>",
        to: user.email,
        subject:"Account Successfully Requested",
        text: user.name + ", \n We here at the Zombie Defense center have successfully " +
            "recieved your request to participate in the annihilation of the zombie hoard. " + 
            "Expect a response from within 2 hours to 2 millenia (hopefully the battle hasnt been " +
            "lost by that point). \n\n Regards, \n Zombie Annihilation TEAM"
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if(error)
        {
            console.log("failed to send email" + error);
        }
        else
        {
            console.log("email sent successfully" + error);   
        }
    });
}

