var mongoose = require('mongoose');

var consumptionModel = function() {
	var consumptionSchema = mongoose.Schema ({
		
		user: {
			type: String,
			unique: true
		},

		dateOfReg: {
			type: Number,
		},

		userData: [{
			capacity: {
				type: Number
			},
			systemTimestamp: {
				type: Number
			},
			arduinoTimestamp: {
				type: Number
			},
			deviceId: {
				type: String
			}
		}]
	});

	return mongoose.model('consumption', consumptionSchema);
};

module.exports = new consumptionModel();