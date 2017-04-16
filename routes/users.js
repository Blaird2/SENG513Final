var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');   //***********
var db = mongoose.connection;

var User = require('../models/user');
var Note = require('../models/note');
var user = null;

var url = null;
var users = [];
var notes = [];

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
    res.render('login');
});

// Register User
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var picture = req.body.picture;

    user = username;
    url = picture;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('picture', 'Picture is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            picture: picture
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
        });

        req.flash('success_msg', 'You are registered and can now login');


        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {

        console.log(req.body);
        user = req.body.username;
        url = req.user.picture;
        res.redirect('/');

    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});


var io = null;

var setIo = function (data) {
    io = data;
    io.on('connection', function (socket) {
        console.log("socket.id: ", socket.id);

        console.log('client connect');
        let userObject = {user: user, picture: url};

        //Let client know their username
        console.log('adding a user: ', userObject.user);

        users.push(userObject);
        socket.emit('username', {user: user, url: url});

        // attaching username to socket
        socket.userObj = {user: user, picture: url};

        //Displays all online users
        updateUsernames();

        // New connection
        updateNotes(socket, false);


        // Works with array
        socket.on('disconnect', function (data) {
            console.log('deleting ng a user: ', socket.userObj.user);


            console.log("This is disconnected user", socket.userObj.user);
            // idk users.splice(users.indexOf(socket.userObj));
            let index = -1;
            for (let i = 0; i < users.length; i++) {

                if (socket.userObj.user === users[i].user) {
                    index = i;
                    break;
                }
            }
            console.log(" this is index", index);
            if (index !== -1) {
                users.splice(index, 1);
            }

            updateUsernames();
        });

        socket.on('deleteNote', function (noteID) {
            Note.find({_id: noteID}).remove().exec();
            updateNotes(socket, true);
        });

        socket.on('sendPos', function (data) {
            //console.log("Event Listener Executed");

            Note.find({_id: data.id}, function (err, note) {
                if (err) return console.error(err);
                else {
                    console.log(note[0].x, note[0].y);
                    console.log(data.left, data.top);
                    if (note[0].x !== data.left || note[0].y !== data.top) {
                        console.log("the if is executed");
                        Note.update({_id: data.id}, {$set: {x: data.left, y: data.top}}, function () {
                            updateNotes(socket, true);
                        });
                    }

                }

            });
        });

        socket.on('changeNoteColor', function (data) {
            Note.update({_id: data.noteid}, {$set: {color: data.notecolor}}, function () {
                updateNotes(socket, true);
            });

            //Update all notes
            //updateNotes(socket, true);
        });

        socket.on('note', function (data) {
            console.log(data);


            var newNote = Note({
                username: data.username,
                userPic: data.url,
                note: data.note,
                title: data.title,
                x: data.x,
                y: data.y,
                color: data.colour
            });

            Note.createNote(newNote);
            notes.push(newNote);

            io.emit('oneNote', newNote);

        });

        socket.on('editNote', function (data) {
            console.log(data);
            var newNote = Note({
                username: data.username,
                userPic: data.url,
                note: data.note,
                title: data.title,
                x: data.x,
                y: data.y,
                color: data.color
            });

            Note.createNote(newNote);
            notes.push(newNote);

            io.emit('oneNote', newNote);
        });


    });

};


function updateUsernames() {
    console.log("users update:", users);

    io.emit('get users', users);
}

function getTime() {
    return new Date();
}


// If true, then it ignores socket and emits to everyone, otherwise specific user
function updateNotes(socket, updateEveryone) {
    // Send new user all notes in the database
    Note.find({}, function (err, note) {
        if (err) return console.error(err);
        //console.log(note);

        if (updateEveryone) {
            //console.log(note);
            io.emit('allNotes', note);
        }
        else {
            socket.emit('allNotes', note);

        }
    });
}


module.exports.setIo = setIo;
module.exports.router = router;