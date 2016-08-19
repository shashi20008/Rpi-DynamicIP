var errCodes = require('../common/error-code');

var setInitialModel = function(req, res, next) {
	req.model = {};
	if(req.query.hl) {
		req.model.hl = req.query.hl;
	}
	if(typeof next === 'function') {
		return next();
	}
}

var HomeScreenController = {
	process: function(req, res) {
		console.log('came to process');
		setInitialModel(req, res);
		res.render('home', req.model);
	},
	update: function(req, res) {
		if(!req.user) {
			return res.json(errCodes.redirectToLogin);
		}
		res.json({});
	}
};

module.exports = HomeScreenController;