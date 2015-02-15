var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
	link: {type: String, required: true},
	submitted_by: {type: String, required: true},
	upvotes: {type: Number, default: 0},
	bet: {type: String, required: true}
});

ResponseSchema.pre('save', function(next) {
	/*var ytregex = new RegExp("watch?v=(\d+)");
	var match = ytregex.exec(this.link);
	console.log(match);
*/	this.link = this.link.substring(33);
	console.log(this.link);

	return next();
});

module.exports = mongoose.model('Response', ResponseSchema);

