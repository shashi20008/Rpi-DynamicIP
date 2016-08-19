var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var UserModel = require('../model/user');

/**
  * Passport setup. Move to lib
  */

passport.use(new LocalStrategy(function(username, password, done){
	console.log('came to strategy');
	UserModel.findOne({email:username}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			return done(null, false);
		}
		console.log('going to compare');
		bcrypt.compare(password, user.password, function(err, matches) {
			done(err, (matches ? user : false));
		});
	});
}));

passport.serializeUser(function(user, done) {
	console.log('serializing..', user);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log('deserializing..', user);
  done(null, user);
});

/* Add role based authorization */
var authorize = function (options) {
	options.failureRedirect = options.failureRedirect || '/login';

	return function(req, res, next) {
		if(req.isAuthenticated && typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
			return next();
		}
		return res.redirect(options.failureRedirect)
	};
};

/** 
  * Controllers
  */
var dynamicDNSController = require('../controllers/dyn-dns/dyn-dns'),
	homeScreenController = require('../controllers/home-screen/home-screen'),
	loginController = require('../controllers/login-flow/login-flow'),
	registrationController = require('../controllers/reg-flow/reg-flow');


router.get('/', authorize({failureRedirect: '/login' }), homeScreenController.process);
router.get('/login', loginController.render);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/register', registrationController.render);
router.post('/register', registrationController.process);
router.get('/home', authorize({failureRedirect: '/login' }), homeScreenController.process);
router.post('/home', authorize({failureRedirect: '/login' }), homeScreenController.update);
router.get('/dyn-dns', authorize({failureRedirect: '/login' }), dynamicDNSController.process);
router.post('/dyn-dns', passport.authenticate('local', {failureRedirect: '/login' }), dynamicDNSController.update);

router.get('/logout', authorize({failureRedirect: '/login' }), function(req, res) {
	req.logout();
	res.redirect('/login');
})

module.exports = router;