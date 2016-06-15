
define(['lv', 'knockout', 'plugins/router', 'durandal/app', 'jquery.mobile'], function (lv, ko, router, app) {


    app.on("logout", function () {


        data.auth = false;
        $.ajax({
            type: "GET",
            url: "logout",
            beforeSend: function () {},
            complete: function (data) {
                console.log('Log out completed')
                router.reset()
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
                    }

                ]).buildNavigationModel().mapUnknownRoutes('viewmodels/welcome');
            },
            error: function (errormessage) {
                console.log(errormessage)
            }
        });

    });

    return {
        activate: function () {
            app.trigger("logout");
            app.trigger("clear");
            this.email('')
            this.pass('')
        },
        attached: function () {},
        email: ko.observable(),
        pass: ko.observable(),
        submit: function () {
            self = this;
            var lv = new LoginValidator();


            $.ajax({
                type: "POST",
                url: "login",
                data: {
                    email: this.email(),
                    password: this.pass()
                },
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                beforeSend: function () {

                },
                success: function (data) {

                    if (data == false) {
                        lv.validateForm();
                    } else {

                        router.reset();
                        router.map([{
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
                        }]).buildNavigationModel().mapUnknownRoutes('viewmodels/main');;
                        router.navigate('main');


                    }

                },
                error: function (errormessage) {
                    lv.validateForm();


                }
            });




        }
    };
});
