var express = require('express');
var router = express.Router();
var brcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var UserModel = require('../model/user');

passport.use(new LocalStrategy(function(username, password, done){
	UserModel.findOne({emailid:username}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			return done(null, false);
		}
		return bcrypt.compare(password, user.password, done);
	});
}));

/** 
  * Controllers
  */
var dynamicDNSController = require('../controllers/dyn-dns/dyn-dns'),
	homeScreenController = require('../controllers/home-screen/home-screen'),
	loginController = require('../controllers/login-flow/login-flow'),
	registrationController = require('../controllers/reg-flow/reg-flow');


router.get('/', passport.authenticate('local', {failureRedirect: '/login' }), homeScreenController.process);
router.get('/login', loginController.render);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/register', registrationController.render);
router.post('register', registrationController.process);
router.get('/home', passport.authenticate('local', {failureRedirect: '/login' }), homeScreenController.process);
router.post('/home', passport.authenticate('local', {failureRedirect: '/login' }), homeScreenController.update);
router.get('/dyn-dns', passport.authenticate('local', {failureRedirect: '/login' }), dynamicDNSController.process);
router.get('/dyn-dns', passport.authenticate('local', {failureRedirect: '/login' }), dynamicDNSController.update);

module.exports = router;