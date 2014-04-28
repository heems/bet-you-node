var express = require('express');
var router = express.Router();
var Bet = require('../models/bet');
var User = require('../models/user');
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res) {
	Bet.find({}, {}, function(e, docs){
		res.render('bets', {
			'bets' : docs
		});
	});
});

router.get('/new', function(req, res){
	res.render('newbet');
});


router.post('/new', function(req, res) {
	var bet = new Bet();
	bet.name = req.body.name;
	bet.description = req.body.des;
	User.findOne({ id: req.session.user_id }, function(err, user){
		if(err) throw err;
		if(!user){
			bet.created_by = 'anon';
			res.send('o god what the fuck');
		}
		bet.created_by = user.username;
	});
	bet.save(function(err){
		if(err) throw err;
		res.redirect('/bets/' + bet.id);
	});
});

router.get('/:id', function(req, res){
	var id = mongoose.Types.ObjectId(req.params.id);
	Bet.findOne({ _id: id }, function(err, bet){
		if(err) throw err;
		if(!bet){
			res.send('Bet could not be found');
			return;
		}
		console.log('bet request ' + bet.name);
		res.render('bet', {'bet' : bet}); //  problem here
	});
});



module.exports = router;
