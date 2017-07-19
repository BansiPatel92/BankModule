(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .controller('UserDashboardController', UserDashboardController);
    
    UserDashboardController.$inject = ['$rootScope', '$scope', '$state', 'toastr', 'userService', 'AuthenticationService'];
    function UserDashboardController($rootScope, $scope, $state, toastr, userService, AuthenticationService) {
        $(".loginOverLay").show();
        $rootScope.titlename = 'Dashboard';
        $scope.Applications = [];
        if (AuthenticationService.Authenticate()) { }
        
        userService.getUsersAppDetails($rootScope.globals.currentUser.userid).then(function (res) {
            if (res.data.responseCode) {
                if (res.data.response) {
                    $scope.Applications = res.data.response;
                } else {
                    toastr.info("Application not found.", 'Information');
                }
                $(".loginOverLay").hide();
            } else {
                toastr.error("Something went wrong, try later.", 'Error');
                $(".loginOverLay").hide();
            }
        }, function () {
            toastr.error("Something went wrong, try later.", 'Error');
            $(".loginOverLay").hide();
        })
        
        $scope.RedirectByAppNum = function (appNum, id, doccount) {
            
            if (doccount > 0) {
                $state.go('userappdetail', { appNum: appNum, id: id });
            }
            else {
                $state.go('loan-documents', { appNum: appNum });
            }
        }
    }
})();