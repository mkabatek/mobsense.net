define(['av', 'knockout', 'plugins/router', 'durandal/app'], function (av, ko, router, app) {


    var viewModel = {
        activate: function () {


        },
        attached: function (view, parent) {

            //when DOM is loaded get the country list
            //and bind the countries
            //clear all other variables

            var self = this;
            $.get("/get-countries", function (data) {
                self.countries(data.countries);

            });


            app.on('signup', function (data) {
                self.email(data.email());
                self.pass(data.pass());
            });

            app.on('clear', function () {
                self.name('');
                self.email('');
                self.user('');
                self.pass('');
            });


        },
        name: ko.observable(),
        email: ko.observable(),
        country: ko.observable(),
        countries: ko.observableArray(),
        user: ko.observable(),
        pass: ko.observable(),
        signup: function () {
            var self = this;

            //when create account clicked submit post form data 
            var self = this;
            var av = new AccountValidator();


            var options = {
                url: 'signup',
                beforeSubmit: function (formData, jqForm, options) {
                    console.log('About to submit new user data');
                    return av.validateForm();
                },
                success: function (responseText, status, xhr, $form) {
                    //if (status == 'success') $('.modal-alert').modal('show');
                    console.log('creating account');
                    console.log(responseText)


                    if (responseText == 'email-taken') {
                        av.showInvalidEmail();
                    } else if (responseText == 'username-taken') {
                        av.showInvalidUserName();
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
                error: function (e) {
                    if (e.responseText == 'username-taken') {
                        av.showInvalidUserName();
                    } else if (e.responseText == 'email-taken') {
                        av.showInvalidEmail();
                    } else {
                        console.log('error creating account')
                        console.log(e.responseText)
                        av.showInvalidEmail('Error creating account!');
                    }


                }
            }
            $('#account-form').ajaxForm(options);
            $('#account-form').ajaxSubmit(options);

        }
    };
    return viewModel
});
