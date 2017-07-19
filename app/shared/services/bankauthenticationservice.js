(function () {
    'use strict';
    
    angular.module('RufeeApp').factory('BankAuthenticationService', BankAuthenticationService);
    
    BankAuthenticationService.$inject = ['$http', '$cookieStore', '$cookies', '$rootScope', '$location', '$state', '$window'];
    function BankAuthenticationService($http, $cookieStore, $cookies, $rootScope, $location, $state, $window) {
        var service = {};
        
        service.Authenticate = Autenticate;
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.GetCredentials = GetCredentials;
        service.Base64 = Base64;
        
        return service;
        
        ///authenticate user
        function Autenticate() {
            if ($cookieStore.get('bankUserInfo')) {
                $rootScope.bankGlobals = $cookieStore.get('bankUserInfo');
            }
            
            //if ($window.sessionStorage["bankUserInfo"]) {
            //    var userInfo = JSON.parse($window.sessionStorage["bankUserInfo"]);
            //    $rootScope.bankGlobals = userInfo;
            //}
            try {
                if ($rootScope.bankGlobals == null || typeof($rootScope.bankGlobals.currentUser) == 'undefined' ||
                $rootScope.bankGlobals.currentUser.userId == null || $rootScope.bankGlobals.currentUser.userId <= 0) {
                    $state.go("bankslogin");
                    return false;
                }
                else
                    return true;
            }
            catch (ex) {
                
                $state.go("bankslogin");
                return false;
            }
        }
        
        function Login(username, password, callback) {
            
            var params = { email: username, password: password };
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'banks/login',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            return $http(req).then(function (res) {
                return res;
            }, function (res) {
                return res;
            });
        }
        
        //set session data
        function SetCredentials(userId, bankId, firstName, lastName, email, password, rememberMe, image) {
            //$rootScope.userId = userId;
            //var authdata = Base64.encode(email + ':' + password);
            $rootScope.bankGlobals = {
                currentUser: {
                    userId: userId,
                    bankId: bankId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    image: image
                }
            };
            
            //$window.sessionStorage["bankUserInfo"] = JSON.stringify($rootScope.bankGlobals);
            $cookieStore.put('bankUserInfo', $rootScope.bankGlobals);
        }
        
        ///clear session data
        function ClearCredentials() {
            $rootScope.bankGlobals = {};
            //$window.sessionStorage["bankUserInfo"] = null;
            $cookieStore.remove('bankUserInfo');
            $state.go("bankslogin");
        }
        
        //get session data
        function GetCredentials(callback) {
            var response;
            if ($rootScope.bankGlobals != null && $rootScope.bankGlobals.currentUser != null) {
                response = { success: true, user: $rootScope.bankGlobals.currentUser }
            }
            else {
                response = { success: false, message: 'User not authenticated' }
            }
            callback(response);
        }
    }

})();