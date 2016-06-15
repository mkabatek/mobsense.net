// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var moment 		     = require('moment');

// load up the user model
var User       = require('../modules/user');

if(process.env.DEV == 'true'){
    // load the auth variables
    console.log('Mode DEV: ' + process.env.DEV)
    console.log('using: ' + './auth_dev');
    var configAuth = require('./auth_dev'); // use this one for testing
}
else{
    // load the auth variables
    console.log('Mode DEV: ' + process.env.DEV)
    console.log('using: ' + './auth_prod');    
    var configAuth = require('./auth_prod'); // use this one for production
}
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done('email-taken', false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        User.findOne({ 'local.user' :  req.body.user }, function(err, user) {
                            // if there are any errors, return the error
                            if (err)
                                return done(err);

                            // check to see if theres already a user with that username
                            if (user) {
                                return done('username-taken', false, req.flash('signupMessage', 'That username is already taken.'));
                            } else {

                                // create the user
                                var newUser            = new User();
                                
                                newUser.tutorial       = true;
                                newUser.local.name     = req.body.name;
                                newUser.local.user     = req.body.user;
                                newUser.local.country  = req.body.country;
                                newUser.local.date     = moment().format('MMMM Do YYYY, h:mm:ss a');
                                newUser.local.email    = email;
                                newUser.local.password = newUser.generateHash(password);

                                newUser.save(function(err) {
                                    if (err)
                                        throw err;

                                    return done(null, newUser);
                                });
                            }

                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                var user            = req.user;
                user.tutorial       = true;
                user.local.name     = req.body.name;
                user.local.user     = req.body.user;
                user.local.country  = req.body.country;
                user.local.date     = moment().format('MMMM Do YYYY, h:mm:ss a');
                user.local.email    = email;
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            } else {
            
                console.log('current user')
                console.log(req.user.local.user)
                console.log('new user')
                console.log(req.body.user)
                console.log('current email')
                console.log(req.user.local.email)
                console.log('new email')
                console.log(req.body.email)
                //update the user
                console.log('Update user')
                var user            = req.user;
                user.local.name     = req.body.name;
                user.local.user     = req.body.user;
                user.local.country  = req.body.country;
                user.local.email    = email;
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));

    // =========================================================================
    // LOCAL UPDATE ============================================================
    // =========================================================================
    passport.use('local-update', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (req.user.local.email != req.body.email) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done('email-taken', 'email-taken', req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // create the user
                        console.log('current user')
                        console.log(req.user.local.user)
                        console.log('new user')
                        console.log(req.body.user)
                        console.log('current email')
                        console.log(req.user.local.email)
                        console.log('new email')
                        console.log(req.body.email)
                        //update the user
                        console.log('Update user')
                        var user            = req.user;
                        user.local.name     = req.body.name;
                        user.local.user     = req.body.user;
                        user.local.country  = req.body.country;
                        user.local.email    = email;
                        user.local.password = user.generateHash(password);
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }

                });

            }
            else if(req.user.local.user != req.body.user){
            
                User.findOne({ 'local.user' :  req.body.user }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done('username-taken', 'username-taken', req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        console.log('current user')
                        console.log(req.user.local.user)
                        console.log('new user')
                        console.log(req.body.user)
                        console.log('current email')
                        console.log(req.user.local.email)
                        console.log('new email')
                        console.log(req.body.email)
                        //update the user
                        console.log('Update user')
                        var user            = req.user;
                        user.local.name     = req.body.name;
                        user.local.user     = req.body.user;
                        user.local.country  = req.body.country;
                        user.local.email    = email;
                        user.local.password = user.generateHash(password);
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }

                });

            
            }
            else{

                console.log('current user')
                console.log(req.user.local.user)
                console.log('new user')
                console.log(req.body.user)
                console.log('current email')
                console.log(req.user.local.email)
                console.log('new email')
                console.log(req.body.email)
                //update the user
                console.log('Update user')
                var user            = req.user;
                user.local.name     = req.body.name;
                user.local.user     = req.body.user;
                user.local.country  = req.body.country;
                user.local.email    = email;
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            
            }

        });

    }));    
    
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
		console.log(req.user)
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
				console.log(req.user)
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();
                        newUser.tutorial       = true;
                        newUser.local.email  = (profile.emails[0].value || '').toLowerCase();
                        newUser.local.name   = profile.displayName;
                        newUser.local.user   = profile.id;
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();
                        newUser.tutorial            = true;
                        newUser.local.name          = profile.displayName;
                        newUser.local.user          = profile.id;
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session
                
                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();
                        newUser.tutorial       = true;
                        newUser.local.email  = (profile.emails[0].value || '').toLowerCase();
                        newUser.local.name   = profile.displayName;
                        newUser.local.user   = profile.id;
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));

};