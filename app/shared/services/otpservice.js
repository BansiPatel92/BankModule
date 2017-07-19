(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .factory('otpService', otpService);
    
    otpService.$inject = ['$rootScope', '$http', 'toastr'];
    function otpService($rootScope, $http, toastr) {
        var service = {
            sendOTPtoUser: sendOTPtoUserFn,
            sendOTP: sendOTPFn,
            checkOTPandSetPwdUser: checkOTPandSetPwdUserFn,
            reSendOTPtoUser: reSendOTPtoUserFn,
            sendEmailtoRupeefin: sendEmailtoRupeefinFn,
            genInContactToRupeefin: genInContactToRupeefinFn
        };
        
        return service;
        ////////////////
        function sendOTPtoUserFn(userId, email, name, phone, fn) {
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'auth/otp?userId=' + userId + '&email=' + encodeURIComponent(email) + '&name=' + name + "&phone=" + phone,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            return $http(req).then(function (res) {
                if (res.data.result == true)
                    fn(res.data.result);
                else {
                    //toastr.error(res.data.responseMessage, 'Error');
                    fn(res.data.responseMessage);
                }
            }, function (response) {
                console.log(response);
                fn(null);
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function sendEmailtoRupeefinFn(userId, email, name, phone, fn) {
            // console.log("fddddddddddddd",userId,email, name, phone);
             var params = {};
                params.userId = userId;
                //if (email)
                params.email = email;
                params.name = name;
                params.phone = phone;
                console.log("ccccc",params);
                var req = {
                    method: 'POST',
                    url: window.ServiceBaseUrl + 'auth/email',
                    data: params,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
                
                return $http(req).then(function (res) {
                    console.log(res);
                    if (res.data.result == true)
                        fn(res.data.result);
                    else {
                        //toastr.error(res.data.responseMessage, 'Error');
                        fn(res.data.responseMessage);
                    }
                }, function (response) {
                    console.log(response);
                    fn(null);
                }).finally(function () {
                    // called no matter success or failure
                    $(".loginOverLay").hide();
                });
        }
        function genInContactToRupeefinFn(userId, subject,  email, message, fn) {
            console.log(userId, subject,  email, message);
            var params = {};
                params.userId = userId;
                params.subject = subject;
                params.email = email;
                params.message = message;
                // console.log(params);
                // var req = {
                //     method: 'POST',
                //     url: window.ServiceBaseUrl + 'auth/enquiry',
                //     data: params,
                //     contentType: "application/json; charset=utf-8",
                //     dataType: "json"
                // }
                var req = {
                    method: 'GET',
                    url: window.ServiceBaseUrl + 'auth/enquiry?userId=' + userId + '&email=' + encodeURIComponent(email) + '&subject=' + subject + "&message=" + message,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
                return $http(req).then(function (res) {
                    console.log(res);
                    if (res.data.result == true)
                        fn(res.data.result);
                    else {
                        //toastr.error(res.data.responseMessage, 'Error');
                        fn(res.data.responseMessage);
                    }
                }, function (response) {
                    console.log(response);
                    fn(null);
                }).finally(function () {
                    // called no matter success or failure
                    $(".loginOverLay").hide();
                });

        }
        // type == 0 //signup
        // type == 1 //forgot password
        // type == 2 //email change
        function sendOTPFn(type, userId, email, name, phone, fn) {
            var params = {};
            params.userId = userId;
            //if (email)
            params.email = email;
            params.name = name;
            params.type = type;
            params.phone = phone;
            
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'otps',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            return $http(req).then(function (res) {
                if (res.data.result == true)
                    fn(res.data.result);
                else {
                    //toastr.error(res.data.responseMessage, 'Error');
                    fn(res.data.responseMessage);
                }
            }, function (response) {
                console.log(response);
                fn(null);
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }
        
        function checkOTPandSetPwdUserFn(userId, otp, password, fn, email) {
            var params = {};
            params.userId = userId;
            if (email)
                params.email = email;
            params.otp = otp;
            params.password = password;
            
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'auth/otp',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            return $http(req).then(function (res) {
                if (res.data.result == true)
                    fn(res.data);
                else
                    fn(res.data);
            }, function (res) {
                console.log(res);
                fn(null);
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }
        
        function reSendOTPtoUserFn(userId, email, name, phone, fn) {
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'auth/reotp?userId=' + userId + '&email=' + email + '&name=' + name + '&phone=' + phone,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            return $http(req).then(function (response) {
                if (response.data.result == true)
                    fn(response.data.result);
                else
                    fn(null);
            }, function (response) {
                console.log(response);
                fn(null);
            });
        }
    }
})();