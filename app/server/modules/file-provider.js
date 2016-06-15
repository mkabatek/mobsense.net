var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var ObjectID    = require("mongodb").ObjectID;
var moment 		= require('moment');
var fs          = require('fs');
var readline    = require('readline');
var path        = require('path');


var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'mobsense';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('[file-provider.js]' + 'connected to database :: ' + dbName);
	}
});


var users = db.collection('users');
var dataset = db.collection('dataset');

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


exports.createUserData = function(user, callback){

            callback(null, user);       

}

exports.getAccount = function(obj, callback){	
    console.log("About to find account:");

    exports.getUserId(obj, function(e, o){
        if(o != null || o != undefined){
            users.find({_id: o._id}).toArray(function(error, a){
                console.log(a);
                callback(error, a);
            });
        }
        else{
            console.log('ERROR: o_.id returned null!')
            callback('ERROR: o_.id returned null!', null)
        }


    });
}

exports.saveData = function(obj, callback) {	
	console.log("About to save Data:");
    dataset.insert(obj, {safe: true}, callback);

};

exports.plotData = function(obj, callback) {	
	console.log("About to fetch Data:");
		//query dataset collection and sort by time field decending
        dataset.find(obj).sort({t: 1}).toArray(function(e, o){
        //console.log(o);
        callback(e, o);   
    });

};

exports.clearData = function(obj, callback) {	
	console.log("About to clear Data:");
        
        //console.log(o);
        
       dataset.remove(obj, {safe: true}, function(e, o) {
            if (e) {
                console.log(e);
                throw e;
            }
            console.log(o);
            callback(e, o);
        });
           
    

};

exports.downloadData = function(obj, callback) {	
	
	console.log("FP.downloadData:");
    dataset.find(obj).sort({t: 1}).toArray(function(e, o){
       
        var dataString = "";
		for(var i = 0; i < o.length; i++){
				
			dataString = dataString + o[i].t + ', ' + o[i].ax + ', ' + o[i].ay + ', ' + o[i].az + '\n';
			
		}
		callback(e, dataString);
		
    });
           
    

};

exports.getUserId = function(obj, callback){
            //console.log(obj)
            callback(null, obj);
}

exports.checkEmail = function(obj, callback){
console.log('checking email');
       users.find({'local.email': obj.email}).toArray(function(error, entries){
       
           //console.log(entries)
           console.log(entries.length)
           
           if(entries.length > 0){
            console.log('email-taken')
            callback('email-taken', entries)
           }else{
            console.log('email-free')
            callback(null, entries)
           }
           
           
       });
       
       
        
        
}

exports.checkUsername = function(obj, callback){
console.log('checking username');
       users.find({'local.user': obj.user}).toArray(function(error, entries){

           console.log(entries.length)
            if(entries.length > 0){
            console.log('username-taken')
            callback('username-taken', entries)
           }else{
            console.log('username-free')
            callback(null, entries)
           }

       });
        
        
}

