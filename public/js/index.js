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

    $( "#note" ).draggable();


    socket.on('username',function(data){
        username = data;
    });




    $('form').submit(function () {
       if((note1.val().trim()) && (note2.val().trim())){
           console.log("yas");
           socket.emit('note',{note:note2.val(), title:note1.val(),username:username});
           note1.val(' ');
           note2.val(' ');
           document.getElementById('note').style.visibility = 'hidden';

       }
       return false;
    });




    socket.on('oneNote', function(data){
        var board = $('board');


        // need to add coordinates here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // and need to update note (x,y) in db on mouse up after mouse down

        // We also need to add color here after
        var string =  '<div class = "sticky-note" id = "sticky-noteid" style = "background: '  +   data.color   + '">' +
                        '<ul class = "note-content-list">' +
                             '<li id = "title">' + data.title + '</li>' +
                             '<li id = "note-content">' + data.note + '</li>' +
                        '</ul>' +

                        '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data._id   +  "\'" + ')" >' +
                        '<div id = "colorNoteCon">' + 
                          '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +                                    
                          '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                        '</div>' +
                    '</div>';

        $(string).insertAfter('#insert');
        var sticky = $( "#sticky-noteid");
        sticky.css("background", data.color);
        sticky.draggable();
        sticky.attr('tabindex', -1);
    });







    socket.on('allNotes', function(data) {
        var board = $('board');
        $('#post-it').empty();
        $('#post-it').html('<p id = "insert"></p>');
        console.log(data);


        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note" id = "sticky-noteid" style = "background: '  +   data[i].color   + '">' +
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



