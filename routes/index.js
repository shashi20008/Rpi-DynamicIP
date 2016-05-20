var express = require('express');
var router = express.Router();
var consumptionModel = require('../model/consumption');
var Q = require('q');
var deviceId;
var timestamp;
var capacity;
var isFirstRequest = true;
var firstTimestamp;
var systemTimestamp;
var arduinoFirstTimestamp;
var totalDeviceCapacity = 0;
var userDataModel = {};
var dailyCapacity = 0;
var monthlyCapacity = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("inside router get" + req.query.user);
  var query = {'user' : req.query.user};
	
  consumptionModel.find(query, function (err, response) {
    if(err || !response) {
      return res.json({
        message: "couldn't find user",
        error: err
      });
    }
    console.log(response[0]);
    
    // consumptionModel.find({'deviceId': response.deviceId}, function (err, deviceDatas ) {
    //   if(err || !deviceDatas) {
    //     return res.json({
    //       message: "couldn't find deviceId",
    //       error: err
    //     });
    //   }
      var dailyDataPromise = Q.nfcall(computeDailyData, response[0].userData, response[0].dateOfReg);
      var monthlyDataPromise = Q.nfcall(computeMonthlyData, response[0].userData, response[0].dateOfReg);

      Q.all(dailyDataPromise, monthlyDataPromise).spread(function(){
        res.json (userDataModel);
      })
      // deviceDatas.forEach(function (deviceData){
      //   totalDeviceCapacity = totalDeviceCapacity + deviceData.capacity;
      // });
      //res.json (response);
    //});
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

var computeDailyData = function(userDatas, dateOfReg, callback) {
  var todayConsumption =0;
  var oldConsumption = 0;
  var date = new Date();
  var startOfDay = date.setHours(0,0,0,0); //setHours returns number.. call toUTCString() in next linevar presentDate = new Date(new Date().toJSON().slice(0,10));
  var endOfDay = date.setHours(23,59,59,999);
  var presentDate = new Date(new Date().toJSON().slice(0,10)).getTime();
  var regDate = new Date(new Date(dateOfReg).toJSON().slice(0,10)).getTime();

  var days = Math.floor((presentDate - (regDate))/(1000*60*60*24))-1;
  console.log(days);
  
  userDatas.forEach(function (userData){
    userData = userData.toJSON();
    if(userData.systemTimestamp >= startOfDay && userData.systemTimestamp <= endOfDay) {
      todayConsumption = todayConsumption + userData.capacity;
    } else {
      oldConsumption = oldConsumption + userData.capacity;
    }
  });

  var avgDailyConsumption = oldConsumption/days;
  userDataModel.todayConsumption = todayConsumption;
  userDataModel.avgDailyConsumption = avgDailyConsumption;
  callback(null, userDataModel);
};

var computeMonthlyData = function(userDatas, dateOfReg, callback) {
  var thisMonthConsumption =0;
  var oldMonthsConsumption = 0;
  var date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var startOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), 1, 0,0,0,0);
  var endOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), lastDay.getDate(), 23, 59, 59, 999);
  var presentDate = new Date(new Date().toJSON().slice(0,10)).getTime();
  var regDate = new Date(new Date(dateOfReg).toJSON().slice(0,10)).getTime();

  var days = Math.floor((presentDate - (regDate))/(1000*60*60*24));
  var months = parseInt(days/30)-1;
  console.log(months);

  userDatas.forEach(function (userData){
    userData = userData.toJSON();
    if(userData.systemTimestamp >= startOfMonth && userData.systemTimestamp <= endOfMonth) {
      thisMonthConsumption = thisMonthConsumption + userData.capacity;
    } else {
      oldMonthsConsumption = oldMonthsConsumption + userData.capacity;
    }
  });
    var avgMonthlyConsumption = oldMonthsConsumption/months;
    userDataModel.thisMonthConsumption = thisMonthConsumption;
    userDataModel.avgMonthlyConsumption = avgMonthlyConsumption;
    callback(null, userDataModel);
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