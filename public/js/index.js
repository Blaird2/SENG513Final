// Main JavaScript file for Post-It

var colour = "orange";
var socket;

var x;
var y;
/**
 * Called when a user clicks the "+" button,
 * brings up the new note creation.
 */
function addNote(){
    // Make note template visible
    document.getElementById('note').style.visibility = 'visible';
}

function changeNoteColor(color, id) {
    //socket.emit('changeNoteColor', {notecolor:color, noteid:id});
    $('#editNote').css("background-color", color);
    colour = color;

}


function deleteNote(id){
    socket.emit('deleteNote', id);
}

function editNote(obj){

    deleteNote(obj.id);
    console.log(obj.id);


    let editNote = document.getElementById('editNote');
    editNote.style.visibility = 'visible';
    editNote.style.backgroundColor = obj.color;

    $(editNoteForm1).val(obj.title);
    $(editNoteForm2).val(obj.note);

    let colorString = '<div id = "colorNoteCon">' +
        '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + obj.id + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + obj.id + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + obj.id + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + obj.id + "\'" + ')"></span>' +
        '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + obj.id + "\'" + ')"></span>' +
        '</div>';
    $('#editNote').append(colorString);
    x = obj.x;
    y = obj.y;
}




var username = null;



$(function () {
    socket = io();



    //$( "#note" ).draggable();


    socket.on('username',function(data){
        username = data;
    });


/*
    $('textarea#noteForm2').keydown(function(e){
      if ((e.keyCode == 13 && e.shiftKey) && ((note1.val().trim()) && (note2.val().trim())))
      {
        $('form').submit(function () {
       
             socket.emit('note',{note:note2.val(), title:note1.val(),username:username});
             note1.val('');
             note2.val('');
             document.getElementById('note').style.visibility = 'hidden';
          return false;
        });
      }

      else if ((e.keyCode === 13) && ((note1.val().trim()) && (note2.val().trim())))
      {
        //e.preventDefault();
        $('form').submit(function () {
          socket.emit('note',{note:note2.val(), title:note1.val(),username:username});
          note1.val('');
          note2.val('');
          document.getElementById('note').style.visibility = 'hidden';
          return false;
        });
      }
    });
*/




    // Submit add note form
    $('#noteForm').submit(function () {
        let note1 = $('#noteForm1');
        let note2 = $('textarea#noteForm2');

       if((note1.val().trim()) && (note2.val().trim())){
           socket.emit('note',{note:note2.val(), title:note1.val(),username:username});
           note1.val('');
           note2.val('');
           document.getElementById('note').style.visibility = 'hidden';

       }
       return false;
    });

    // Submit edit note form
    $('#editNoteForm').submit(function () {
        let note1 = $('#editNoteForm1');
        let note2 = $('textarea#editNoteForm2');
        if((note1.val().trim()) && (note2.val().trim())){
            socket.emit('editNote',{note:note2.val(), title:note1.val(),username:username,color:colour,x:x,y:y});
            note1.val(' ');
            note2.val(' ');
            document.getElementById('editNote').style.visibility = 'hidden';

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

                        '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data._id   +  "\'" + ')" >' +

                        '<div id = "colorNoteCon">' +
                          '<span class = "colorNote" id = "colorNoteBlue" onclick="changeNoteColor('   + " \'" + '#0ff' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +                                    
                          '<span class = "colorNote" id = "colorNoteYellow" onclick="changeNoteColor(' + " \'" + '#ff0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNotePink" onclick="changeNoteColor('   + " \'" + '#f0f' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteGreen" onclick="changeNoteColor('  + " \'" + '#0f0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                          '<span class = "colorNote" id = "colorNoteOrange" onclick="changeNoteColor(' + " \'" + '#fa0' + " \'" + ', ' + " \'" + data._id + "\'" + ')"></span>' +
                        '</div>' +

                        '<img class = "editNotePic"  id =  ' + data._id + '  src = "../images/pencil.png" onclick="editNote(' + obj + ')" >' +
                       // '<img class = "editNote" src = "../images/1314141350604165759pencil_in_black_and_white_0515-1007-2718-0953_smu-md.png" onclick = "editNote()">' +

                    '</div>';

       // });
        $(string).insertAfter('#insert');
        var sticky = $( "#sticky-noteid");
        sticky.css("background", data.color);

        sticky.draggable({ containment: "parent" });

        sticky.attr('tabindex', -1);



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
        var board = $('board');
        $('#post-it').empty();
        $('#post-it').html('<p id = "insert"></p>');
        //console.log(data);


        for (var i = 0; i < data.length; i++) {
            var string = '<div class = "sticky-note ui-widget-content ' + data[i]._id +'" id = "sticky-noteid" draggable="true" resizable="true" style = "background: '  +   data[i].color   + '; left: ' + data[i].x + '; top: ' + data[i].y + ';">' +
                '<ul class = "note-content-list">' +
                '<li id = "title">' + data[i].title + '</li>' +
                '<li id = "note-content">' + data[i].note + '</li>' +
                '</ul>' +
                    '<img class = "deleteNote" src = "../images/trash.svg" onclick="deleteNote(' + " \'" +   data[i]._id   +  "\'" + ')" >' +
                    '<img class = "editNotePic" id =  ' + data[i]._id + ' src = "../images/pencil.png"  >' +

                '</div>';

            $(string).insertAfter('#insert');
            var sticky = $( "#sticky-noteid");

            sticky.draggable({ containment: "parent" });

            sticky.attr('tabindex', -1);


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
       var string = "";
       for(var i = 0; i < data.length; i++){
          
           if (!(data[i].user === null) && (data[i].user !== username)){
             string += "<ul class = 'otherUsers'><li><img class = 'profilePic' src=" + data[i].picture + "  /></li><li class = 'yourName'>" + data[i].user + "</li></ul>";
           }
        $('#notYou').html(string);
       }

    });
});



