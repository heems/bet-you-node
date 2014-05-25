var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/new', function(req, res) {
	var user = new User();
	console.log(req.body.username);
	user.username = req.body.username;
	user.password = req.body.password;
	User.findOne({ username: user.username }, function(err, presentUser){
		if(err) throw err;

		if(presentUser){
			req.flash('signupMessage', 'Username taken.');
			return res.redirect('/signup');
		} 

		user.save(function(err){
			if(err){
				console.log(err);
				var errors = [];
				for (var error in err.errors){
					errors.push(err.errors[error].message.substring(5));
				}
				req.flash('signupMessage', errors);
				return res.redirect('/signup');
			}
			req.session.user_id = user.id;
			res.redirect('/');
		});
	});
});

router.post('/login', function(req, res) {
	name = req.body.username;
	pass = req.body.password;

	User.findOne({ username: name }, function(err, user){
		if(err) throw err;

		if(!user){
			req.flash('loginMessage', 'User does not exist.');
			res.redirect('/login');
			return;
		} 

		user.comparePassword(pass, function(err, isMatch){
			if(err) throw err;
			if(isMatch){
				req.session.user_id = user.id;
				res.redirect('/profile');
				console.log('swag' + req.session.user_id);
			} else {
				//res.json({ message: 'Password invalid.'});
				req.flash('loginMessage', 'Password invalid.');
				res.redirect('/login');
			}
		});
	});
});

module.exports = router;
