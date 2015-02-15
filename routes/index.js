var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bet You Cant', user_id: req.session.user_id });
});

router.get('/signup', function(req, res) {
	res.render('signup', { title: 'Signup', message: req.flash('signupMessage')});
});

router.get('/login', function(req, res) {
	res.render('login', { title: 'Log in', message: req.flash('loginMessage')});
});

router.get('/profile', isLoggedIn, function(req, res) {
	res.send('cool u logged in');
	res.send(req.session.user_id);
});

router.get('/logout', function(req, res){
	delete req.session.user_id;
	res.redirect('/');
});

function isLoggedIn(req, res, next){
	if(!req.session.user_id) {
		req.flash('loginMessage', 'You have to be logged in to do that.');
		res.redirect('/login');
	} else {
		next();
	}
}

module.exports = router;
