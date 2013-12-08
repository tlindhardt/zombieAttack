
function dragStart(e) {

}

function initMap() {
	var mapId = window.location.hash.split('/')[3];

	if (mapId) {
		map.setMap({width:0, height:0});
		
    $.get('/map/' + mapId, {}, function(data) {
			map.setMap(data);
      setTitle(data.title);
    });
	}
}

function refresh() {
	clearInterval(interval);
	refreshMapEditor()
}

function back() {
	$('#main-header').show();
	$('#editor-header').hide();

	$.post('/updatePage',{page:'home'},function(info){});
	window.location.hash = '';
	loadMainPage();
}

function save() {
	map.setChanged(false);
	$.post('/map', {map: map.getMap()}, function(data) {
		if(data.result === "success") {
			onSaved();
		} else {
			console.log("Save failed: " + data);
		}
	});
}


function saveCopy() {
	var m = map.getMap();
	m.title += " - Copy";
	delete m._id;
	delete m._rev;
	
	$.post('/map', {map: m}, function(data) {
		if(data.result === "success") {
			m._id = data.mapData.id;
			map.setMap(m);
			onSaved();
		} else {
			console.log("Save failed: " + data);
		}
	});
}

function onSaved() {
	saveTime = new Date();
	setSaveTime();
	map.setChanged(false);
	setTitle(map.getTitle());
}


function bindChecks() {
	$('#CHK-bottom').change(function() {
		map.showLayer('bottom', $('#CHK-bottom').prop('checked'));
	});
	$('#CHK-middle').change(function() {
		map.showLayer('middle', $('#CHK-middle').prop('checked'));
	});
	$('#CHK-upper').change(function() {
		map.showLayer('upper', $('#CHK-upper').prop('checked'));
	});
	$('#CHK-grid').change(function() {
		map.showGrid($('#CHK-grid').prop('checked'));
	});
	$('#CHK-player').change(function() {
		map.showPlayer($('#CHK-player').prop('checked'));
	});
}


function setTitle(title) {
    $("#map-title").val(title);
}

function bindMapTitle() {
	$('#map-title').val(map.getTitle());
	$('#map-title').keyup(function() {
		map.setTitle($('#map-title').val());
	});
}

function bindKeyDown() {
	$(document).unbind("keydown");
	
	$(document).keydown(function(e) {
	
		switch (e.which) {
			case 37: //left
				e.preventDefault();
				map.moveLeft();
				break;
			case 38: //up
				e.preventDefault();
				map.moveUp();
				break;
			case 40: //down
				e.preventDefault();
				map.moveDown();
				break;
			case 39: //right
				e.preventDefault();
				map.moveRight();
				break;
			case 27: //escape
				e.preventDefault();
				if($('.help').length) closeHelp();
				else back();
				break;			
			case 8: //backspace
				e.preventDefault();
				back();
				break;
			case 112: //F1
				e.preventDefault();
				if($('.help').length) closeHelp();
				else help();
				break;
		}
		if(e.ctrlKey) {
			switch(e.which) {
				case 83: //s
					e.preventDefault();
					save();
					break;
				case 67: //cg
					map.copy();
					break;
				case 86: //v
					map.paste();
					break;
				case 90: //z
					map.undo();
					break;
				case 89: //y
					map.redo();
					break;
				case 187: //plus
				case 107:
					e.preventDefault();
					map.zoomIn();
					break;
				case 189: //minus
				case 109:
					e.preventDefault();
					map.zoomOut();
					break;
			}
		}
	});
}



var style = {
	top: {
		padding: 80
	},
	left: {
		width: 400,
		padding: 20,
		closed: false
	}
};

setMapSize();

function slide() {
	if(style.left.closed) {
		openLeft();
		$('.slide').attr('class', 'slide glyphicon glyphicon-chevron-left');
	}
	else {
		closeLeft();
		$('.slide').attr('class', 'slide glyphicon glyphicon-chevron-right');
	}
}

function closeLeft() {
	$('.left-side').animate({left: -style.left.width + 'px'}, "slow");
	$('.slide').animate({left: 0 + 'px'}, 'slow');
	$('#map').animate({ left: 20 + 'px'}, 'slow');
	style.left.closed = true;
	setMapSize();
}

function openLeft() {
	$('.left-side').animate({'left': 0 + 'px'}, "slow");
	$('.slide').animate({left: 420 + 'px'}, "slow");
	$('#map').animate({ left: 20 + style.left.padding + style.left.width + 'px'}, 'slow', setMapSize);
	style.left.closed = false;	
}

function progress(animation, progress, milsLeft) {
	console.log(Math.floor(progress*100) % 5)
	if(Math.floor(progress*100) % 5 == 0) {
		if(style.left.closed) {
			map.moveRight();
		} else {
			map.moveLeft();
		}
	}
}

function setMapSize() {
	var width = window.innerWidth - style.left.padding - style.left.width;
	var height = window.innerHeight - style.top.padding;

	if(style.left.closed) {
		width = window.innerWidth;
	}
	$('#map').attr('width', width);
	$('#map').attr('height', height);
	$('.slide').css('height', height);
	$('.slide').css('padding-top', height/2);
	$('.left-side').css('height', height);

	map.refresh();
}

function centerMap() {
	var tileSize = map.getCanvasTileSize();
	var rows = Math.floor($('#map').width()/tileSize); 
	var w = map.getWidth();
	var offset = (rows-w)/2;

	if(rows < w)
		offset = 0;

	map.setXOffset(offset);

	var cols = Math.floor($('#map').height()/tileSize); 
	var h = map.getHeight();
	var offset = (cols-h)/2;

	if(cols < h)
		offset = 0;

	offset = Math.floor(offset);

	map.setYOffset(offset);
}

$(window).resize(setMapSize);

function help() {
	var div = $('<div>');

	div.addClass('help');
	div.load('help.html', showHelp(div));

	div.css('left', window.innerWidth/2-150);
}

function showHelp(div) {
	return function() {
		$('#map-editor').append(div);

		var top = window.innerHeight/2-div.height()/2;
		var left = window.innerWidth/2-div.width()/2;

		div.animate({
			top: 20,
			left: left 
		});
	}
}

function closeHelp() {
	$('.help').remove();
}