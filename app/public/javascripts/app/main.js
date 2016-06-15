requirejs.config({
    paths: {
        'text': '../vendor/requirejs-text/text',
        'knockout': '../vendor/knockout.js/knockout',
        'kosortable': '../vendor/knockout.js/knockout-sortable.min',
        'jquery': '../vendor/jquery/jquery',
        'jquery.cookie': '../vendor/jquery/jquery.cookie',
        'jquery.form': '../vendor/jquery/jquery.form',
        'jquery.mobile': '../vendor/jquery/jquery.mobile.custom.min',
        'jquery.ui.sortable': '../vendor/jquery/jquery.ui.sortable',
        'jquery.ui': '../vendor/jquery/jquery-ui-1.10.4.custom.min',
        'jquery.ui.touch-punch': '../vendor/jquery/jquery.ui.touch-punch.min',
        'bootstrap': '../vendor/bootstrap/bootstrap',
        'bootstrap-modal': '../vendor/bootstrap/bootstrap-modal',
        'durandal': '../vendor/durandal',
        'plugins': '../vendor/durandal/plugins',
        'transitions': '../vendor/durandal/transitions',
        'socket.io': '../vendor/socket.io/socket.io',
        'av': '../vendor/node-login/form-validators/accountValidator',
        'lv': '../vendor/node-login/form-validators/loginValidator',
        'sc': '../vendor/node-login/controllers/signupController',
        'd3': '../vendor/d3js/d3.min'

    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'bootstrap-modal': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.cookie': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.form': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.mobile': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.ui': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.ui.touch-punch': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery.ui.sortable': {
            deps: ['jquery'],
            exports: 'jQuery'
        }

    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});
