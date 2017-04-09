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
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
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

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			picture: picture
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
		});

		req.flash('success_msg', 'You are registered and can now login');


		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {

	  console.log(req.body);
      user = req.body.username;
      url = req.user.picture;
	  res.redirect('/');

  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.post('/addNote', function(req, res){
	var title = req.body.noteInput1;
	var note = req.body.noteInput2;
    req.checkBody('noteInput1', 'Title is required to make a note').notEmpty();
    req.checkBody('noteInput2', 'Text is required to make a note').notEmpty();


    var newNote = Note({
		username: req.user.username,
		note: req.body.noteInput2,
		title:req.body.noteInput1
	});
    Note.createNote(newNote);

    // req.flash('success_msg', 'New note created'); Messes with layout :/

    res.redirect('/');

});
var io = null;

var setIo = function (data){
	io = data;
    io.on('connection', function (socket) {
    	console.log('client connect');
    	var userObject = {user:user,picture:url};
    	//console.log(userObject);
        users.push(userObject);
        updateUsernames();


        /******************         Switch to this later        ******************************
        notesIndb = [];

        // Send new user all notes in the database
        Note.find(function (err, note) {
            if (err) return console.error(err);
            console.log(note);
            notesIndb.push(note);
        });

		console.log(notesIndb); */


        socket.emit('allNotes', notes);

        socket.on('disconnect', function(data){
			users.splice(users.indexOf(userObject));
			updateUsernames();
        });




        socket.emit('username',user);
        //console.log(user);

        socket.on('note',function(data){

            var newNote = Note({
                username: data.username,
                note: data.note,
                title: data.title
            });
            //console.log(newNote);

            Note.createNote(newNote);
			notes.push(newNote);

            console.log("-----------------------------------------");
            console.log(notes);
            io.emit('oneNote', newNote);



            console.log("-----------------------------------------");
		});

    });
};

function updateUsernames(){
	io.emit('get users', users);
	return;
}






module.exports.setIo = setIo;
module.exports.router = router;