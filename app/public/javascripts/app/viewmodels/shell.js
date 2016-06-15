
define(['plugins/router',
    'durandal/app',
    'knockout',
    'jquery.form',
    'jquery.cookie',
    'jquery.ui',
    'jquery.ui.touch-punch',
    'jquery.mobile',
    'bootstrap'
], function (router, app, ko) {




    var str2obj = function (str) {
        str = str.split('; ');
        var result = {};
        for (var i = 0; i < str.length; i++) {
            var cur = str[i].split('=');
            result[cur[0]] = cur[1];
        }
        return result;
    }



    var viewModel = {
        activate: function () {

            var self = this;
            app.on("updateTitle", function () {
                //fix usernames
            });

            app.on("logout", function () {
                self.userName('');
                self.user('');
                self.pass('');
                data.auth = false;
                $.ajax({
                    type: "GET",
                    url: "logout",
                    beforeSend: function () {},
                    complete: function (data) {
                        console.log('Log out completed')
                    },
                    error: function (errormessage) {
                        console.log(errormessage)
                    }
                });
            });

            app.on("login", function () {
                self.user('');
                self.pass('');
            });


            self = this;
            router.reset();
            if (Boolean(data.auth)) {
                router.map([

                    {
                        route: 'main',
                        moduleId: 'viewmodels/main',
                        nav: true
                    }, {
                        route: 'account',
                        moduleId: 'viewmodels/account',
                        nav: true
                    }, {
                        route: 'login',
                        moduleId: 'viewmodels/login',
                        title: 'Logout',
                        nav: true
                    }, {
                        route: 'terms',
                        moduleId: 'viewmodels/terms',
                        title: 'Terms',
                        nav: false
                    }, {
                        route: 'privacy',
                        moduleId: 'viewmodels/privacy',
                        title: 'Privacy',
                        nav: false
                    }
                ]).buildNavigationModel().mapUnknownRoutes('viewmodels/main');;
                router.navigate('main');
            } else {

                self.userName('');
                router.map([{
                    route: '',
                    moduleId: 'viewmodels/welcome',
                    title: 'Welcome',
                    nav: true
                }, {
                    route: 'signup',
                    moduleId: 'viewmodels/signup',
                    nav: true
                }, {
                    route: 'login',
                    moduleId: 'viewmodels/login',
                    title: 'Login',
                    nav: true
                }, {
                    route: 'terms',
                    moduleId: 'viewmodels/terms',
                    title: 'Terms',
                    nav: false
                }, {
                    route: 'privacy',
                    moduleId: 'viewmodels/privacy',
                    title: 'Privacy',
                    nav: false
                }]).buildNavigationModel().mapUnknownRoutes('viewmodels/welcome');
                router.navigate('');


            }



            return router.activate();
        },
        router: router,
        user: ko.observable(),
        pass: ko.observable(),
        userName: ko.observable('')
    };
    return viewModel
});
