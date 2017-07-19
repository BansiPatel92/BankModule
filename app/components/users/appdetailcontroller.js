(function () {
    'use strict';
    
    angular
.module('RufeeApp')
.controller('AppDetailController', AppDetailController);
    
    AppDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'ApplicationService', 'AuthenticationService', 'toastr', 'fileUpload', '$http', 'handleResponseService'];
    function AppDetailController($rootScope, $scope, $state, $stateParams, ApplicationService, AuthenticationService, toastr, fileUpload, $http, handleResponseService) {
        $(".loginOverLay").show();
        $rootScope.titlename = 'Application Detail';
        $scope.appDocuments = [];
        
        
        var appDetails = this;
        appDetails.show = false;
        appDetails.DocumentHeader = "Form - 16/Income Tax Return ";
        appDetails.DocumentBillHeader = "BSNL Bill/Telephone Bill/Electricity Bill/Tax Bill ";
        appDetails.DocumentBillType = '6';
        appDetails.DocumentType = '1';
        appDetails.Type = 0;
        
        $scope.Form16OrITRName = '';
        $scope.Form16OrITRFileName = '';
        $scope.SalarySlipName1 = '';
        $scope.SalarySlipFileName1 = '';
        $scope.SalarySlipName2 = '';
        $scope.SalarySlipFileName2 = '';
        $scope.SalarySlipName3 = '';
        $scope.SalarySlipFileName3 = '';
        $scope.BankStatementName = '';
        $scope.BankStatementFileName = '';
        appDetails.PAN = '';
        $scope.Aadhar = '';
        $scope.BillName = '';
        $scope.BillFileName = '';
        
        if (AuthenticationService.Authenticate()) {
            if (typeof ($rootScope.globals) != 'undefined' && $rootScope.globals != null && typeof ($rootScope.globals.currentUser) != 'undefined') {
                if (!$rootScope.globals.currentUser) {
                    $state.go('home');
                }
            } 
            else
                $state.go('home');
        }
        
        $scope.appNumb = $stateParams.appNum;
        $scope.appId = $stateParams.id;
        
        if (!$scope.appNumb || !$scope.appId)
            $state.go('userdashboard');
        
        GetRecords();
        
        $scope.ChangeDocumentType = function (type) {
            appDetails.Type = type;
        }
        $scope.getFileDetails = function (event) {
            
            $('.loginOverLay').show();
            var files = event.target.files;
            if (files) {
                
                if (files.length == 1)
                    [].forEach.call(files, function (item) {
                        $scope.readAndPreview(item, appDetails.Type);
                    });
                else {
                    $('.loginOverLay').hide();
                    toastr.error('Please select proper files.', 'Error');
                }
            }

        };
        $scope.readAndPreview = function (file, type) {
            
            if (/\.(pdf)$/i.test(file.name)) {
                var reader = new FileReader();
                
                reader.addEventListener("load", function (e) {
                    $scope.$apply(function () {
                        if (type != 0) {
                            var filename = guid() + file.name.substring(file.name.lastIndexOf('.'));
                            SaveApplicationDocument(type, file.name, filename, 1, e.target.result);
                        } else {
                            $('.loginOverLay').hide();
                        }

                    });
                }, false);
                
                reader.readAsDataURL(file);
            } else {
                $('.loginOverLay').hide();
                toastr.error('Please upload file in pdf format.', 'Error');
            }
        }
        
        $scope.savePanDetails = function () {
            var isValid = 0;
            var panRegexPattern = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
            
            if (appDetails.PANNumber != '' && typeof (appDetails.PANNumber) != 'undefined' && panRegexPattern.test(appDetails.PANNumber))
                isValid = 1;
            
            if (isValid == 1) {
                $('.loginOverLay').show();
                SaveApplicationDocument(4, appDetails.PANNumber, '', 1, '');
            } else {
                if (appDetails.PANNumber == '' || typeof (appDetails.PANNumber) == 'undefined')
                    toastr.error('Please enter pan number.', 'Required');
                else
                    toastr.error('Please enter valid pan number.', 'Required');
            }
        }
        
        $scope.saveAadharDetails = function () {
            var isValid = 0;
            var aadharRegexPattern = /^\d{12}$/;
            
            if (appDetails.AadharNumber != '' && typeof (appDetails.AadharNumber) != 'undefined' && aadharRegexPattern.test(appDetails.AadharNumber))
                isValid = 1;
            
            if (isValid == 1) {
                $('.loginOverLay').show();
                SaveApplicationDocument(5, appDetails.AadharNumber, '', 1, '');
            } else
                if (appDetails.AadharNumber == '' || typeof (appDetails.AadharNumber) == 'undefined')
                    toastr.error('Please enter aadhar number.', 'Required');
                else
                    toastr.error('Please enter valid aadhar number.', 'Required');
        }
        
        function SaveApplicationDocument(type, name, fileName, isActive, fileData) {
            
            var params = {};
            params.applicationId = $stateParams.id;
            params.documentTypeId = type;
            params.documentName = name;
            params.documentFileName = fileName;
            params.isActive = isActive;
            params.createdOn = new Date();
            params.updatedOn = new Date();
            params.updatedBy = 0;
            params.createdBy = 0;
            params.fileData = fileData;
            params.appNum = $stateParams.appNum;
            
            
            $http.post(window.ServiceBaseUrl + 'loans/adddocument', params).success(function (res) {
                handleResponseService.handleSuccessResponse(res, function (data) {
                    if (res.result) {
                        toastr.success('Data saved successfully.', 'Success');
                        GetRecords();
                    } else
                        $('.loginOverLay').hide();
                });
            })
.error(function (data) {
                handleResponseService.handleFailureResponse(data);
                $('.loginOverLay').hide();
            });
//$('.loginOverLay').hide();
        }
        
        function GetRecords() {
            ApplicationService.getApplicationDetailForUser($scope.appNumb)
            .then(function (res) {
                
                $scope.Form16OrITRName = '';
                $scope.Form16OrITRFileName = '';
                $scope.SalarySlipName1 = '';
                $scope.SalarySlipFileName1 = '';
                $scope.SalarySlipName2 = '';
                $scope.SalarySlipFileName2 = '';
                $scope.SalarySlipName3 = '';
                $scope.SalarySlipFileName3 = '';
                $scope.BankStatementName = '';
                $scope.BankStatementFileName = '';
                appDetails.PAN = '';
                $scope.Aadhar = '';
                $scope.BillName = '';
                $scope.BillFileName = '';
                
                if (res.data.response) {
                    
                    if (typeof (res.data.response.documents) != 'undefined') {
                        appDetails.show = true;
                        $scope.appDocuments = res.data.response.documents;
                        
                        angular.forEach($scope.appDocuments, function (value, key) {
                            
                            switch (value.documentTypeId) {
                                case '1':
                                    if ($scope.Form16OrITRName == '') {
                                        appDetails.DocumentHeader = "Form - 16";
                                        $scope.Form16OrITRName = value.documentName;
                                        $scope.Form16OrITRFileName = value.documentFileName;
                                    }
                                    break;
                                case '10':
                                    if ($scope.Form16OrITRName == '') {
                                        appDetails.DocumentHeader = "Income Tax Return";
                                        $scope.Form16OrITRName = value.documentName;
                                        $scope.Form16OrITRFileName = value.documentFileName;
                                    }
                                    break;
                                case '2':
                                    if ($scope.SalarySlipName1 == '') {
                                        $scope.SalarySlipName1 = value.documentName;
                                        $scope.SalarySlipFileName1 = value.documentFileName;
                                    }
                                    else if ($scope.SalarySlipName2 == '') {
                                        $scope.SalarySlipName2 = value.documentName;
                                        $scope.SalarySlipFileName2 = value.documentFileName;
                                    }
                                    else if ($scope.SalarySlipName3 == '') {
                                        $scope.SalarySlipName3 = value.documentName;
                                        $scope.SalarySlipFileName3 = value.documentFileName;
                                    }
                                    break;
                                case '3':
                                    $scope.BankStatementName = value.documentName;
                                    $scope.BankStatementFileName = value.documentFileName;
                                    break;
                                case '4':
                                    appDetails.PAN = value.documentName;
                                    break;
                                case '5':
                                    $scope.Aadhar = value.documentName;
                                    break;
                                case '6':
                                    if ($scope.BillName == '') {
                                        appDetails.DocumentBillHeader = "BSNL Bill";
                                        $scope.BillName = value.documentName;
                                        $scope.BillFileName = value.documentFileName;
                                    }
                                    break;
                                case '7':
                                    if ($scope.BillName == '') {
                                        appDetails.DocumentBillHeader = "Telephone Bill";
                                        $scope.BillName = value.documentName;
                                        $scope.BillFileName = value.documentFileName;
                                    }
                                    break;
                                case '8':
                                    if ($scope.BillName == '') {
                                        appDetails.DocumentBillHeader = "Electricity Bill";
                                        $scope.BillName = value.documentName;
                                        $scope.BillFileName = value.documentFileName;
                                    }
                                    break;
                                case '9':
                                    if ($scope.BillName == '') {
                                        appDetails.DocumentBillHeader = "Tax Bill";
                                        $scope.BillName = value.documentName;
                                        $scope.BillFileName = value.documentFileName;
                                    }
                                    break;

                            }

                        });
                        $('.loginOverLay').hide();
                    }
                    else {
                        appDetails.show = false;
                        $state.go('loan-documents' , { appNum: $scope.appNumb });
                        $('.loginOverLay').hide();
                    }
                }
                else {
                    appDetails.show = false;
                    $('.loginOverLay').hide();
                    toastr.error("Something went wrong, try later.", 'Error');
                }
            }, function (res) {
                appDetails.show = false;
                $('.loginOverLay').hide();
                toastr.error("Something went wrong, try later.", 'Error');
            })
        }
        
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
.toString(16)
.substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
s4() + '-' + s4() + s4() + s4();
        }
    }
})();