
var cradle = require('cradle');

//uncoment the next three lines if you want to use a remote database
  var connection = new(cradle.Connection)('apt7r.us',3005,
 			{auth:{username:'zombie',password:'eatbrains'}});



var maps = [{
  title: "sample map",
  author: "dosmun",
  width: 15,
  height: 15,
  x: 4,
  y: 4,
  data: {
    bottom: [
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22, 0, 8,16,22,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 8,16,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 9,17,22,22,22,22,22,22,22,22,22,22],
      [22, 2, 0, 9, 8,16,22,22,22,22,22,22,22,22,22],
      [22,22, 1, 9, 9, 8, 8,16,22,22,22,22,22,22,22],
      [22,22, 2, 4, 9, 9, 9, 8,16,22,22,22,22,22,22],
      [22,22,22, 2,10, 4, 9, 9, 8,16,22,22,22,22,22],
      [22,22,22,22,22, 2, 4, 9, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22, 2, 4, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22,22, 2,10,18,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22]
    ],
    middle:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    top:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  events: [],
  env: "normal"
}];


var map_db = connection.database('maps');
map_db.destroy();
map_db.exists(function(err,exists){
	if(err){
		console.log('error',err);
	}
	else if(exists){
		console.log('database exists');
	}
	else
	{
		console.log('creating database and populating it');
		map_db.create()
		for(map in maps){
			map_db.save(maps[map]);
		}
	}
});




