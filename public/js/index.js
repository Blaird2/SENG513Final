// Main JavaScript file for Post-It

/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';

}


function deleteNote(data) {
    console.log(data);
}



var username = null;

$(function () {

    $( "#note" ).draggable();

    var socket = io();
    var note1 = $('#noteForm1');
    var note2 = $('#noteForm2');


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
                    '</div>';
        $(string).insertAfter('#insert');

        $( "#sticky-noteid" ).draggable();

        // Print out the new note
        //var fragment = create('<div>Hello!</div>');
        //board.insertBefore(fragment, board.childNodes[0]);

    });







    socket.on('allNotes', function(data) {
        var board = $('board');

        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note" id = "sticky-noteid">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                    '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data[i].id   +  "\'" + ')" >' +
                '</div>';
            $(string).insertAfter('#insert');
            $( "#sticky-noteid" ).draggable();
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