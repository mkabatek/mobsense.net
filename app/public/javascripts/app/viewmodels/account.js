define(['av', 'knockout', 'plugins/router', ], function (av, ko, router) {


    var getAccountInfo = function () {

        $.get("/api/account", function (data) {
            console.log(data)

            if (data.account.local.email == undefined && data.account.local.password == undefined) {
                var locals = {

                    id: data.account._id,
                    email: '',
                    password: ''

                }
                viewModel.local(locals);
                viewModel.countries(data.countries);
                viewModel.name(data.account.local.name);
                viewModel.user(data.account.local.user);
            } else {
                var locals = {

                    id: data.account._id,
                    email: data.account.local.email,
                    password: data.account.local.password

                }
                viewModel.local(locals);
                viewModel.countries(data.countries);
                viewModel.name(data.account.local.name);
                viewModel.email(data.account.local.email);
                viewModel.user(data.account.local.user);
            }


            if (data.account.facebook != undefined) {
                var facebooks = {

                    id: data.account.facebook.id,
                    token: data.account.facebook.token,
                    email: data.account.facebook.email,
                    name: data.account.facebook.name
                }
                viewModel.facebook(facebooks)
            }
            if (data.account.twitter != undefined) {
                var twitters = {

                    id: data.account.twitter.id,
                    token: data.account.twitter.token,
                    username: data.account.twitter.username,
                    displayname: data.account.twitter.displayName

                }
                viewModel.twitter(twitters)
            }
            if (data.account.google != undefined) {
                var googles = {

                    id: data.account.google.id,
                    token: data.account.google.token,
                    email: data.account.google.email,
                    name: data.account.google.name

                }
                viewModel.google(googles)
            }





            var myCountry = data.countries[0];
            for (var i = 0; i < data.countries.length; i++) {
                if (data.countries[i].name == data.account.local.country) {
                    console.log(data.countries[i])
                    myCountry = data.countries[i];
                    viewModel.country(myCountry.name);
                    break;
                }
            }


        });


    }

    var viewModel = {
        activate: function () {




        },
        attached: function (view, parent) {
            var self = this;

            getAccountInfo();
            this.pass('');

        },
        name: ko.observable(),
        email: ko.observable(),
        country: ko.observable(),
        user: ko.observable(),
        pass: ko.observable(),
        countries: ko.observableArray(),
        local: ko.observable(),
        google: ko.observable(),
        facebook: ko.observable(),
        twitter: ko.observable(),
        locallink: function () {
            var av = new AccountValidator();
            //TODO link to google account here
            var options = {
                url: '/connect/local',
                beforeSubmit: function (formData, jqForm, options) {
                    console.log('About to submit new user data');
                    return av.validateForm();
                },
                success: function (responseText, status, xhr, $form) {

                    console.log('Updating account');
                    console.log(responseText);
                    av.showSuccess();
                    getAccountInfo();
                    viewModel.pass('');

                },
                complete: function () {



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
        },
        localunlink: function () {

            //TODO unlink google account here
        },
        googlelink: function () {

            //TODO link to google account here
        },
        googleunlink: function () {

            //TODO unlink google account here
        },
        facebooklink: function () {

            //TODO link to google account here
        },
        facebookunlink: function () {

            //TODO unlink google account here
        },
        twitterlink: function () {

            //TODO link to google account here
        },
        twitterunlink: function () {

            //TODO unlink google account here
        }
    };
    return viewModel
});
