(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .controller('bankdashboardcontroller', BankDashboardController)
        .filter('myfilter', function () {
            return function (data, greaterThan, lowerThan) {
                 if (greaterThan != null && lowerThan != null && greaterThan != undefined && lowerThan != undefined) {
                    data = data.filter(function (item) {
                        if (item.appliedDate != null) {
                           var exDate = new Date(item.appliedDate);
                           return exDate > new Date(greaterThan) && exDate < new Date(lowerThan);
                        }
                    });
                }
                return data;
            };
        });
    
    BankDashboardController.$inject = ['$http', '$scope', '$rootScope', '$window', '$cookies', '$state', 'toastr', 'BankAuthenticationService', '$filter'];
    function BankDashboardController($http, $scope, $rootScope, $window, $cookies, $state, toastr, BankAuthenticationService, filter) {
        $rootScope.titlename = 'Dashboard';
        $scope.Applications = [];
        $scope.currentStatus = 1;
        $scope.isIntialLoad = true;
        $scope.tableStateRef;
        // var info= "";
        if (BankAuthenticationService.Authenticate()) {
            $scope.test= function(event,index){
                var appID = $(event.target).closest('tr').find('td:first').text();
                var name =  $(event.target).closest("tr").find('td:eq(1)').text();
                var LoanAmount =  $(event.target).closest("tr").find('td:eq(2)').text();
                var LoanType = $(event.target).closest("tr").find('td:eq(3)').text();
                
               $scope.info = "The User named "+ name +"Having Application ID" + appID + " Needs"+ LoanType +"Of Amount "+ LoanAmount ;
            }

            $scope.callServer = function(tableState) {
                $scope.isLoading = true;
                $scope.tableStateRef = tableState;
                var pagination = tableState.pagination;
                
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 5;  // Number of entries showed per page.
                
                var qBankId = 'bankId= ' + $rootScope.bankGlobals.currentUser.bankId;
                var qStatus = '&status=' + $scope.currentStatus;
                var qPageIndex = '&pageIndex=' + start;
                var qPageSize = '&pageSize=' + number;
                var qSort = '&sort=';
                if (tableState.sort.predicate != null) {
                    qSort = qSort + tableState.sort.predicate;
                }
                else {
                    qSort = qSort + "appliedDate";
                }
                
                var qDirection = '&direction=';
                if (tableState.sort.reverse != null) {
                    if (tableState.sort.reverse)
                        qDirection = qDirection + "desc";
                    else
                        qDirection = qDirection + "asc";
                }
                else
                    qDirection = qDirection + "desc";
                
                
                var req = {
                    method: 'GET',
                    async: false,
                    url: window.ServiceBaseUrl + 'applications?' + qBankId + qStatus + qPageIndex + qPageSize + qSort + qDirection, //bankId=' + $rootScope.bankGlobals.currentUser.bankId + '&status=' + $scope.currentStatus + '&pageIndex=' + start + '&pageSize=' + number + "&sort=" + sort,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
                
                $http(req).then(function (res) {
                    $scope.Applications = [];
                    if (res.data.result) {
                        if (res.data.response.applications) {
                            $scope.Applications = res.data.response.applications;
                            for(var i=0; i < $scope.Applications.length; i++){
                                if($scope.Applications[i].loanType == "Education Loan"){
                                    $scope.Applications[i].loanType = 'EL';
                                }else if($scope.Applications[i].loanType == "Personal Loan"){
                                    $scope.Applications[i].loanType = 'PL';
                                }else{
                                    $scope.Applications[i].loanType = 'HL';
                                }

                                if($scope.Applications[i].status == "Document Upload"){
                                    $scope.Applications[i].status = "DU";
                                }else if($scope.Applications[i].status == "Document Verification"){
                                    $scope.Applications[i].status = "DV";
                                }else{
                                    $scope.Applications[i].status = "DR";
                                }
                            }
                            tableState.pagination.numberOfPages = Math.ceil(res.data.response.totalApplications / number);
                        }
                        else
                            tableState.pagination.numberOfPages = 1;
                    }
                    else
                        tableState.pagination.numberOfPages = 1;
                    $scope.isLoading = false;
                    $scope.isIntialLoad = false;
                }, function (data) {

                });
            
            };
            
            $scope.refreshApplication = function (status) {
                $scope.currentStatus = status;
                $scope.tableStateRef.pagination.start = 0;
                $scope.callServer($scope.tableStateRef);
            }
            // $('#reservation').daterangepicker({format: 'DD-MM-YYYY'});

            // $('#daterange-btn').daterangepicker(
            //             {
            //                 ranges: {
            //                     'Today': [moment(), moment()],
            //                     'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            //                     'Last 7 Days': [moment().subtract('days', 6), moment()],
            //                     'Last 30 Days': [moment().subtract('days', 29), moment()],
            //                     'This Month': [moment().startOf('month'), moment().endOf('month')],
            //                     'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            //                 },
            //                 startDate: moment().subtract('days', 29),
            //                 endDate: moment()
            //             },
            //     function(start, end) {
            //         $('#Applications').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
            //     }
            //     );
    }
    }

    
})();