#!/usr/bin/env node
var CT      = require('./modules/country-list');
var AM      = require('./modules/account-manager');
var FP      = require('./modules/file-provider');
var EM      = require('./modules/email-dispatcher');
var fs      = require('fs');
var http    = require('follow-redirects').http;
var https   = require('follow-redirects').https;
var path    = require('path');
var attempt = require('attempt');
var moment  = require('moment');
var email   = require("emailjs");

var nodePath = '';
var fullPath = __dirname; 
var thispath = fullPath.split('/'); 
var pathArray = [];
var mySocket;


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

    return year + "_" + month + "_" + day + "_" + hour + "_" + min + "_" + sec;

}
    

postfixSend = function postfixSend(emailInfo, callback) {

	var server  = email.server.connect({
		user:    "yourEmailAccountUser", 
		password: "yourPassword", 
		host:    "localhost", 
		ssl:     false
	});

	server.send({
		text:    emailInfo.msg, 
		from:    emailInfo.from, 
		to:      emailInfo.to,
		subject: emailInfo.subject
		}, function(err, message) {
			callback(err);
	});

}

exports.postfixSend = postfixSend;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		next();
    }
    else{
        res.renderWithData('app.jade', {}, {auth: req.isAuthenticated()});
    }
}

// get path to main app.js
for(var i = 0; i < thispath.length-2; i++){
pathArray[i] = thispath[i];
}
nodePath = '/' + pathArray[1] + '/' + pathArray[2] + '/' + pathArray[3];

   
module.exports = function(app, io, passport) {
    var timer;
    //socket.io connection for updating data
    io.sockets.on('connection', function (socket) {
        mySocket = socket;
		console.log('socket.io connected');

        socket.on('disconnect', function (data) {
            console.log('socket.io disconnect');

        });
        socket.on('reconnect', function (data) {
            console.log('socket.io reconnect');

        });
        socket.on('error', function (data) {
            console.log('socket.io error');

        });
        socket.on('logout', function (data) {
            socket.disconnect();
            console.log('socket.io logout');

        });

    });

// test routes =================================================================

    //test route to check authentication
    app.get('/data', isLoggedIn, function(req, res){

		console.log('authenticated!!');
		res.send({stuff:'a-ok'});

    });
    
    //test route to check authentication
    app.get('/getuser', isLoggedIn, function(req, res){

		console.log('authenticated?');
		console.log(req.isAuthenticated());
		res.send({user: req.user});

    });

// normal routes ===============================================================

	// show the home page (will also have our login links)
    app.get('/', function(req, res, next) {
        res.renderWithData('app.jade', {}, {auth: req.isAuthenticated()})
    });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
        res.send('User logged out')
	});
	
    //send data to server data route
    app.post('/data',  isLoggedIn, function(req, res){


		//console.log(req.user);
		mySocket.emit('data', 'I just got the data');
		console.log('t: ' + req.param('t') + ' ax: ' + req.param('ax') + ' ay: ' + req.param('ay') + ' az: ' + req.param('az'));
		
		var a = {
			
			userId: req.user._id,
			t:  req.param('t'),
			ax: req.param('ax'),
			ay: req.param('ay'),
			az: req.param('az')
			
			};
		//write this data to the datebase for the given user.
		
		FP.saveData(a, function(e, o){

            console.log('[post] /data called');
            console.log('FP.saveData called');
            console.log(a);
        });
		
		
		res.send('a-ok post t: ' + a.t + ' ax: ' + a.ax + ' ay: ' + a.ay + ' az: ' + a.az);
		

    });
    
    //plotdata requests the user's data from db
    app.get('/plotdata', isLoggedIn, function(req, res){


		//get the latest user data to the datebase for the given user.
		FP.plotData({userId: req.user._id}, function(e, o){

            console.log('[post] /plotdata called');
            console.log('FP.plotData called');
            res.send({data: o});
        });
		
		
		//res.send('a-ok');

    });
    
    //clear data
    app.get('/clear', isLoggedIn, function(req, res){


		console.log("Clear data called");
		FP.clearData({userId: req.user._id}, function(e, o){

            console.log('[get] /clear called');
            console.log('FP.clearData called');
            res.send({info: "clear data called"});
            //res.send({data: o});
        });
		

    });
    
    //download data
    app.get('/download', isLoggedIn, function(req, res){


		console.log("Download data called");
		FP.downloadData({userId: req.user._id}, function(e, o){

            console.log('[get] /download called');
            console.log('FP.downloadData called');
            if(o){
				var filename = getDateTime() + '.txt';
				var mimetype = 'text/plain';
				res.setHeader('Content-disposition', 'attachment; filename=' + filename);
				res.setHeader('Content-type', mimetype);
				res.charset = 'UTF-8';
				res.write(o);
				res.end();
				
			}
			else{
				res.send({note:'no data'})
			}

        });
		

    });

 	

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// process the login form
		app.post('/login', function(req, res, next) {
          passport.authenticate('local-login', function(err, user, info) {

                req.login(user, function(err) {
                  if (err) { return next(err); }
                    FP.createUserData(user, function(e,o){
                        res.send(o);
                    });
                });
            
          })(req, res, next);
        });

		// SIGNUP =================================
		// process the signup form
        app.post('/signup', function(req, res, next) {
          passport.authenticate('local-signup', function(err, user, info) {

                req.login(user, function(err) {
                  if (err) { return next(err); }
                    FP.createUserData(user, function(e,o){
                        res.redirect('/#main');
                    }); 
                });

          })(req, res, next);
        });        
        
        
        
        

	
		// facebook -------------------------------
		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',function(req, res, next) {
          passport.authenticate('facebook', function(err, user, info) {
                req.login(user, function(err) {
                  if (err) { return next(err); }
                    var user = req.user;
                    console.log(user)
                    res.redirect('/#account');
                                      
                });          

          })(req, res, next);
        });

		// twitter --------------------------------
		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',function(req, res, next) {
			
          passport.authenticate('twitter', function(err, user, info) {
                req.login(user, function(err) {
                  if (err) { return next(err); }
                    var user = req.user;
                    console.log(user)
                    res.redirect('/#account');
                                      
                });          

          })(req, res, next);
        });
        


		// google ---------------------------------
		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user  
		app.get('/auth/google/callback', function(req, res, next) {
          passport.authenticate('google', function(err, user, info) {
                req.login(user, function(err) {
                  if (err) { return next(err); }
                    var user = req.user;
                    console.log(user)
                    res.redirect('/#account');
                                      
                });          

          })(req, res, next);
        }); 
        
        
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

		// locally --------------------------------
		// PROFILE SECTION =========================
		app.post('/connect/local', isLoggedIn, function(req, res, next) {
          passport.authenticate('local-update', function(err, user, info) {

                    FP.createUserData(user, function(e,o){
                        res.send(o);
                    });

          })(req, res, next);
        });   
      

		// facebook -------------------------------
		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/#account',
				failureRedirect : '/#login'
			}));

		// twitter --------------------------------
		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/#account',
				failureRedirect : '/#login'
			}));


		// google ---------------------------------
		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : [ 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/#account',
				failureRedirect : '/#login'
			}));
            

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/#account');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook       = undefined;
		user.save(function(err) {
			res.redirect('/#account');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter       = undefined;
		user.save(function(err) {
			res.redirect('/#account');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', isLoggedIn, function(req, res) {
		var user          = req.user;
        user.google = undefined
 		user.save(function(err) {
			res.redirect('/#account');
		});
	});





  //creating new accounts
  app.get('/get-countries', function(req, res) {
		res.send({countries : CT });
  });
  
  app.post('/updateAccount', isLoggedIn, function(req, res){
        console.log('/updateAccount called');
        console.log(req.param('tutorial'))
        AM.updateAccount({
            user 		: req.param('user'),
            name 		: req.param('name'),
            email 		: req.param('email'),
            country 	: req.param('country'),
            pass		: req.param('pass'),
            tutorial    : req.param('tutorial'),
        }, function(e, o){
            if (e){
                res.send('error-updating-account', 400);
            }	else{
                res.send('ok', 200);
            }
        });
  });
  
  app.post('/updateTutorial', isLoggedIn, function(req, res){
        console.log('/updateTutorial called');
        console.log('Tutorial set to: ' + req.body.account.tutorial);
		var user          = req.user;
        user.tutorial = req.body.account.tutorial;
 		user.save(function(err) {
			res.send(user);
		});
            
    
  });

  //password reset
  app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
  });

  app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
  });
	
  app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
  });
	



	// PROFILE SECTION =========================
	app.get('/api/account', isLoggedIn, function(req, res) {
            //console.log(req.user)
            res.send({account: req.user, countries: CT});
            console.log('[get] /api/account called');
	});  
  
	// PROFILE SECTION =========================
	app.post('/api/account', isLoggedIn, function(req, res) {
                    console.log('[post] /api/account called');
                    //console.log(user)
            		var user            = req.user;

                    FP.checkUsername(req.body, function(e,o){
                    
                        if(e != null){
                            res.status(404).send(e);
                            
                        }
                        else{
                        
                            FP.checkEmail(req.body, function(e,o){
                                if(e != null){
                                    res.status(404).send(e);
                                }
                                else{
                                    
                                    res.send(o);
                                
                                }
                            
                            });
                        
                        }

                    
                    });
            //res.send({account: req.user, countries: CT});
            
	});  

  //example get request server response
  app.get('/helloworld', function(req, res){
    
    console.log('/helloworld');
    console.log('======================req-header====================');
    console.log(req.headers);
    console.log('======================req-session====================');
    console.log(req.session);
    console.log('======================req-cookies====================');
    console.log(req.cookies);
    console.log('======================req-query====================');
    console.log(req.query);
    res.send('hello world');
    
  }); 
    //example get request server response
  app.post('/helloworld', function(req, res){
    
    req.session.Oauth = "abcd";
    
    console.log('/helloworld');
    console.log('======================req-header====================');
    console.log(req.headers);
    console.log('======================req-session====================');
    console.log(req.session);
    console.log('======================req-cookies====================');
    console.log(req.cookies);
    console.log('======================req-query====================');
    console.log(req.query);
    
    req.session.Oauth = "abcd";
    res.send('hello world');
    
  }); 
  
  //MUST BE LAST
  app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};

