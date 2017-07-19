(function () {
    'use strict';

    angular.module('RufeeApp').factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$state', '$http', '$cookieStore', '$cookies', '$rootScope', '$location', '$window'];
    function AuthenticationService($state, $http, $cookieStore, $cookies, $rootScope, $location, $window) {
        var goHomeStates = ['userdashboard', 'userappdetail', 'loan-documents', 'profile', 'affiliatorsdashboard', 'educationloan-documents'];
        var service = {};

        service.Authenticate = Autenticate;
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.GetCredentials = GetCredentials;
        service.GetRecentApplication = GetRecentApplication;
        service.Base64 = Base64;
        service.GetOtpTransactionInfo = GetOtpTransactionInfo;
        service.SetOtpTransactionInfo = SetOtpTransactionInfo;

        return service;

        ///authenticate user
        function Autenticate() {

            if ($cookieStore.get('bankUserInfo')) {
                $rootScope.bankGlobals = $cookieStore.get('bankUserInfo');
                var req = {
                    method: 'GET',
                    url: window.ServiceBaseUrl + 'users?userId=' + $rootScope.bankGlobals.currentUser.userId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
                $http(req).then(function (res) {
                    //console.info('res.data', res.data)
                    if (res.data.result) {
                        if (res.data.response.id && (res.data.response.isActive == false || res.data.response.isActive == '0')) {
                            ClearCredentials();
                        } else if(!res.data.response.id) {
                            ClearCredentials();
                        }
                    }
                }, function (data) {});
            }

            //if ($window.sessionStorage["userInfo"]) {
            //    var userInfo = JSON.parse($window.sessionStorage["userInfo"]);
            //    $rootScope.globals = userInfo;
            //}

            try {
                if ($rootScope.globals == null || typeof ($rootScope.globals.currentUser) == 'undefined' ||
                    $rootScope.globals.currentUser.userid == null || $rootScope.globals.currentUser.userid <= 0) {
                    ClearCredentials();
                    return false;
                }
                else
                    return true;
            }
            catch (ex) {
                ClearCredentials();
                return false;
            }
        }

        function Login(username, password, callback) {

            var newOnDevice = true;
            if ($cookies.getObject('userDeviceInfo')) {
                var userDeviceInfo = $cookies.getObject('userDeviceInfo');
                newOnDevice = userDeviceInfo.indexOf(username) == -1;
            }

            var params = { email: username.toLowerCase(), password: password, newondevice: newOnDevice };
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'auth/login',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res;
            }, function (res) {
                return res;
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }

        //set session data
        function SetCredentials(userId, role, firstName, lastName, email, password, rememberMe, phone, image) {
            $rootScope.userId = userId;

            $rootScope.globals = {
                currentUser: {
                    userid: userId,
                    email: email,
                    role: role,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    image: image,
                }
            };

            //$window.sessionStorage["userInfo"] = JSON.stringify($rootScope.globals);
            $cookieStore.put('bankUserInfo', $rootScope.globals);

            // var userDeviceInfo = [];
            // if ($cookies.getObject('userDeviceInfo')) {
            //     userDeviceInfo = $cookies.getObject('userDeviceInfo');
            // }
            // userDeviceInfo.push(email);
            // var expireDate = new Date();
            // expireDate.setFullYear(expireDate.getFullYear() + 1);
            // $cookies.putObject('userDeviceInfo', userDeviceInfo, { 'expires': expireDate });

        }

        ///clear session data
        function ClearCredentials() {
            $rootScope.globals = {};
            //$window.sessionStorage["userInfo"] = null;
            $cookieStore.remove('userInfo');

            if (goHomeStates.indexOf($state.current.name) > -1)
                $state.go("bankslogin");

            $rootScope.user = {};
            $rootScope.logedin_user = null;
            $rootScope.user.first_name = '';
            $rootScope.user.last_name = '';
            $rootScope.user.email = '';
            $rootScope.user.mobile = '';
            $rootScope.user.media = '';
            $rootScope.user.gender = '';
            $rootScope.user.password = '';
            $rootScope.user.password_c = '';

            $rootScope.isGuest = 0;
        }

        //get session data
        function GetCredentials(callback) {
            var response;
            if ($rootScope.globals != null && $rootScope.globals.currentUser != null) { response = { success: true, user: $rootScope.globals.currentUser } }
            else { response = { success: false, message: 'User not authenticated' } }
            callback(response);
        }

        function GetRecentApplication(userId) {

            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'users/' + userId + '/recentapplication',
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res;
            }, function (res) {
                return res;
            }).finally(function () {
                // called no matter success or failure
                $(".loginOverLay").hide();
            });
        }
        // TYPE 1 = transaction == 'fpwd'
        // TYPE 2 = transaction == 'signup'
        function GetOtpTransactionInfo(transaction, email) {
            //console.info('otpTransactionInfo', $cookieStore.get('otpTransactionInfo'));
            if ($cookieStore.get('otpTransactionInfo')) {
                var info = $cookieStore.get('otpTransactionInfo');
                if (info[transaction] && info[transaction].length > 0) {
                    //var hours = Math.abs(date1 - date2) / 36e5;
                    //var obj = info[transaction];
                    var aObj = jQuery.grep(info[transaction], function (a) {
                        return a.email == email;
                    });
                    //console.info('aObj', aObj);
                    if (aObj.length > 0) {
                        var obj = aObj[0];
                        obj.created = new Date(obj.created);
                        var hours = Math.abs(new Date() - obj.created) / 36e5;
                        if (hours > 1) {
                            var index = info[transaction].indexOf(obj);
                            info[transaction].splice(index, 1);
                            $cookieStore.put('otpTransactionInfo', info);
                            return null;
                        }
                        else
                            return obj;
                    } else return null;
                } else return null;
            }
        }
        // TYPE 1 = transaction == 'fpwd'
        // TYPE 2 = transaction == 'signup'
        function SetOtpTransactionInfo(transaction, email, otpcount) {

            var info = {};
            if ($cookieStore.get('otpTransactionInfo')) {
                info = $cookieStore.get('otpTransactionInfo');
            }

            var aObj = null;

            //console.info('info', angular.copy(info));

            if (info[transaction] && info[transaction].length > 0) {
                aObj = jQuery.grep(info[transaction], function (a) {
                    return a.email == email;
                });
            }

            if (aObj && aObj.length > 0) {
                var index = info[transaction].indexOf(aObj[0]);
                aObj[0].otpcount = otpcount;
            } else {

                var obj = {};
                obj.email = email;
                obj.otpcount = otpcount;
                obj.created = new Date();

                //console.info('otpTransactionInfo info', angular.copy(info));
                if (!info || info == 'undefined') info = {};
                if (!info[transaction] || info[transaction] == 'undefined') info[transaction] = [];
                info[transaction].push(obj);
            }
            $cookieStore.put('otpTransactionInfo', info);
        }
    }

})();