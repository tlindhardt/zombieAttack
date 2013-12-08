var selectedUser;
var currentUser;
function setMe()
{
    $('#approveUserData').hide();
    $('#denyUserData').hide();
    $('#upgradeUserData').hide();
    $('#deleteUserData').hide();
    $('#editUserData').show();
    $('#imageUpload').show();

    $('#permTable').hide();
    $('#editTable').show();

}
function setRequest()
{
    $('#approveUserData').show();
    $('#denyUserData').show();
    $('#upgradeUserData').hide();
    $('#deleteUserData').hide();
    $('#editUserData').hide();
    $('#imageUpload').hide();

    $('#permTable').hide();
    $('#editTable').hide();
}
function setOther()
{
    $('#approveUserData').hide();
    $('#denyUserData').hide();
    $('#upgradeUserData').show();
    $('#deleteUserData').show();
    $('#editUserData').hide();
    $('#imageUpload').hide();

    $('#permTable').show();
    $('#editTable').hide();
}

function loadUserInfo()
{
    pageName = "userInfo";
    $.post('/updatePage',{page:'userInfo'},function(info){});

    $('#login-form').html("<table><tr><td><button onclick='logout()' class='btn btn-success'> Logout </button></td><td><button id=\"userInfo-text\" class='btn btn-success'> UserInfo </button></td></tr></table>");
    $('#userInfo-text').html("Go Back");
    bindBackToMain();

    $('#load-stuff-here').load('userinfo.html', function(){
        $.get("/currentuser", {}, function(user)
        {
            selectedUser = user._id;
            currentUser = user._id;
            
    var avatar = get_gravatar_image_url(selectedUser,175);
    $('#gravatar').attr('src',avatar);
    $('#gravatar').attr('title','No image? create a gravatar ');
            setUserUI(user._id, user.name, user.admin, user.designer, user.player);
            if(user.admin)
            {
                $('#userSidePanel').hide();
                setMe();
                $.get("/users", {}, function(info) {
                    var list = document.getElementById('userList');
                    for(var i = 0; i < info.length; ++i)
                    {
                        var name = info[i].value.name;
                        var entry = document.createElement('li');
                        entry.appendChild(document.createTextNode(name));
                        if(info[i].value._id == currentUser)
                        {
                            entry.setAttribute('class','list-group-item active');
                        }
                        else
                        {
                            entry.setAttribute('class','list-group-item');
                        }
                        entry.setAttribute('id', md5(info[i].value._id.toLowerCase().trim()));
                        entry.setAttribute('userId', info[i].value._id);
                        entry.setAttribute('userName', info[i].value.name);
                        entry.setAttribute('userA', info[i].value.admin);
                        entry.setAttribute('userD', info[i].value.designer);
                        entry.setAttribute('userP', info[i].value.player);
                        entry.setAttribute('approvedUser', true);
                        entry.setAttribute('onClick','makeUserActive(this)');
                        entry.setAttribute('style','text-align:center;');
                        list.appendChild(entry);
                    } 
                    $.get("/userrequests", {}, function(info) {
                    var list = document.getElementById('userList');
                    for(var i = 0; i < info.length; ++i)
                    {
                        var name = info[i].value.name;
                        var entry = document.createElement('li');
                        entry.appendChild(document.createTextNode(name + "<--request"));
                        if(info[i].value._id == list)
                        {
                            entry.setAttribute('class','list-group-item active');
                        }
                        else
                        {
                            entry.setAttribute('class','list-group-item');
                        }
                        entry.setAttribute('userId', info[i].value._id);
                        entry.setAttribute('approvedUser', "false");
                        entry.setAttribute('onClick','makeUserActive(this)');
                        entry.setAttribute('style','text-align:center;');
                        list.appendChild(entry);
                    }        
                });       
            });
        }
        else
        {
            setMe();
            $('#adminSidePanel').hide();
        }

    });
    });
}

 function bindBackToMain()
 {
    $('#userInfo-text').click(function()
    {
        loadMainPage();    
        return false;  
    });
    return false;
 }

 function makeUserActive(tableItem)
{
    var tableElements = document.getElementsByClassName('list-group-item active');
    for (var i = 0; i < tableElements.length; ++i)
    {
        tableElements[i].className = "list-group-item";
    }
    tableItem.className = "list-group-item active";
    selectedUser = tableItem.getAttribute("userId");
    var nm = tableItem.getAttribute("userName");
    var ad = tableItem.getAttribute("userA");
    var des = tableItem.getAttribute("userD");
    var pl = tableItem.getAttribute("userP");
    var apr = tableItem.getAttribute("approvedUser");
    setUserUI(selectedUser, nm, ad, des, pl);
    var avatar = get_gravatar_image_url(selectedUser,175);
    $('#gravatar').attr('src',avatar);
    $('#gravatar').attr('title','No image? create a gravatar ');

    if(apr == "true")
    {
        setOther();
    }
    else
    {
        setRequest();
    }
    //console.log(selectedUser + " " + currentUser);
    if(selectedUser == currentUser)
    {
        setMe();
    }
}
function approveUser()
{
    $.post("/approve", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElements[i].getAttribute("userId") == selectedUser)
           {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElements[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo(); 
    });
}
function denyUser()
{
    $.post("/deny", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElements[i].getAttribute("userId") == selectedUser)
            {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElements[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo();
    });

}
function deleteUser()
{
    $.post("/deleteuser", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElemnents[i].getAttribute("userId") == selectedUser)
            {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElement[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo();
    });

}
function setUserUI(id, name, admin, designer, player)
{
    $('#tdemail').val(id);
    $('#tdemail2').val(id);
    $('#inname').val(name);
    //console.log("Admin: ", admin);
    if(admin == "true")
    {
        //console.log("Admin true");
        $('#cha').prop("checked", true);
    }
    else
    {
        //console.log("Admin false");
        $('#cha').prop("checked", false);
    }
    if(designer == "true")
    {
        //console.log("Des true");
        $('#chd').prop("checked", true);
    }
    else
    {
        //console.log("Des false");
        $('#chd').prop("checked", false);
    }
    if(player == "true")
    {
        //console.log("Play true");
        $('#chp').prop("checked", true);
    }
    else
    {
        //console.log("Play false");
        $('#chp').prop("checked", false);
    }
}
function edituser()
{
    console.log("editing user");
    var n = document.getElementById('inname').value;
    var p1 = document.getElementById('inpass').value
    var p2 = document.getElementById('inpass2').value;
    if(p1 != p2 || (p1.length < 5 && p1.length > 0))
    {
         // document.getElementById('inpass').attr('class = btn-danger');
         // document.getElementById('inpass2').attr('class = btn-danger');
         $('#inpass').attr('class','form-control btn-danger');
         $('#inpass2').attr('class','form-control btn-danger');

        console.log("Error: invalid password...");
    }
    else if(p1.length >= 5)
    {
        $.post("/editpassword", {password:p1}, function(res)
        {
            $('#inpass').attr('class','form-control btn-success');
         $('#inpass2').attr('class','form-control btn-success');

            console.log("EditPass: ", res);
            return false;
        });
    }
    if(n.length > 0 )
    {
        $.post("/editname", {name:n}, function(res)
        {
            console.log("EditName: ", res);
            var user = $('#'+ md5(selectedUser.toLowerCase().trim()));
            user.attr('username',n);
            user.text(n);
            return false;
        });
    }
    return false;
}

function upgradeuser()
{
    var a = document.getElementById('cha').checked;
    var d = document.getElementById('chd').checked;
    var p = document.getElementById('chp').checked;
    if(a == true)
    {
        d = true;
        p = true;
    }
    $.post("/upgrade", {id:selectedUser, admin: a, player: p, designer: d}, function(res)
    {
        //console.log("upgrade: ", res);
    });
}



function get_gravatar_image_url (email, size, default_image, allowed_rating, force_default)
{
    email = typeof email !== 'undefined' ? email : 'john.doe@example.com';
    size = (size >= 1 && size <= 2048) ? size : 80;
    default_image = typeof default_image !== 'undefined' ? default_image : 'mm';
    allowed_rating = typeof allowed_rating !== 'undefined' ? allowed_rating : 'x';
    force_default = force_default === true ? 'y' : 'n';
    
    return ("https://secure.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?size=" + size + "&default=" + encodeURIComponent(default_image) + "&rating=" + allowed_rating + (force_default === 'y' ? "&forcedefault=" + force_default : ''));
}