/**
 * Created by wahaj on 2017-04-01.
 */
var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    username: String,
    title: String,
    note: String
});

var Note = module.exports = mongoose.model('Note', NoteSchema);

module.exports.createNote = function(newNote){
    console.log("Before Save",newNote);
    newNote.save( function() { console.log("savecb:", arguments)});
    console.log("After Save",newNote);

};