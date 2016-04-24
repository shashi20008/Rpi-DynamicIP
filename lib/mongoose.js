
var MongoDB = {
	setup: function( hostName, portNum, dbName ) {
		var mongoose = require('mongoose');

		mongoose.connect('mongodb://' + hostName + ':' + portNum + '/' + dbName);
		var connection = mongoose.connection;

		connection.on('error', console.error.bind(console,
		  'connection error:'));
		connection.once('open', function () {
		  console.info('connected to database')
		});
	}
};

module.exports = MongoDB;