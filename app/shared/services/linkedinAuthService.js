(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('linkedinAuth', linkedinAuth);

    linkedinAuth.$inject = ['$rootScope', '$http', 'userService'];
    function linkedinAuth($rootScope, $http, userService) {
        var service = {
            linkedinInit: linkedinInitFn,
            linkedInLogin: linkedInLoginFn
        };

        return service;

        ////////////////
        function linkedinInitFn() {
            if (typeof IN == 'undefined') {
                $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
                    IN.init({
                        api_key: window.LinkedInClientId//'75skq7w7vkbeqs'
                    });                    
                    //IN.Event.on(IN, "auth", onLinkedInLogin);
                });
            }
        }

        function linkedInLoginFn() {
            // $(".loginOverLay").show();
            IN.User.authorize(function () {
                onLinkedInLogin();
            });
            // , function () {
            //     $(".loginOverLay").hide();
            // });
            //IN.UI.Authorize().place();
        }

        function onLinkedInLogin() {
            $(".loginOverLay").show();
            IN.API.Profile("me")
                .fields(["id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "emailAddress"])
                .result(function (profiles) {
                    //console.log(profiles);       
                    var basicprofile = profiles.values[0];
                    //console.log(basicprofile);
                    $rootScope.user.id = basicprofile.id;
                    $rootScope.user.first_name = basicprofile.firstName;
                    $rootScope.user.last_name = basicprofile.lastName;
                    $rootScope.user.email = basicprofile.emailAddress;
                    $rootScope.user.data = basicprofile;
                    $rootScope.user.media = 'in';
                    userService.getUserInfo();
                })
                .error(function (err) {
                    console.log(err);
                    console.log('unable to connecte to Linkedin, try later');
                    $(".loginOverLay").hide();
                    //toastr.error('unable to connecte to Linkedin, try later', 'Error');
                });
        }
    }
})();