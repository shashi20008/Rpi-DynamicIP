// var express = require('express');
// var router = express.Router();
// var consumptionModel = require('../model/consumption');
// var trainingModel = require('../model/training');
// var Q = require('q');
// var _ = require('underscore');
// var deviceId;
// var timestamp;
// var capacity;
// var isFirstRequest = true;
// var firstTimestamp;
// var systemTimestamp;
// var arduinoFirstTimestamp;
// var totalDeviceCapacity = 0;
// var userDataModel = {};
// var dailyCapacity = 0;
// var monthlyCapacity = 0;

// router.get('/', function(req, res, next) {
//   res.end('Life is good! You be good too nginx.');
// });

// /* GET home page. */
// router.get('/user', function(req, res, next) {
//   console.log("inside router get" + req.query.user);
//   var query = {'user' : req.query.user};
	
//   consumptionModel.find(query, function (err, response) {
//     if(err || !response || !Array.isArray(response) || !response[0] || !response[0].userData) {
//       console.log('no user found')
//       return res.json({
//         message: "couldn't find user",
//         error: err
//       });
//     }
//     var dailyDataPromise = Q.nfcall(computeDailyData, response[0].userData, response[0].dateOfReg);
//     var monthlyDataPromise = Q.nfcall(computeMonthlyData, response[0].userData, response[0].dateOfReg);
//     var getTrendPromise = Q.nfcall(getTrendData, response[0].userData);
//     var leakyBucketsPromise = Q.nfcall(detectLeakyBuckets, response[0].userData);

//     Q.all(dailyDataPromise, monthlyDataPromise, getTrendPromise, leakyBucketsPromise).spread(function(){
//       res.json (userDataModel);
//     });
//   });
// });

// router.get('/report', function(req, res, next) {
//   console.log("in report");
//   var query = {'user' : req.query.user};
  
//   consumptionModel.find(query, function (err, response) {
//     if(err || !response) {
//       return res.json({
//         message: "couldn't find user",
//         error: err
//       });
//     } else {
//       var startDate = req.query.startDate;
//       var endDate = req.query.endDate;
//       var getReportPromise = Q.nfcall(getReport, response[0].userData, startDate, endDate);
//       getReportPromise.then(function (reportInfo){
//         res.json (reportInfo);
//       });
//     }
//   });
// });

// router.get('/getDevice', function(req, res, next) {
//   console.log("getDevice");
//   var query = {'user' : req.query.user};
//   var deviceList = [];
  
//   trainingModel.findOne(query, function (err, response) {
//     if(err || !response) {
//       return res.json([]);
//     } else {
//       var deviceDatas = response.deviceData;
//       deviceDatas.forEach(function (deviceData) {
//         deviceList.push({name:deviceData.deviceName, type: deviceData.deviceType});
//       });
//       res.json(deviceList);
//     }
//   });
// });

// router.post('/data', function(req, res, next) {
//   console.log("post");
//     consumptionModel.findOne({'user': req.body.user}, function (err, document) {
//       console.log(document);
//       if(!document) {
//         console.log("inside document");
//         systemTimestamp = Date.now();
//         insertNewDocument(req, res, systemTimestamp);
//       } else {
//         console.log("update document");
//         updateDocument(req, res);
//       }
//     });
// });

// router.post('/addDevice', function(req, res, next) {
//   console.log("add device");
//   console.log(req.body);
//   var query = {'user' : req.body.user};
  
//   trainingModel.find(query, function (err, response) {
//     if(response == "") {
//       insertNewDevice(req,res);
//     } else {
//       updateDevice(req,res);
//     }
//   });
// });

// var insertNewDocument = function(req, res, systemTimestamp) {
// 	console.log("inserting");
// 	var newConsumption = new consumptionModel({
//     user: req.body.user,
//     dateOfReg: systemTimestamp,
//     userData: {
//       capacity: req.body.capacity,
//       systemTimestamp: systemTimestamp,
//       arduinoTimestamp: req.body.timestamp,
//     }
//   	});

//   	newConsumption.save(function(err, res) {
//   		if(err) {
//         console.log("Oops, you just received an error message");
//         return res.json ({'ERROR:: ':err}); 
//   		}
//   		else {
//   			console.log("Success");
//         return res.json({"result" : "Success"});
//   		}
//   	});
// };

// var updateDocument = function(req, res){
//   console.log("updating");
//   var findQuery = {'user': req.body.user};
//   var pushQuery = {$push: {
//       userData: {
//         capacity: req.body.capacity,
//         systemTimestamp: Date.now(),
//         arduinoTimestamp: req.body.timestamp
//       }
//     }
//   };
//   consumptionModel.update(findQuery, pushQuery, function (err, response){
//     if (err) {
//       return res.json ({'ERROR:: ':err}); 
//     } else {
//       return res.json({"result" : "Success"});
//     }
//   });
// };

// var insertNewDevice = function(req,res) {
//   var newtraining = new trainingModel ({
//       user: req.body.user,
//       deviceData: [{
//         deviceName: req.body.deviceName,
//         deviceType: req.body.deviceType,
//         trainingData: [{
//           startDate: req.body.startDate,
//           endDate: req.body.endDate
//         }]
//       }]
//   });

//   newtraining.save(function(err, res) {
//     if(err) {
//       console.log(err);
//       console.log("Error: Failure while adding device");
//     } else {
//       console.log("Success");
//       return res.json({"result" : "Success"});
//     }
//   });
// };

// var updateDevice = function(req,res) {
//   var isDevicePresent = false;
//   var deviceIndex = -1;
//   var findQuery = {'user': req.body.user};
//   var deviceName = req.body.deviceName,
//       deviceType = req.body.deviceType,
//       startDate = req.body.startDate,
//       endDate = req.body.endDate;

//   trainingModel.findOne(findQuery, function (err, response) {
//     var deviceDatas = response.deviceData;
//     deviceDatas.some(function (deviceData, index){
//       if(deviceData.deviceName == req.body.deviceName) {
//         isDevicePresent = true;
//         deviceIndex = index
//         return true;
//       } 
//     });
//     var pushQuery = {$push:{}};
//     if(isDevicePresent) {
//       pushQuery.$push["deviceData."+deviceIndex+ ".trainingData"] = {
//             startDate: startDate, 
//             endDate: endDate
//       };
//     } else {
//       pushQuery.$push = {
//         deviceData: {
//           deviceName: deviceName, 
//           deviceType: deviceType,
//           trainingData: {
//             startDate: startDate, 
//             endDate: endDate
//           }
//         }
//       };
//     }
//     trainingModel.update(findQuery, pushQuery, function(err, response) {
//       if(err) {
//         console.log(err);
//         console.log("Error: Failure while updating device");
//       } else {
//         console.log("Success");
//         return res.json({"result" : "Success"});
//       }
//     });
//   });
// };

// var computeDailyData = function(userDatas, dateOfReg, callback) {
//   var todayConsumption =0;
//   var oldConsumption = 0;
//   var date = new Date();
//   var startOfDay = date.setHours(0,0,0,0); //setHours returns number.. call toUTCString() in next linevar presentDate = new Date(new Date().toJSON().slice(0,10));
//   var endOfDay = date.setHours(23,59,59,999);
//   var presentDate = new Date(new Date().toJSON().slice(0,10)).getTime();
//   var regDate = new Date(new Date(dateOfReg).toJSON().slice(0,10)).getTime();

//   var days = Math.floor((presentDate - (regDate))/(1000*60*60*24))-1;
//   console.log(days);
  
//   userDatas.forEach(function (userData){
//     userData = userData.toJSON();
//     if(userData.systemTimestamp >= startOfDay && userData.systemTimestamp <= endOfDay) {
//       todayConsumption = todayConsumption + userData.capacity;
//     } else {
//       oldConsumption = oldConsumption + userData.capacity;
//     }
//   });

//   var avgDailyConsumption = oldConsumption/days;
//   avgDailyConsumption = (Math.round(avgDailyConsumption*100))/100;
//   userDataModel.todayConsumption = todayConsumption;
//   userDataModel.avgDailyConsumption = avgDailyConsumption;
//   callback(null, userDataModel);
// };

// var computeMonthlyData = function(userDatas, dateOfReg, callback) {
//   var thisMonthConsumption =0;
//   var oldMonthsConsumption = 0;
//   var date = new Date();
//   var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   var startOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), 1, 0,0,0,0);
//   var endOfMonth = Date.UTC(date.getFullYear(), date.getMonth(), lastDay.getDate(), 23, 59, 59, 999);
//   var presentDate = new Date(new Date().toJSON().slice(0,10)).getTime();
//   var regDate = new Date(new Date(dateOfReg).toJSON().slice(0,10)).getTime();

//   var days = Math.floor((presentDate - (regDate))/(1000*60*60*24));
//   var months = parseInt(days/30);
//   console.log(months);

//   userDatas.forEach(function (userData){
//     userData = userData.toJSON();
//     if(userData.systemTimestamp >= startOfMonth && userData.systemTimestamp <= endOfMonth) {
//       thisMonthConsumption = thisMonthConsumption + userData.capacity;
//     } else {
//       oldMonthsConsumption = oldMonthsConsumption + userData.capacity;
//     }
//   });
//     var avgMonthlyConsumption = oldMonthsConsumption/months;
//     avgMonthlyConsumption = (Math.round(avgMonthlyConsumption*100))/100;
//     userDataModel.monthConsumption = thisMonthConsumption;
//     userDataModel.avgMonthlyConsumption = avgMonthlyConsumption;
//     callback(null, userDataModel);
// };

// function detectLeakyBuckets(userData, cb) {

//   console.log('detectLeakyBuckets');
//   if(!userData || userData.length <= 0 ) {
//     console.log('nothing provided.');
//     return cb();
//   }

//   console.log('declaring vars..');

//   var msInDay = 1000 * 60 * 60 * 24
//       end = Date.now(),
//       start = end - msInDay,
//       allData = [];

//   console.log('foreaching: ', start, end);
//   userData.forEach(function(entry) {
//     entry  = entry.toJSON();
//     if(entry.systemTimestamp >= start && entry.systemTimestamp <= end) {
//       allData.push({
//         systemTimestamp: entry.systemTimestamp,
//         capacity: entry.capacity
//       });
//     }
//   });

//   console.log('foreached: ', allData.length);

//   if(allData.length <= 0) {
//     userDataModel.leaky = false;
//     return cb(null, userDataModel);
//   }

//   allData = _.sortBy(allData, 'systemTimestamp');
//   var unused = 0,
//       prev = allData[0].systemTimestamp - 1,
//       cur  = 0;

//   console.log('allData.length', allData.length);
//   for(var i = 0; i < allData.length; i++) {
//     cur = allData[i].systemTimestamp;
//     console.log('ding... ', prev, ' .. ', cur, ' .. ', (cur - prev), ' .. ', allData[i].capacity, ' .. ', (allData[i].capacity / (cur - prev) * 1000));

//     if((allData[i].capacity / (cur - prev) * 1000) <= 0.01) {
//       unused += (cur - prev);
//     }
//     prev = cur;
//   }

//   console.log('unused: ', unused);

//   if(unused <= 3600000) { // Only switched off for an hour?? Lavish household.
//     userDataModel.leaky = true;
//   } else {
//     userDataModel.leaky = false;
//   }
//   console.log(userDataModel);

//   return cb(null, userDataModel);

// }

// var calculateSystemTimestamp = function(timestamp, arduinoOldTimestamp, systemOldTimestamp) {
// 	var timestampDiff = timestamp - arduinoOldTimestamp;
// 	systemTimestamp = systemOldTimestamp + timestampDiff;
// };

// var getReport = function(userDatas, startDate, endDate, callback) {
//   console.log("inside getreport");
//   var consumptionReport = {};
//   userDatas.forEach(function (userData){
//     userData = userData.toJSON();
//     if(userData.systemTimestamp >= startDate && userData.systemTimestamp <= endDate) {
//       console.log("inside if");
//       var dateKey = new Date(userData.systemTimestamp).toJSON().slice(0,10);
//       console.log("printing datekey");
//       console.log(dateKey);
//       consumptionReport[dateKey] = (consumptionReport.hasOwnProperty(dateKey))? (consumptionReport[dateKey]+ userData.capacity) : userData.capacity;
//       console.log(consumptionReport);
//     } 
//   });
//   console.log(consumptionReport);
//   callback(null, consumptionReport);
// };

// var getTrendData = function(userDatas, callback) {
//   var day, hour, consumption;
//   var trend = {};
//   var trendArray = [];
//   for (var i = 1; i <= 7; i++) {
//     trend[''+i] = {};
//     for (var j = 1; j <= 24; j++) {
//       trend[''+i][''+j] = 0;
//     }
//   }

//   userDatas.forEach(function (userData) {
//     day = new Date(userData.systemTimestamp).getDay();
//     hour = new Date(userData.systemTimestamp).getHours();
//     consumption = userData.capacity;

//     day = day + 1;
//     hour = hour + 1;

//     if(trend.hasOwnProperty(day)) {
//       if(trend[day].hasOwnProperty(hour)) {
//         trend[day][hour] = trend[day][hour] + consumption;
//       } else {
//         trend[day][hour] = consumption;
//       }
//     } else {
//       trend[day] = {};
//       trend[day][hour] = consumption;
//     }
//   });
  
//   for (var day in trend) { 
//     for (var hour in trend[day]) {
//       trendArray.push({
//         day: parseInt(day), 
//         hour: parseInt(hour), 
//         value: trend[day][hour]})
//     } 
//   }
//   console.log(trendArray);
//   userDataModel.trendInfo= trendArray;
//   callback(null, trendArray);
// }


// module.exports = router;