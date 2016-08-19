var mongoose = require('mongoose');

var UserModel = function() {
	var UserSchema = mongoose.Schema ({
		name: {
			type: String
		},
		password: {
			type:String
		},
		email: {
			type:String,
			unique: true
		},
		currentIp: {
			type: String
		},
		IPs:[String],
		dateOfReg: {
			type: Number,
		}
	});

	return mongoose.model('user', UserSchema);
};

module.exports = new UserModel();