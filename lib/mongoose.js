
var MongoDB = {
	setup: function( hostName, portNum, dbName ) {
		var mongoose = require('mongoose');

		var username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
		var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
		var auth = '';
		if(username && password) {
			auth = username + ':' + password + '@';
		}
		mongoose.connect('mongodb://' + auth + hostName + ':' + portNum + '/' + dbName);
		var connection = mongoose.connection;

		connection.on('error', console.error.bind(console,
		  'connection error:'));
		connection.once('open', function () {
		  console.info('connected to database' + dbName);
		});
	}
};

module.exports = MongoDB;