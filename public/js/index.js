// Main JavaScript file for Post-It

/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';

}

$(function () {
    var socket = io();

    console.log("Hello!");
    socket.emit('test message',function (data) {
        console.log(data);
    });

    $('form').submit(function () {
       if(($('#noteForm1').val().trim()) && ($('#noteForm2').val().trim())){
           console.log("yas");
           socket.emit('note',{note:$('#noteForm2').val(), title:$('#noteForm1').val()});
           document.getElementById('note').style.visibility = 'hidden';

       }
       return false;
    });

});