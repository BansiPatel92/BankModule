(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('userService', userService);

    userService.$inject = ['$rootScope', '$http', '$state', '$cookies', 'toastr', 'handleResponseService', 'AuthenticationService', '$window'];
    function userService($rootScope, $http, $state, $cookies, toastr, handleResponseService, AuthenticationService, $window) {
        var service = {
            validateData: validateDataFn,
            getUserInfo: getUserInfoFn,
            getUserById: getUserByIdFn,
            getUsersAppDetails: getUsersAppDetailsFn,
            updateUserData: updateUserDataFn,
            changeUserPWD: changeUserPWDFn,
            changeUserImage: changeUserImageFn
        };

        return service;

        ////////////////
        function validateDataFn() {
            var invalid = [];
            // if (!$rootScope.user.first_name || $rootScope.user.first_name.trim() == '') {
            //     invalid.push('first_name');
            // }
            // if (!$rootScope.user.last_name || $rootScope.user.last_name.trim() == '') {
            //     invalid.push('last_name');
            // }
            if (!$rootScope.user.email || $rootScope.user.email.trim() == '') {
                invalid.push('email');
            }
            if (!$rootScope.user.password || $rootScope.user.password.trim() == '') {
                invalid.push('password');
            }
            //console.log(invalid);
            if (invalid.length > 0) {
                //$state.go('signup');
                $rootScope.onSignUpClick();
                // $(".loginOverLay").hide();
            }
            else
                setUserInfo()
        }

        function setUserInfo() {

            var params = {};
            params.mid = $rootScope.user.id;
            params.first_name = $rootScope.user.first_name;
            params.last_name = $rootScope.user.last_name;
            if ($rootScope.user.gender)
                params.gender = $rootScope.user.gender;
            else
                params.gender = '';
            params.email = $rootScope.user.email.toLowerCase();
            params.phone = $rootScope.user.phone;

            if (!params.first_name)
                params.first_name = params.email.substring(0, 8);
            //params.mobile = $rootScope.user.mobile;
            params.password = $rootScope.user.password;
            if ($rootScope.user.data)
                params.detail = $rootScope.user.data;
            else
                params.detail = '';
            if ($rootScope.user.otp)
                params.otp = $rootScope.user.otp;
            else
                params.otp = '';
            if ($rootScope.user.media && $rootScope.user.media != 'signup')
                params.media = $rootScope.user.media;
            else
                params.media = '';
            params.user_type = 0;
            params.is_guest = 0;
            if (typeof $cookies.getObject('reviewdata') != 'undefined') {
                $rootScope.reviewdata = $cookies.getObject('reviewdata')
            }
            if (typeof $rootScope.reviewdata != 'undefined' && $rootScope.reviewdata != 'undefined') {
                params.reviewdata = $rootScope.reviewdata;
            }
            // if(params.media == 'twitter'){
            //     params.detail = $rootScope.user.detail;
            // }
            var url = window.ServiceBaseUrl;
            if (params.media && !$rootScope.user.sendotp) {
                url += 'auth/signup'
            } else {
                url += 'auth/signup/otp'
            }

            var req = {
                method: 'POST',
                url: url,
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            $http(req).then(function (res) {

                //$cookies.putObject('user', data.data);
                // if (typeof $rootScope.reviewdata != 'undefined' && $rootScope.reviewdata != 'undefined') {
                //     $state.go('personal-loan.review');
                // } else $state.go('login');
                if (res.data.result && res.data.response) {
                    getUserByIdFn(res.data.response.id, function (data) {
                        if (data) {
                            AuthenticationService.SetCredentials(data.id, data.userType, data.firstName, data.lastName, data.email, params.password, false, data.phone);
                            
                            if ($window.serverdata && Object.keys($window.serverdata).length) {
                                $window.opener.AuthenticateNow($rootScope.globals);
                                window.close();
                            }
                        }
                    })
                } else {
                    toastr.error(res.data.responseMessage, 'Error');
                    $rootScope.user.password = '';
                    $rootScope.user.password_c = '';
                    // console.log($rootScope.user.password);
                    // console.log($rootScope.user.password_c);
                }

            }, function (data) {
                handleResponseService.handleFailureResponse(data);
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function getUserInfoFn() {

            var params = {};
            params.mid = $rootScope.user.id;
            params.first_name = $rootScope.user.first_name;
            params.last_name = $rootScope.user.last_name;
            if ($rootScope.user.gender)
                params.gender = $rootScope.user.gender;
            else
                params.gender = '';
            params.email = $rootScope.user.email;
            if (!params.first_name)
                params.first_name = params.email.substring(0, 8);
            params.mobile = $rootScope.user.mobile;
            params.password = $rootScope.user.password;
            if ($rootScope.user.data)
                params.detail = $rootScope.user.data;
            else
                params.detail = '';
            if ($rootScope.user.otp)
                params.otp = $rootScope.user.otp;
            else
                params.otp = '';
            if ($rootScope.user.media && $rootScope.user.media != 'signup')
                params.media = $rootScope.user.media;
            else
                params.media = '';
            params.user_type = 0;
            params.is_guest = 0;
            //console.log(params);
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'auth/signup/checkuserexists',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                if (!res.data.response)
                    // if ($rootScope.user.media != 'twitter') {
                    //     $rootScope.user.showinputs = 'signup';
                    // } else
                    validateDataFn();
                else {
                    if (res.data.result == true) {
                        if (res.data.response.newsocial) {
                            $rootScope.user.logindata = res.data.response;
                            $rootScope.user.logindata.password = params.password;
                            $rootScope.onSignUpClick();
                        } else {
                            if (res.data.response && res.data.response.id) {
                                AuthenticationService.SetCredentials(res.data.response.id, res.data.response.userType, res.data.response.firstName, res.data.response.lastName, res.data.response.email, params.password, false, res.data.response.phone);
                            } else {
                                toastr.error('Something went wrong, try later.', 'Error');
                            }
                        }
                        if ($window.serverdata && Object.keys($window.serverdata).length) {
                            $window.opener.AuthenticateNow($rootScope.globals);
                            window.close();
                        }
                    } else {
                        toastr.error(res.data.responseMessage, 'Error');
                    }

                }
            }, handleError).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function getUserByIdFn(userId, fn) {
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'users?userId=' + userId,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            $http(req).then(function (res) {
                if (res.data.result) {
                    //return res.data.response;
                    fn(res.data.response);
                } else {
                    fn(null);
                }
            }, function (data) {
                //return null;
                fn(null);
            });
        }

        function getUsersAppDetailsFn(userId) {
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",userId);
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'applications/users/' + userId,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res;
                // if (res.data.result) {
                //     return res.data.response;
                //     //fn(res.data.response);
                // } else {
                //     return res.data.responseMessage;
                //     //fn(null);
                // }
            }, function (res) {
                return res;
                //fn(null);
            });
        }

        function updateUserDataFn(data) {
            var req = {
                method: 'POST',
                data: data,
                url: window.ServiceBaseUrl + 'users/' + data.userId,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res.data;
            }, function (res) {
                return res;
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function changeUserPWDFn(userId, password, newPassword) {
            var data = {}
            data.userId = userId;
            data.password = password;
            data.newPassword = newPassword;

            var req = {
                method: 'POST',
                data: data,
                url: window.ServiceBaseUrl + 'users/' + data.userId + '/password',
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res.data;
            }, function (res) {
                return res;
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function changeUserImageFn(fileData, fileName) {
            var data = {}
            data.userId = $rootScope.bankGlobals.currentUser.userId;
            data.fileData = fileData;
            data.fileName = fileName;
            console.log("zzzzzzzzzzzzzzzzzzzzzzzz",data);
            var req = {
                method: 'POST',
                data: data,
                url: window.ServiceBaseUrl + 'users/' + data.userId + '/image',
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res.data;
            }, function (res) {
                return res;
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        function handleSuccess(data) {
            console.log(data);
        }
        function handleError(data) {
            console.log('error');
            console.log(data);
        }
    }
})();