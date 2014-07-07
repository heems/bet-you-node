var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BetSchema = new Schema({
	name: {type: String, required: true, index: {unique: true}},
	description: {type: String, required: true},
	created_by: {type: String, requried: true},
	responses: [] //this should be an array of objects with response name, url, and user
});


module.exports = mongoose.model('Bet', BetSchema);
