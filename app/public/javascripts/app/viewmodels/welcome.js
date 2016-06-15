
define(['knockout', 'plugins/router', 'durandal/app', 'jquery.mobile', ], function (ko, router, app) {



    $(document).ready(function () {
        $("#myCarousel").swiperight(function () {
            $(this).carousel('prev');
        });
        $("#myCarousel").swipeleft(function () {
            $(this).carousel('next');
        });
    });

    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    app.on("logout", function () {
        $.cookie('user', undefined);
        $.cookie('pass', undefined);
        deleteAllCookies();
    });

    return {
        activate: function () {
            //app.trigger("logout");
        },
        attached: function () {},
        email: ko.observable(),
        pass: ko.observable(),
        submit: function () {
            self = this;
            router.navigate('signup');
            app.trigger('signup', {
                email: self.email,
                pass: self.pass
            })




        }
    };
});
