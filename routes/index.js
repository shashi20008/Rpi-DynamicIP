var express = require('express');
var router = express.Router();
var consumptionModel = require('../model/consumption');
var deviceId;
var timestamp;
var capacity;
var isFirstRequest = true;
var firstTimestamp;
var systemTimestamp;
var arduinoFirstTimestamp;
/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("req.body");
    console.log(req.body);
    consumptionModel.findOne({'deviceId': req.body.deviceId}, function(err, document){
    	if(!document) {
    		systemTimestamp = Date.now();
    		insertNewDocument(req, systemTimestamp);
    	} else {
    		var arduinoOldTimestamp = document.arduinoTimestamp;
    		var systemOldTimestamp = document.systemTimestamp;
    		calculateSystemTimestamp(req.body.timestamp, arduinoOldTimestamp, systemOldTimestamp);
    		insertNewDocument(req, systemTimestamp);
    	}
    });

  	res.render('index', { title: 'Express' });
});

var insertNewDocument = function(req, systemTimestamp) {
	
	var newConsumption = new consumptionModel({
  		deviceId: req.body.deviceId,
  		systemTimestamp: systemTimestamp,
  		arduinoTimestamp: req.body.timestamp,
  		capacity: req.body.capacity
  	});

  	newConsumption.save(function(err, res) {
  		if(err) {
  			console.log("Oops, you just received an error message");
  		}
  		else {
  			console.log("Success");
  		}
  	});
};

var calculateSystemTimestamp = function(timestamp, arduinoOldTimestamp, systemOldTimestamp) {
	var timestampDiff = timestamp - arduinoOldTimestamp;
	systemTimestamp = systemOldTimestamp + timestampDiff;
};

module.exports = router;
