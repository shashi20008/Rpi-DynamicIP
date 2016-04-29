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
var totalDeviceCapacity = 0;
var userDataModel = {};
var dailyDeviceCapacity = 0;
var monthlyDeviceCapacity = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = {'user' : req.query.user};
	
  consumptionModel.findOne(query, function (err, response) {
    if(err || !response) {
      return res.json({
        message: "couldn't find user",
        error: err
      });
    }
    
    consumptionModel.find({'deviceId': response.deviceId}, function (err, deviceDatas ) {
      if(err || !deviceDatas) {
        return res.json({
          message: "couldn't find deviceId",
          error: err
        });
      }
  
      computeDailyData(deviceDatas);
      computeMonthlyData(deviceDatas);

      deviceDatas.forEach(function (deviceData){
        totalDeviceCapacity = totalDeviceCapacity + deviceData.capacity;
      });
      res.json (userDataModel);
    });
  });
});

router.post('/', function(req, res, next) {
    consumptionModel.findOne({'deviceId': req.body.deviceId}, function (err, document) {
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

var computeDailyData = function(deviceDatas) {
  
  var date = new Date();
  var startOfDay = date.setHours(0,0,0,0); //setHours returns number.. call toUTCString() in next line
  var endOfDay = date.setHours(23,59,59,999);
  

  deviceDatas.forEach(function (deviceData){
    deviceData = deviceData.toJSON();
    if(deviceData.systemTimeStamp >= startOfDay && deviceData.systemTimeStamp <= endOfDay) {
      dailyDeviceCapacity = dailyDeviceCapacity + deviceData.capacity;
    }
  });

  var avgDailyDeviceCapacity = dailyDeviceCapacity/24;
  userDataModel.dailyDeviceCapacity = dailyDeviceCapacity;
  userDataModel.avgDailyDeviceCapacity = avgDailyDeviceCapacity;
};

var computeMonthlyData = function(deviceDatas) {
  var date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var startOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), 1, 0,0,0,0);
  var endOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), lastDay.getDate(), 23, 59, 59, 999);

  deviceDatas.forEach(function (deviceData){
    deviceData = deviceData.toJSON();
    if(deviceData.systemTimeStamp >= startOfMonth && deviceData.systemTimeStamp <= endOfMonth) {
      monthlyDeviceCapacity = monthlyDeviceCapacity + deviceData.capacity;
    }
  });
    var avgMonthlyDeviceCapacity = monthlyDeviceCapacity/lastDay;
    userDataModel.monthlyDeviceCapacity = monthlyDeviceCapacity;
    userDataModel.avgMonthlyDeviceCapacity = avgMonthlyDeviceCapacity;
};

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
