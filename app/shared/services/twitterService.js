(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('twitterService', twitterService);

    twitterService.$inject = ['$rootScope', '$http', '$window', '$cookies', 'userService'];
    function twitterService($rootScope, $http, $window, $cookies, userService) {
        var service = {
            twitterGetToken: twitterGetTokenFn,
            twitterGetLogin: twitterGetLoginFn,
            checkTwitterData: checkTwitterDataFn,
            twitterShare: twitterShareFn
        };

        return service;

        function checkTwitterDataFn() {
            if ($window.serverdata && Object.keys($window.serverdata).length) {
                $rootScope.user = $window.serverdata;
                console.log($rootScope.user);
                //$rootScope.user.detail = $rootScope.user.detail.detail;
                //userService.validateData();
                //$window.serverdata = {};
                // if ($rootScope.user.email)
                //     userService.getUserInfo();
                // else
                //     $rootScope.onSignUpClick();
            }
        }

        function twitterGetTokenFn() {
            $http.post('/auth/twitter', $rootScope.twitter)
                .success(function (data) {
                    $rootScope.oauth_token = data.oauth_token;
                    twitterGetLoginFn();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    console.log('unable to connecte to twitter, try later');
                    //toastr.error('unable to connecte to twitter, try later', 'Error');
                });
        }

        function twitterGetLoginFn() {
            if (typeof $rootScope.reviewdata != 'undefined' && $rootScope.reviewdata != 'undefined') {
                console.log($rootScope.reviewdata);
                $cookies.putObject('reviewdata', $rootScope.reviewdata);
            }
            var url = window.TwitterAuthLink + $rootScope.oauth_token;
            window.open(url, "_blank");
        }

        function twitterShareFn(e) {
            var b = "https://twitter.com/intent/tweet?text=" + e;
            var c = 600;
            var a = 300;
            var g = (($(window).height()) - a) / 2; var f = (($(window).width()) - c) / 2;
            var d = "width=" + c + ", height=" + a + ", top=" + g + ", left=" + f + ", scrollbars=no, resizable=yes";
            window.open(b, "_blank", d);
        }
    }
})();