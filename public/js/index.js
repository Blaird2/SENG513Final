// Main JavaScript file for Post-It

/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';

}

function create(htmlStr) {
    var frag = document.createDocumentFragment(), temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}


var username = null;
$(function () {
    var socket = io();


    socket.on('username',function(data){
        username = data;
    });

    var note1 = $('#noteForm1');
    var note2 = $('#noteForm2');
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


        var string =  '<div class = "sticky-note">' +
                        '<ul class = "note-content-list">' +
                             '<li id = "title">' + data.title + '</li>' +
                            '<li id = "note-content">' + data.note + '</li>' +
                        '</ul>' +
                    '</div>';
        $(string).insertAfter('#insert');

        // Print out the new note
        //var fragment = create('<div>Hello!</div>');
        //board.insertBefore(fragment, board.childNodes[0]);

    });


    socket.on('allNotes', function(data) {
        var board = $('board');

        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                '</div>';
            $(string).insertAfter('#insert');
        }
    });


    socket.on('get users',function(data){
       var html = "";
       for(var i = 0; i < data.length; i++){
           html+=data[i].user+ "<img src = "+ data[i].picture + "/>";
           $('#users').html(html);
       }
    });


});