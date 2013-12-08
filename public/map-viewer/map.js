var currentIndex = 0;
var maps = [];

var postData = {
	email: 'admin',
	password: 'admin'
};

$.post('/', postData, function(data){
	if(data.result === 'Success') {
		$.get('/mapsrequest', function(data) {
			maps = data;
			play();
		});
	} else {
		alert("Something is wrong.");
	}
});


var spriteImage = new Image();
spriteImage.src = '/images/bottom.png';

var interval;

function back() {
	currentIndex--;
	if(currentIndex < 0) 
		currentIndex = maps.length-1;

	drawMap('canvas', spriteImage, maps[currentIndex].value);
	$('#title').html("Map: " + currentIndex + " Title: " + maps[currentIndex].value.title);	
}

function play() {
	clearInterval(interval);
	interval = setInterval(function() {
		currentIndex++;

		if(currentIndex >= maps.length)
			currentIndex = 0;

		drawMap('canvas', spriteImage, maps[currentIndex].value);
		$('#title').html("Map: " + currentIndex + " Title: " + maps[currentIndex].value.title);

	}, 2000);
}

function pause() {
	clearInterval(interval);
}

function next() {
	currentIndex++;
	if(currentIndex >= maps.length) 
		currentIndex = 0;

	drawMap('canvas', spriteImage, maps[currentIndex].value);
	$('#title').html("Map: " + currentIndex + " Title: " + maps[currentIndex].value.title);	
}

///////////////////////// This is the function you need //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

// given 
//	canvasId : the id of the canvas 
// 	spriteImage : a var of type Image()
// 	map: a valid map object

function drawMap(canvasId, spriteImage, map) {
	var canvas = document.getElementById(canvasId);
	var context = canvas.getContext('2d');

	var spriteTileSize = {
		width: 40, 
		height: 40
	};

	var scale = {
		x: map.width ? canvas.width/map.width : 40,
		y: map.height ? canvas.height/map.height : 40
	};

	var minScale = scale.x < scale.y ? scale.x : scale.y;

	var canvasTileSize = {
		width: minScale, 
		height: minScale
	};

	clearCanvas();
	drawLayer(map.data.bottom, context);

	function clearCanvas() {
		context.fillStyle = "grey";
		context.fillRect(0,0,canvas.width, canvas.height);
	}

	function drawLayer(layer, context) {
		for(var row in layer) {
			for(var col in layer[row]) {
				var imageNumber = +layer[row][col];
				drawTile(imageNumber, row, col);
			}
		}
	}

	function drawTile(imageNumber, row, col) {
		var imageLoc = {
			x: imageNumber % 8 * spriteTileSize.height,
			y: Math.floor(imageNumber / 8) * spriteTileSize.width
		};	

		var canvasLoc = {
			x: col * canvasTileSize.height,
			y: row * canvasTileSize.width
		};

		context.drawImage(spriteImage, 
						  imageLoc.x, imageLoc.y,
						  spriteTileSize.width, spriteTileSize.height,
						  canvasLoc.x, canvasLoc.y,
						  canvasTileSize.width, canvasTileSize.height);
	}	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////