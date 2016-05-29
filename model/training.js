var mongoose = require('mongoose');

var trainingModel = function() {
	var trainingSchema = mongoose.Schema ({
		
		user: {
				type: String,
				unique: true
		},
			
		deviceData: [{
			deviceName: {
				type: String
			},
			deviceType: {
				type: String
			},
			trainingData : [{
				startDate: {
					type: Number
				},
				endDate: {
					type: Number
				}
			}]
		}]

	});

	return mongoose.model('training', trainingSchema);
};

module.exports = new trainingModel();