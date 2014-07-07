var express = require('express');
var router = express.Router();
var Bet = require('../models/bet');
var User = require('../models/user');
var Response = require('../models/response');
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
	res.render('newbet', { message : req.flash('betMessage') });
});


router.post('/new', function(req, res) {
	var bet = new Bet();
	bet.name = req.body.name;
	bet.description = req.body.des;
	if (!req.session.user_id){
		req.flash('loginMessage', 'You have to be logged in to place a bet');
		return res.redirect('/login');
	}
	console.log(req.session.user_id);
	User.findOne({ _id: req.session.user_id }, function(err, user){
		if(err) throw err;
		console.log(user);

		bet.created_by = user.username;
		bet.save(function(err){
			if(err){
				if(err.code == '11000'){
					req.flash('betMessage', 'That name is taken, sorry.');
					return res.redirect('/bets/new');
				}
			}
			res.redirect('/bets/' + bet.id);
		});
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
		console.log('bet request ' + bet);
		res.render('bet', {'bet' : bet, 'path': '/bets/' + req.params.id + '/respond'}); 
	});
});

router.get('/:id/respond', function(req, res){
	// redirect to a response submit page
	res.render('response.jade', {'path' : '/bets' + req.url});
});

router.post('/:id/respond', function(req, res){
	//  stuff below is copy and pasted from router.get(:/id'
	//  fill this with pushing a response info object to the bet's responses array
	console.log('reached post method');
	Response.findOne({submitted_by:req.session.user_id, bet:req.params.id}, function(err, response){
		if(err) throw err;
		if(response){
			console.log('found something');
			//req.flash('responseMessage', 'You have already responded to this bet.');
			return res.send('You have already responded to this bet');
		}
		var id = mongoose.Types.ObjectId(req.params.id);
		var response = new Response();
		response.link = req.body.url;
		response.submitted_by = req.session.user_id;
		response.upvotes = 0;
		response.bet = req.params.id;
		response.save(function(err){
			if (err) throw err;
		});
		User.findOne({_id:req.session.user_id}, function(err, user){
			if(err) throw err;
			if(!user) console.log('null user with id ' + req.session.user_id);
			console.log(user.username);
			var name = user.username;
			Bet.update({_id: id},{$push: {responses:{url:response.link, user:name}}},{upsert:true},function(err){
				if (err) throw err;
			});
	
		});
		res.redirect('/bets/' + req.params.id);
	});
});



module.exports = router;
