// Main JavaScript file for Post-It

/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
var socket = io();
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible'

}
socket.on('test message',function (data) {
    console.log(data);
})