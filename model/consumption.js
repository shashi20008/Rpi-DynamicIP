var mongoose = require('mongoose');

var consumptionModel = function() {
	var consumptionSchema = mongoose.Schema ({
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
	});

	return mongoose.model('consumption', consumptionSchema);
};

module.exports = new consumptionModel();