(function () {
    'use strict';
    
    angular
        .module('RufeeApp', ['datatables'])
        .controller('bankdashboardcontroller', BankDashboardController);
    
    BankDashboardController.$inject = ['$http', '$scope', '$rootScope', '$window', '$cookies', '$state', 'toastr', 'BankAuthenticationService', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function BankDashboardController($http, $scope, $rootScope, $window, $cookies, $state, toastr, BankAuthenticationService, DTOptionsBuilder, DTColumnBuilder) {
        $rootScope.titlename = 'Dashboard';
        $scope.Applications = [];
        $scope.currentStatus = -1;
        
        function getApplicationsByBankIdFunction(status) {
            var req = {
                method: 'GET',
                async: false,
                url: window.ServiceBaseUrl + 'applications?bankId=' + $rootScope.bankGlobals.currentUser.bankId + '&status=' + status,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            $http(req).then(function (res) {
                if (res.data.result) {
                    $scope.Applications = res.data.response;
                }
            }, function (data) {

            });
        }
        
        if (BankAuthenticationService.Authenticate()) {
            getApplicationsByBankIdFunction(-1);
        }
        
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('applicationNumber').withTitle('Application#'),
            DTColumnBuilder.newColumn('userName').withTitle('User Name'),
            DTColumnBuilder.newColumn('loanAmount').withTitle('Loan Amount').withOption('type', 'currency'),
            DTColumnBuilder.newColumn('loanPurpose').withTitle('Loan Purpose'),
            DTColumnBuilder.newColumn('loanType').withTitle('Loan Type'),
            DTColumnBuilder.newColumn('banksLoans').withTitle('Loan Plan Name'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
            DTColumnBuilder.newColumn('appliedDate').withTitle('Applied Date'),
        ];
        
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('processing', true)//for show progress bar
                    .withPaginationType('full_numbers')// for get full pagination options // first / last / prev / next and page numbers
                    .withDisplayLength(10)// Page size
                    .withOption('order', [7, 'desc'])
                    .withOption('bFilter', false)
                    .withOption('language', {
            zeroRecords: 'No application found'
        });

        $scope.refreshApplication = function (status) {
            getApplicationsByBankIdFunction(status);
            $scope.currentStatus = status;
        }
        
        //$scope.dtColumns = $scope.Applications;
        //$scope.dtOptions = DTOptionsBuilder.fromSource($scope.Applications);
        
        //$scope.dtOptions = DTOptionsBuilder.newOptions()
        //            .withOption('ajax', {
        //                url: window.ServiceBaseUrl + 'applications?bankId=' + $rootScope.bankGlobals.currentUser.bankId + '&status=-1',
        //                type: 'POST',
        //                data: function (data, dtInstance) {
        //                    // Modify the data object properties here before being passed to the server
        //                    if (data != null)
        
        //            data["draw"] = 1;
        //        console.log(data);
        //                    if (dtInstance != null)
        //                        console.log(dtInstance);
        //                },
        //                dataSrc: function (res) {
        
        //                    var json = {};
        //                    json['draw'] = 1;
        //                    json['recordsFiltered'] = res.response.length;
        //                    json['recordsTotal'] = res.response.length;
        //                    json['data'] = res.response;
        //                    console.log(json);
        //                    return json.data;
        //                }
        //            }
        //            )
        //            .withOption('processing', false)//for show progress bar
        //            .withPaginationType('full_numbers')// for get full pagination options // first / last / prev / next and page numbers
        //            .withDisplayLength(10)// Page size
        //            .withOption('order', [7, 'desc'])
        //            .withOption('serverSide', true)
        //            .withOption('bFilter', false)
        //            .withOption('language', {
        //    zeroRecords: 'No application found'
        //});
        
        //$scope.dtColumns = [
            //DTColumnBuilder.newColumn('applicationNumber').withTitle('Application#'),
            //DTColumnBuilder.newColumn('userName').withTitle('User Name'),
            //DTColumnBuilder.newColumn('loanAmount').withTitle('Loan Amount').withOption('type', 'currency'),
            //DTColumnBuilder.newColumn('loanPurpose').withTitle('Loan Purpose'),
            //DTColumnBuilder.newColumn('loanType').withTitle('Loan Type'),
            //DTColumnBuilder.newColumn('banksLoans').withTitle('Loan Plan Name'),
            //DTColumnBuilder.newColumn('status').withTitle('Status'),
            //DTColumnBuilder.newColumn('appliedDate').withTitle('Applied Date'),
        //];

        
    }

    
})();