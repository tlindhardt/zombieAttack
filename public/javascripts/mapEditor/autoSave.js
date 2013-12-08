var saveTime = new Date();
setSaveTime();
var saveInterval = 15000;

var interval = setInterval(function(){
	setSaveTime();
	var time = new Date();

	if((time - saveTime) >= saveInterval && map.getChanged()) {
		$("#save-time").html("Saving...");
		save();
	}
}, 1000);

function setSaveTime() {
	if(map.getChanged()) {
		$("#save-time").html("Time: " + formatTime(new Date()) + " Last Save: " + formatTime(saveTime));
	} else {
		$("#save-time").html("Time: " + formatTime(new Date()) + " No Changes since: " + formatTime(saveTime));
	}
}

function formatTime(date) {
	var h = +date.getHours();
	var m = +date.getMinutes();
	var s = +date.getSeconds();

	if(h > 12) h = h - 12;

	if(h < 10) h = "0" + h;

	if(m < 10) m = "0" + m;

	if(s < 10) s = "0" + s;

	return h + ":" + m + ":" + s;
}



