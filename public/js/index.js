// Main JavaScript file for Post-It


var socket;

/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';
}

function changeNoteColor(color, id) {
    socket.emit('changeNoteColor', {notecolor:color, noteid:id});

}

function deleteNote(id){
    socket.emit('deleteNote', id);
}

var username = null;



$(function () {
    socket = io();

    var note1 = $('#noteForm1');
    var note2 = $('textarea#noteForm2');

    //$( "#note" ).draggable();


    socket.on('username',function(data){
        username = data;
    });




    $('form').submit(function () {
       if((note1.val().trim()) && (note2.val().trim())){
           socket.emit('note',{note:note2.val(), title:note1.val(),username:username});
           note1.val(' ');
           note2.val(' ');
           document.getElementById('note').style.visibility = 'hidden';

       }
       return false;
    });




    socket.on('oneNote', function(data){
        var board = $('#board');


        // need to add coordinates here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // and need to update note (x,y) in db on mouse up after mouse down

        // We also need to add color here after
        var string =  '<div class = "sticky-note '+ data._id +'" id = "sticky-noteid" draggable="true" style = "background: '  +   data.color   + '; left: ' + data.x + '; top: ' + data.y + ';">' +
                        '<ul class = "note-content-list">' +
                             '<li id = "title">' + data.title + '</li>' +
                             '<li id = "note-content">' + data.note + '</li>' +
                        '</ul>' +

                        '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data._id   +  "\'" + ')" >' +
                       // '<img class = "editNote" src = "../images/1314141350604165759pencil_in_black_and_white_0515-1007-2718-0953_smu-md.png" onclick = "editNote()">' +
                        '<div id = "colorNoteCon">' +
                          '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +                                    
                          '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                        '</div>' +
                    '</div>';

       // });
        $(string).insertAfter('#insert');
        var sticky = $( "#sticky-noteid");
        sticky.css("background", data.color);
        sticky.draggable();
        sticky.attr('tabindex', -1);





        var id = data._id;
       // console.log(document.getElementsByClassName(""+data._id)[0]);
        var thisNote = document.getElementsByClassName(""+data._id)[0];
        thisNote.addEventListener("mouseup", function(){
            console.log('hello');
            socket.emit('sendPos', {id:data._id, left: thisNote.style.left, top: thisNote.style.top } );
        });
    });







    socket.on('allNotes', function(data) {
        var board = $('board');
        $('#post-it').empty();
        $('#post-it').html('<p id = "insert"></p>');
        //console.log(data);


        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note ' + data[i]._id +'" id = "sticky-noteid" draggable="true" style = "background: '  +   data[i].color   + '; left: ' + data[i].x + '; top: ' + data[i].y + ';">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                    '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data[i]._id   +  "\'" + ')" >' +
                        '<div id = "colorNoteCon">' + 
                          '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + data[i]._id + "\'" + ')"></span>' +                                    
                          '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + data[i]._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + data[i]._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + data[i]._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + data[i]._id + "\'" + ')"></span>' +
                        '</div>' +
                '</div>';

            $(string).insertAfter('#insert');
            var sticky = $( "#sticky-noteid");
            sticky.draggable();
            sticky.attr('tabindex', -1);




            let indexNote = data[i];
            //console.log(data[i]);

            //console.log(document.getElementsByClassName(""+data[i]._id)[0]);
            let thisNote = document.getElementsByClassName(""+data[i]._id)[0];
            thisNote.addEventListener("mouseup", function(){
                console.log(thisNote, thisNote.style.left,thisNote.style.top);
                socket.emit('sendPos', {id:indexNote._id, left: thisNote.style.left, top: thisNote.style.top } );
                // setTimeout( (function(t){
                //     console.log("later", t.style.left, t.style.top);
                // }).bind(null, thisNote), 1000)
            });
        }
    });







    socket.on('get users',function(data){
       var string = "";
       for(var i = 0; i < data.length; i++){
          
           if (!(data[i].user === null) && (data[i].user !== username)){
             string += "<ul class = 'otherUsers'><li><img class = 'profilePic' src=" + data[i].picture + "  /></li><li class = 'yourName'>" + data[i].user + "</li></ul>";
           }
        $('#notYou').html(string);
       }

    });
});



