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

function changeNoteColor(color) {
    console.log(color);
    $('.sticky-note').css("background", color);
}

function deleteNote(id){
    socket.emit('deleteNote', id);
}

var username = null;



$(function () {
    socket = io();

    var note1 = $('#noteForm1');
    var note2 = $('#noteForm2');

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
        var string =  '<div class = "sticky-note" id = "sticky-noteid" ' + ' ' + '>' +
                        '<ul class = "note-content-list">' +
                             '<li id = "title">' + data.title + '</li>' +
                             '<li id = "note-content">' + data.note + '</li>' +
                        '</ul>' +

                        '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data.id   +  "\'" + ')" >' +
                        '<div class = "colorNoteCon">' + 
                          '<div class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor(' + " \'" + '#0ff' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNotePink" onclick="changeNoteColor(' + " \'" + '#f0f' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor(' + " \'" + '#0f0' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ')"></div>' +
                        '</div>' +
                      '</div>';
                    '</div>';

        $(string).insertAfter('#insert');

        $( "#sticky-noteid" ).draggable();
        $( "#sticky-noteid" ).attr('tabindex',-1).focus();

        // Print out the new note
        //var fragment = ('<div>Hello!</div>');
        //board.insertBefore(fragment, board.childNodes[0]);

    });







    socket.on('allNotes', function(data) {
        var board = $('board');
        $('#post-it').empty();
        $('#post-it').html('<p id = "insert"></p>');
        console.log("jjjjjjjjjjjjjjjjj");


        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note" id = "sticky-noteid">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                    '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data[i].id   +  "\'" + ')" >' +
                        '<div class = "colorNoteCon">' + 
                          '<div class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor(' + " \'" + '#0ff' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNotePink" onclick="changeNoteColor(' + " \'" + '#f0f' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor(' + " \'" + '#0f0' + " \'" + ')"></div>' +
                          '<div class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ')"></div>' +
                        '</div>' +
                '</div>';



            $(string).insertAfter('#insert');
            $( "#sticky-noteid" ).draggable();
            $( "#sticky-noteid" ).attr('tabindex',-1).focus();

           // $( ".deleteNote" ).click(function(event){
                //console.log(data);
           //      socket.emit('deleteNote',data[i]._id);
            //});

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



