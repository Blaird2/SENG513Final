/**
 * Created by wahaj on 2017-04-01.
 */
var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    username: String,
    note: String
});

var Note = module.exports = mongoose.model('Note', NoteSchema);

module.exports.createNote = function(newNote){
    newNote.save();
};