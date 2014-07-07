var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
	link: {type: String, required: true},
	submitted_by: {type: String, required: true},
	upvotes: {type: Number, default: 0},
	bet: {type: String, required: true}
});

ResponseSchema.pre('save', function(next) {
	if (this.link.indexOf("http") == -1){
		this.link = 'http://' + this.link;
	}
});

module.exports = mongoose.model('Response', ResponseSchema);

