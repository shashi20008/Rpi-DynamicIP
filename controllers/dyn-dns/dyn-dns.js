var UserModel = require('../../model/user');

var DynamicDNSController = {
	process: function(req, res) {

	},
	update: function(req, res) {
		console.log('ip is ', req.body.ip);
		UserModel.update({email: req.body.username}, {$set: {currentIp: req.body.ip}}, function(err) {
			if(err) {
				return res.end('failure');
			}
			res.end('success');
		});
	}
};

module.exports = DynamicDNSController;