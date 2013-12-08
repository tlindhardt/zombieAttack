 $('#login-email').focus();

function loadMainPage()
{
    pageName = "main";
    $('#login-form').html("<table><tr><td><button id='logout-text' onclick='logout()' class='btn btn-success'> Logout </button></td><td><button id=\"userInfo-text\" class='btn btn-success'> UserInfo </button></td></tr></table>");
    $.post('/updatePage',{page:'main'},function(info){});
    bindUserInfo();
    

    $('#load-stuff-here').load('main.html',function(){
        $.get("/currentuser", {}, function(info)
        {
            var tr = $("<tr>");
            $(tr).append("<td><div id='buttonDiv' style='position: relative; left: 567px;bottom: 395px;'></div><td>");
            $("#load-table").append(tr);
            var buttonDiv = $('#buttonDiv');
            $(buttonDiv).append('<button id="playButton" href="#play-map-modal" style="position:relative; left:7px;" onclick="playMap()" class="btn btn-danger">PLAY</button><br><br>');
            $(buttonDiv).append('<button id="editButton" onclick="editMap()" style="position:relative; left:8px;" class="btn btn-danger" >EDIT</button><br><br>');
            $(buttonDiv).append('<button id="deleteButton" onclick="deleteMap()" class="btn btn-danger" >DELETE</button>');
            $('#playButton').hide();
            $('#editButton').hide();
            $('#deleteButton').hide();

            if(info.player)
            {
                $('#playButton').show();
            }
            if(info.designer)
            {
                $("#mainList").append('<a class="list-group-item" onmouseover="" href="#make-map-modal" data-toggle="modal" style="text-align:center;"><span class="glyphicon glyphicon-plus"></span></a>');
                $('#editButton').show();
            }
            if(info.admin)
            {
                $('#deleteButton').show();
            }
            $.get("/mapsrequest", {}, function(info) {
                var list = document.getElementById('mainList');
                for(var i = 0; i < info.length; ++i)
                {
                    var title = info[i].value.title;
                    var id = info[i].id;
                    var entry = document.createElement('a');
                    entry.appendChild(document.createTextNode(title));
                    entry.setAttribute('class','list-group-item');
                    entry.setAttribute('onClick','makeActive(this)');
                    entry.setAttribute('style','text-align:center;');
                    list.appendChild(entry);
                    $(entry).data(info[i].value);
                }        
            });
        });
    });
}

function loadDelay()
{
    $('#load-stuff-here').hide();
    $('#load-stuff-here').delay().fadeIn(500);
}

 function logout() {
    $.get('/logout',function(info){
        
    window.location = '/';
    });

}

 function bindUserInfo()
 {
    $('#userInfo-text').click(function() {
        loadUserInfo();
        return false;
    });  
 }
var clearVar;
var currentData;
 function makeActive(tableItem)
{
	var tableElements = document.getElementsByClassName('list-group-item active');
	$('.active').attr('class','list-group-item');
	tableItem.className = "list-group-item active";
    currentData = $(tableItem).data();
    drawMap('canvas', $(tableItem).data());
    if(!clearVar){
        makeStatic();
    }
}

function makeStatic(){
    clearVar = setInterval(function(){
        if(pageName == "main") {
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.width,canvas.height);
            setTimeout(function(){
                    drawMap('canvas', currentData);
            },Math.floor(Math.random()*300));
        }
    }, Math.floor(Math.random()*3000) + 300);
}

function startMap(id)
{
	pageName = "editor";
        $.post('/updatePage',{page:'editor'},function(info){});

    window.location.hash = '/edit/map/'+id;
	$('#load-stuff-here').load('mapEditor.html');
}

function refreshMapEditor()
{
	pageName = "editor";
    $.post('/updatePage',{page:'editor'},function(info){});

	loadDelay();
	$('#load-stuff-here').load('mapEditor.html');
}

function loadStartup()
{
	if(pageName === "home")
	{

	}
	else
	{
		pageName = "home";
        $.post('/updatePage',{page:'home'},function(info){});

		loadDelay();
		$('#load-stuff-here').load('startup.html');
	}
}

function playMap()
{
    var mapID = $(".active").data("_id");
    if(mapID === null)
    {
        console.log('crao');
    }
    else
    {
        $('#play-map-modal').modal('show');
        $(".modal-title").html($(".active").data("title"));
        console.log(mapID);
        var request = {
                mapid : mapID
        };
        $.post("/playMap", request, function(info)
        {
                console.log(info);
                $(".play-area").attr('src',info.url);
                $(".play-area").focus();
        });
        console.log("play");
    }
}

function editMap()
{
    var mapID = $(".active").data("_id");
    if(mapID === null)
    {

    }
    else
    {  
        stopTV();
        startMap(mapID); 
    }
}

function deleteMap()
{
    var mapID = $(".active").data("_id");
    if(mapID === null)
    {

    }
    else
    {
        var request = {
                id: mapID
            };

        $.post('/deletemap',request,function(data)
        {
            if(data.result === "success")
            {
                $(".active").remove();
                try
                {
                    stopTV();
                }
                catch(e)
                {
                    console.log('successfully deleted map');
                }
            }
            else
            {
                console.log('flip! there was an error.');
            }
        });
    }
}

$('#make-map-submit-btn').click(function() {
    var fail = false;
    console.log('make map button pressed');
    var name = $('#new-map-name');

    if (name.val() === "")
    {
        name.addClass('btn-danger');
        name.attr('placeholder', 'Must Enter A Name');
        fail = true;
    }
    else
    {
        name.attr('placeholder', 'Name');
        name.removeClass('btn-danger');
    }

    if (!fail) {
        var request = {
            name: name.val(),
            random: document.getElementById('new-random-map').checked
        };
        console.log(request);
        stopTV();
        $.post("/newmap", request, function(data) {
            if (data.result === "success") {
                console.log('successfully created new map');
                name.val('');
                $('#new-request-close-btn').trigger('click');
                setTimeout(function()
                {
                    startMap(data.id);
                }, 500);
            }
            else
            {
                console.log('error creating map');
            }
        });

    }
    else
    {
        console.log('map failed');
    }
});

function stopTV()
{
    clearInterval(clearVar);
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
    clearVar = null;
}
