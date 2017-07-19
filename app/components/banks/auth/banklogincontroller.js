(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .controller('banklogincontroller', BankLoginController);
    
    BankLoginController.$inject = ['$http', '$scope', '$rootScope', '$window', '$cookies', '$state', 'toastr', 'BankAuthenticationService'];
    function BankLoginController($http, $scope, $rootScope, $window, $cookies, $state, toastr, BankAuthenticationService) {
        $rootScope.titlename = 'Login';
        $scope.email = "";
        $scope.password = "";
        $scope.disableLogin = false;
        
        BankAuthenticationService.Authenticate();
        
        try {
            if ($rootScope.bankGlobals != null && typeof ($rootScope.bankGlobals.currentUser) != 'undefined' &&
                $rootScope.bankGlobals.currentUser.userId != null && $rootScope.bankGlobals.currentUser.userId > 0) {
                $state.go("bankstatus");
            }
        }
        catch (ex) {
        }
        
        $scope.login = function () {
            $scope.disableLogin = true;
            BankAuthenticationService.Login($scope.email, $scope.password)
            .then(function (res) {
                if (res.data.response) {
                    BankAuthenticationService.SetCredentials(res.data.response.userId, res.data.response.bankId, res.data.response.firstName, res.data.response.lastName, res.data.response.email, $scope.password, false, res.data.response.logo);
                    $state.go("bankstatus");
                }
                else {
                    alert("Incorrect email or password", 'Error');
                }
                $scope.disableLogin = false;
            }, function (res) {
                console.log(res);
                alert('Something went wrong, try later.', 'Error');
            });
        }
        
        $scope.getRandomSpan = function () {
            return Math.floor((Math.random() * 1000000000) + 1);
            //return Math.random();
        }
    }
})();