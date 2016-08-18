var errCodes = require('../common/error-code');

var setInitialModel = function(req, res, next) {
	req.model = {
		data: {}
	};
	if(typeof next === 'function') {
		return next();
	}
}

var HomeScreenController = {
	process: function(req, res) {
		if(!req.isLoggedin) {
			return res.redirect('/login');
		}
		setInitialModel(req, res);
		res.render('home');
	},
	update: function(req, res) {
		if(!req.isLoggedin) {
			return res.json(errCodes.redirectToLogin);
		}
		res.json({});
	}
};

module.exports = HomeScreenController;