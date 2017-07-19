(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('googleAuth', googleAuth);

    googleAuth.$inject = ['$rootScope', '$http', 'userService', 'toastr'];
    function googleAuth($rootScope, $http, userService, toastr) {
        var GoogleAuth = null;
        var service = {
            googleInit: googleInitFn,
            onclickGoogleLoginButton: onclickGoogleLoginButtonFn
        };

        return service;

        ////////////////
        function googleInitFn(btnId) {
            //console.log('typeof: ', typeof GoogleAuth)

            if (GoogleAuth == null) {
                // console.log('google in');
                gapi.load('auth2', function () {
                    // Retrieve the singleton for the GoogleAuth library and set up the client.
                    GoogleAuth = gapi.auth2.init({
                        client_id: window.GoogleClientId,
                        cookiepolicy: 'single_host_origin',
                        fetch_basic_profile: true,
                        scope: 'profile'
                    });
                    onclickGoogleLoginButtonFn(GoogleAuth, btnId);
                });
            } else {
                onclickGoogleLoginButtonFn(GoogleAuth, btnId);
                console.log('google out');
            }
        }

        function onclickGoogleLoginButtonFn(GoogleAuth, btnId) {
            GoogleAuth.attachClickHandler(btnId, {
                'scope': 'profile email',
                'fetch_basic_profile': true
            }, googleSigninSuccess, googleSigninFailure);
        }

        function googleSigninSuccess(basicprofile) {
            $(".loginOverLay").show();
            $rootScope.user.id = basicprofile.getId();
            $rootScope.user.first_name = basicprofile.wc.getGivenName();
            $rootScope.user.last_name = basicprofile.wc.getFamilyName();
            $rootScope.user.email = basicprofile.wc.getEmail();
            $rootScope.user.data = basicprofile.wc;
            $rootScope.user.media = 'google';
            userService.getUserInfo();
        }

        function googleSigninFailure(basicprofile) {
            //alert('please try again')
            console.log(basicprofile);
            console.log('unable to connecte to google, try later');
            //toastr.error('unable to connecte to google, try later', 'Error');
        }
    }
})();