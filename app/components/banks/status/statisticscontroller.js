(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .controller('statisticscontroller', StatisticsController);
    
    StatisticsController.$inject = ['$http', '$scope', '$rootScope', '$window', '$cookies', '$state', 'toastr', 'BankAuthenticationService', '$filter'];
    function StatisticsController($http, $scope, $rootScope, $window, $cookies, $state, toastr, BankAuthenticationService, filter) {
        $rootScope.titlename = 'BankStatistics';
        $scope.Applications = [];
        $scope.currentStatus = 1;
        $scope.isIntialLoad = true;
        $scope.tableStateRef;
        $scope.TotalUsers = "";
        // var info= "";
        if (BankAuthenticationService.Authenticate()) {
           
            $scope.callServer = function(tableState) {
                $scope.isLoading = true;
                $scope.tableStateRef = tableState;
                // var pagination = tableState.pagination;
                
                // var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                // var number = pagination.number || 5;  // Number of entries showed per page.
                
                var qBankId = 'bankId= ' + $rootScope.bankGlobals.currentUser.bankId;
                var qStatus = '&status=' + $scope.currentStatus;
                var qPageIndex = '&pageIndex=0';
                var qPageSize = '&pageSize=5';
                var qSort = '&sort='+ 'applicationNumber';
                var qDirection = '&direction=asc';
                
                
                var req = {
                    method: 'GET',
                    async: false,
                    url: window.ServiceBaseUrl + 'applications?' + qBankId + qStatus + qPageIndex + qPageSize + qSort + qDirection, //bankId=' + $rootScope.bankGlobals.currentUser.bankId + '&status=' + $scope.currentStatus + '&pageIndex=' + start + '&pageSize=' + number + "&sort=" + sort,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
                
                $http(req).then(function (res) {
                    alert(res.data.response.totalApplications);
                    $scope.Applications = [];
                    if (res.data.result == 'true') {
                        if (res.data.response.applications) {
                            $scope.Applications = res.data.response.applications;
                            $scope.TotalUsers = res.data.response.totalApplications;
                            // tableState.pagination.numberOfPages = Math.ceil(res.data.response.totalApplications / number);
                        }
                        else{
                            // tableState.pagination.numberOfPages = 1;
                        }
                    }
                    else{
                        // tableState.pagination.numberOfPages = 1;
                    }
                    $scope.isLoading = false;
                    $scope.isIntialLoad = false;
                }, function (data) {
                    console.log("fffffffffffffffffff");
                });
            };
            
            $scope.refreshApplication = function (status) {
                $scope.currentStatus = status;
                // $scope.tableStateRef.pagination.start = 0;
                $scope.callServer($scope.tableStateRef);
            }

            $scope.refreshApplication(-1);
        }
    }

    
})();