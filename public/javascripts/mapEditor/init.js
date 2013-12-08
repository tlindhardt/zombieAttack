
$('#main-header').hide();
// $('#editor-header').load('/mapEditorHeader.html', function() {
	bindMapTitle();
// });
// $('#editor-header').show();

var image = {
	bottom: new Image(),
 	middle: new Image(),
 	upper: new Image(),
 	events: new Image(),
 	player: new Image()
}

image.bottom.src = '/images/bottom.png';
image.middle.src = '/images/middle.png';
image.upper.src = '/images/upper.png';
image.events.src = '/images/events.png';
image.player.src = '/images/player.png';

image.bottom.onload = initBottomTiles;
image.middle.onload = initMiddleTiles;
image.upper.onload = initUpperTiles;
image.events.onload = initEventsTiles;

map.setImages(image);
initMap();

bindChecks();
bindKeyDown();