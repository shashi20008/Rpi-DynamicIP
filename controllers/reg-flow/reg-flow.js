var bcrypt = require('bcrypt')
	UserModel = require('../../model/user');

var RegistrationController = {
	render: function(req, res) {
		res.render('register');
	},
	process: function(req, res) {
		var formData = {
				name : req.body.name,
				email : req.body.email,
				password : req.body.password
			};
		if(formData.password) {
			formData.password = bcrypt.hashSync(formData.password, 10);
		}
		var newUser = new UserModel(formData);
		newUser.save(function(err) {
			if(err) {
				console.log('an error occurred.. ', err);
				return res.render('register', formData);
			}
			res.redirect('/login');
		});
	}
};

module.exports = RegistrationController;