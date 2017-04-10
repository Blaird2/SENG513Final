/**
 * Created by wahaj on 2017-04-01.
 */
var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    username: String,
    title: String,
    note: String,
    x: String,
    y: String
});

var Note = module.exports = mongoose.model('Note', NoteSchema, 'notes');

module.exports.createNote = function(newNote){
    newNote.save();
};