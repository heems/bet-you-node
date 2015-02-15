var express = require('express');
var async = require('async')
var Bet = require('../models/bet');
var User = require('../models/user');
var Response = require('../models/response');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function(req, res) {
	Bet.find({}, {}, function(err, docs){
		res.render('bets', {
			'bets' : docs
		});
	});
});

router.get('/new', function(req, res){
	res.render('newbet', { message : req.flash('betMessage') });
});


router.post('/new', function(req, res) {
	var bet = new Bet();
	bet.name = req.body.name;
	bet.description = req.body.des;

	if (!req.session.user_id){
		req.flash('loginMessage', 'You have to be logged in to place a bet.');
		return res.redirect('/login');
	}

	User.findOne({ _id: req.session.user_id }, function(err, user){
		if(err) throw err;

		bet.created_by = user.username;
		bet.save(function(err){
			if(err){
				if(err.code == '11000'){
					req.flash('betMessage', 'That name is taken, sorry.');
					return res.redirect('/bets/new');
				}
				return res.send('Something went wrong :(.')
			}
			return res.redirect('/bets/' + bet.id);
		});
	});
});

//  Render bet page.
router.get('/:id', function(req, res){
	var id = mongoose.Types.ObjectId(req.params.id);
	//  Fetch responses and users that submitted them.
	async.waterfall([
		function(next) {
			Bet.findOne({ _id: id }, function(err, bet){
				if(err) throw err;
				
				if(!bet){
					res.send('Bet could not be found.');
					return;
				}

				next(null, bet);
			});
		},

		function(bet, next) {
			Response.find({bet: id}, function(err, responses){
				if (err) throw err;

				next(null, bet, responses);
			});
		},

		function(bet, responses, next) {
			var users = [];
			var getUsers = function(response, cb){
				User.findOne({_id: response.submitted_by}, function(err, user){
					if (err) return cb(err);

					users.push(user.username);
					cb(null);
				});
			}
			async.eachSeries(responses, getUsers, function(err){
				if (err) throw err;
				console.log(users);
				return res.render('bet', {'bet' : bet, 'path': '/bets/' + req.params.id + 
							'/respond', 'responses': responses, 'users': users});
			});
		}
	]);
});

//  Render form to submit response
router.get('/:id/respond', isLoggedIn, function(req, res){
	res.render('response.jade', {'path' : '/bets' + req.url});
});

//  Create new response
router.post('/:id/respond', isLoggedIn, function(req, res){
	Response.findOne({submitted_by:req.session.user_id, bet:req.params.id}, function(err, prev){
		if(err) throw err;

		if(prev) 
			return res.send('You have already responded to this bet');

		//  Create response and save
		var id = mongoose.Types.ObjectId(req.params.id);
		var response = new Response();
		response.link = req.body.url;
		response.submitted_by = req.session.user_id;
		response.upvotes = 0;
		response.bet = id;
		response.save(function(err){
			if (err) throw err;

			console.log('\n\nsaved\n\n');
		});

		res.redirect('/bets/' + req.params.id);
	});
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
