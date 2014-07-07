var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
	link: {type: String, required: true},
	submitted_by: {type: String, required: true},
	upvotes: {type: Number, default: 0},
	bet: {type: String, required: true}
});

module.exports = mongoose.model('Response', ResponseSchema);

