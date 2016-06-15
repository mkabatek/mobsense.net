/**
/**
 * MobSense
 * stream^N Inc.
 * Copyright (c) 2016 Michael Kabatek
 *
 **/

var io = require('socket.io')
var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();

/*easy node login*/
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(express);


var configDB = require(__dirname + '/app/server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require(__dirname + '/app/server/config/passport.js')(passport); // pass passport for configuration


var sess_conf = {
    db: {
        db: 'mobsense',
        host: 'localhost',
        port: 27017,
        collection: 'sessions' // optional, default: sessions
    },
    secret: 'secret'
};


/*easy node login*/


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms




app.configure(function() {
    app.set('port', 8084);
    app.set('views', __dirname + '/app/server/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    //app.use(express.favicon());
    //app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());

    app.use(express.session({
        secret: sess_conf.secret,
        maxAge: new Date(Date.now() + 3600000),
        store: new MongoStore(sess_conf.db)
    }));

    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
        src: __dirname + '/app/public'
    }));
    app.use(express.static(__dirname + '/app/public'));
    //add static resources directory
    app.use('/resources', express.static(__dirname + '/app/server/resources'));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use(function(req, res, next) {
        res.renderWithData = function(view, model, data) {
            model.data = JSON.stringify(data);
            res.render(view, model);
        };
        next();
    });


});

app.configure('development', function() {
    app.use(express.errorHandler());
});


var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

require('./app/server/router')(app, io.listen(server, {log: true}), passport);
