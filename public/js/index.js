// Main JavaScript file for Post-It

var colour = "orange";
var addColour = "orange";
var socket;

var x;
var y;
var offset = 0;
var offset_y = 0;
/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */

function changeNoteColor(color,id) {
        $('#editNote').css("background-color", color);
        colour = color;
    //socket.emit('changeNoteColor', {notecolor:color, noteid:id});


}
function changeAddNoteColor(color,id){
    $('#note').css("background-color", color);
    addColour = color;
}
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';
    let colorString = '<div id = "colorNoteCon">' +
        '<span class = "colorNote" id = "colorNoteBlue" onclick="changeAddNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + false + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteYellow" onclick="changeAddNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + false + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNotePink" onclick="changeAddNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + false + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteGreen" onclick="changeAddNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + false + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteOrange" onclick="changeAddNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + false + "\'" + ')"></span>' +
        '</div>';
    $('#note').append(colorString);
}



function deleteNote(id){
    socket.emit('deleteNote', id);
}

function editNote(obj){

    if(document.getElementById("editNote").style.visibility === "visible")
        return;
    deleteNote(obj.id);

    //Make public variable the same as the note
    colour = obj.color;


    let editNote = document.getElementById('editNote');
    editNote.style.visibility = 'visible';
    editNote.style.backgroundColor = obj.color;

    $(editNoteForm1).val(obj.title);
    $(editNoteForm2).val(obj.note);

    let colorString = '<div id = "colorNoteCon">' +
        '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + true + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + true + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + true + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + true + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + true + "\'" + ')"></span>' +
        '</div>';
    $('#editNote').append(colorString);
    x = obj.x;
    y = obj.y;
}




var username = null;
var userPic = null;



$(function () {
    socket = io();



    //$( "#note" ).draggable();


    socket.on('username',function(data){
        username = data.user;
        userPic = data.url;
    });



    // Submit add note form
    $('#noteForm').submit(function () {
        let note1 = $('#noteForm1');
        let note2 = $('textarea#noteForm2');
       if((note1.val().trim()) && (note2.val().trim())){
           socket.emit('note',{note:note2.val(), title:note1.val(),username:username, colour:addColour, url: userPic, x: offset+"px", y: offset_y+"px"});
           note1.val(' ');
           note2.val(' ');
           document.getElementById('note').style.visibility = 'hidden';
           document.getElementById('note').style.backgroundColor = "orange";
           addColour = "orange";

       }
       return false;
    });

    // Submit edit note form
    $('#editNoteForm').submit(function () {
        let note1 = $('#editNoteForm1');
        let note2 = $('textarea#editNoteForm2');
        if((note1.val().trim()) && (note2.val().trim())){
            socket.emit('editNote',{note:note2.val(), title:note1.val(),username:username,color:colour,x:x,y:y, url: userPic});
            note1.val(' ');
            note2.val(' ');
            document.getElementById('editNote').style.visibility = 'hidden';
            colour = "orange";
        }
        return false;
    });





    socket.on('oneNote', function(data){
        var board = $('#board');
        let obj = {};
        // need to add coordinates here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // and need to update note (x,y) in db on mouse up after mouse down

        // We also need to add color here after
        var string =  '<div class = "sticky-note '+ data._id +'" id = "sticky-noteid" draggable="true" style = "background: '  +   data.color   + '; left: ' + data.x + '; top: ' + data.y + ';">' +
                        '<ul class = "note-content-list">' +
                             '<li id = "title">' + data.title + '</li>' +
                             '<li id = "note-content">' + data.note + '</li>' +
                        '</ul>' +

                        '<img class = "deleteNote ' + username+'" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data._id   +  "\'" + ')" >' +
                        '<img class = "editNotePic ' + username+'"  id =  ' + data._id + '  src = "../images/pencil.png" onclick="editNote(' + obj + ')" >' +
                        //'<p class = "noteUsername">'+ data[i].username + '</p>'+

                        '<img class = "noteUsername" src ='+ data.userPic + '>' +

                    '</div>';

        //Adjusgting the offset
        console.log(board.width(), "offser: ", offset);
        if(board.width() < (offset+160)){
            offset = 0;
            offset_y += 170

        }
        else{
            offset   += 160;
        }




        $(string).insertAfter('#insert');
        var sticky = $( "#sticky-noteid");
        sticky.css("background", data.color);
        sticky.draggable({ containment: "parent" });
        //sticky.draggable({ containment: "parent" }).resizable();
        sticky.attr('tabindex', -1);

        if(username === data.username){
            document.getElementsByClassName(username)[0].style.visibility = "visible";
            document.getElementsByClassName(username)[1].style.visibility = "visible";
        }


        var id = data._id;
       // console.log(document.getElementsByClassName(""+data._id)[0]);
        var thisNote = document.getElementsByClassName(""+data._id)[0];
        thisNote.addEventListener("mouseup", function(){
            socket.emit('sendPos', {id:data._id, left: thisNote.style.left, top: thisNote.style.top } );
        });

        obj = {id: data._id, title: data.title, note: data.note, color: data.color, username: data.username, x: thisNote.style.left, y:thisNote.style.top};

        // Onclick function to edit button
        $('#' + data._id).click(function(){
            editNote(obj);
        });
    });







    socket.on('allNotes', function(data) {
        console.log(data)
        var board = $('board');
        $('#post-it').empty();
        $('#post-it').html('<p id = "insert"></p>');


        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note ' + data[i]._id +'" id = "sticky-noteid" draggable="true" style = "background: '  +   data[i].color   + '; left: ' + data[i].x + '; top: ' + data[i].y + ';">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                    '<img class = "deleteNote ' + username+'" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data[i]._id   +  "\'" + ')" >' +
                    '<img class = "editNotePic ' + username+'" id =  ' + data[i]._id + ' src = "../images/pencil.png"  >' +
                    '<img class = "noteUsername" src ='+ data[i].userPic + '>' +

                '</div>';

            $(string).insertAfter('#insert');
            let sticky = $( "#sticky-noteid");
            sticky.draggable({ containment: "parent" });
            //sticky.draggable({ containment: "parent" }).resizable();
            sticky.attr('tabindex', -1);

            if(username === data[i].username){
                document.getElementsByClassName(username)[0].style.visibility = "visible";
                document.getElementsByClassName(username)[1].style.visibility = "visible";
            }


            let indexNote = data[i];
            //console.log(data[i]);

            //console.log(document.getElementsByClassName(""+data[i]._id)[0]);
            let thisNote = document.getElementsByClassName(""+data[i]._id)[0];
            thisNote.addEventListener("mouseup", function(){
                socket.emit('sendPos', {id:indexNote._id, left: thisNote.style.left, top: thisNote.style.top } );
                // setTimeout( (function(t){
                //     console.log("later", t.style.left, t.style.top);
                // }).bind(null, thisNote), 1000)
            });
            let obj = {id: data[i]._id, title: data[i].title, note: data[i].note, color: data[i].color, username: data[i].username, x:thisNote.style.left, y:thisNote.style.top};

            $('#' + data[i]._id).click(function(){
                editNote(obj);
            });


        }
    });







    socket.on('get users',function(data){
        console.log("getusers:", JSON.stringify( data));
       var string = "";
       for(var i = 0; i < data.length; i++){
          
           if (!(data[i].user === null) && (data[i].user !== username)){
             string += "<ul class = 'otherUsers'><li><img class = 'profilePic' src=" + data[i].picture + "  /></li><li class = 'yourName'>" + data[i].user + "</li></ul>";
           }
        $('#notYou').html(string);
       }

    });
});



