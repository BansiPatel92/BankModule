(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .controller('BankAppDetailController', BankAppDetailController);
    
    BankAppDetailController.$inject = ['$rootScope', '$http', '$scope', '$stateParams', 'BankAuthenticationService','otpService'];
    function BankAppDetailController($rootScope, $http, $scope, $stateParams, BankAuthenticationService,otpService) {
       // console.log("aaaaaaaaaaaaaaaa");
        var bac = this;
        if (BankAuthenticationService.Authenticate()) {
            //getApplicationsByBankIdFunction(-1);
        }
        // console.log("----------------",$stateParams);
        $rootScope.titlename = 'Application Detail';
        $scope.name = 'Application Detail Page : ' + $stateParams.id;
        $scope.appid = $stateParams.id;
        $scope.loanRepaymentPercentage = 60;
        bac.rateOfInterest = 0.0;
        $scope.tenure = 0;
        $scope.WorkExperience = "";
        $scope.sliderLoanOptions = {
            floor: 0,
            ceil: 10000000,
            step: 10000
        }
        $scope.sliderTenureOptions = {
            floor: 1,
            ceil: 240,
            step: 1
        }
        
        $scope.totalInterest = 0;
        $scope.interest = 0;
        bac.processingFeesPercentage = 0;
        $scope.processingFees = 0;
        
        $scope.labelsEMI = ["Loan Amount", "Total Interest Due", "Processing Fee"];
        $scope.dataEMI = [300, 500, 100];
        $scope.coloursEMI = ['#F1A334', '#02C8A5', '#FF3334'];
        
        /*Calculation Related to EMI Table*/
        $scope.Amortizations = [];
        $scope.totalInterestPayable = 0;
        $scope.totalPrincipal = 0;
        $scope.totalAmortization = 0;
        
        $scope.PaymentModeInMonths = 1; // monthly
        
        $scope.appDetail = {};
        $scope.appDocuments = {};
        $scope.appAnswers = {};
        $scope.appSalary = {};
        $scope.appStatements = {};
        
        $scope.labels = ["Avg. Monthly Salary Earned", "Avg. Monthly Expenses", "Total Monthly EMI(s)"];
        $scope.data = [$scope.appSalaryEarned, $scope.appExpenses, $scope.appTotalEMIs];
        $scope.colours = ['#F1A334', '#02C8A5', '#FF3334'];
        
        $scope.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        $scope.sendWarningEmail = function(){
            alert(0);
            var subject = document.getElementById('subject1').value;
            var email = document.getElementById('email1').value;
            var message = document.getElementById('message1').value;
            alert(subject,email,message);
            
            console.log(subject,email,message);
            otpService.genInContactToRupeefin(0, subject, email, message, function (params) {
                console.log(params);
                if (params == true) {
                    alert('EmailSent');
                    $('#sendWarningEmail').modal('hide');
                    
                        
                } else {
                    alert(params, 'Error');
                }
            });
        }
        
        $scope.SendSmsToUser = function(){
            var params = {};
            var mobile = document.getElementById('mobile').value;
            var message = document.getElementById('message').value;
            console.log(mobile,message);
            
            params.mobile = mobile;
            params.message = message;
            params.applicationId = $scope.appDetail.applicationId;
            params.statusId = 2;
            console.log(params);

             var req = {
                    method: 'POST',
                    url: window.ServiceBaseUrl + 'sms',
                    data: params,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }
            // var statusParams = {};
            //     statusParams.applicationId = $scope.appDetail.applicationId;
            //     statusParams.statusId = 2;
            return $http(req).then(function (res) {
                console.log("xxxxxxxxxxxxxxxxxxxx",res,res.data.result);
                if (res.data.result == true) {
                    // alert("success");
                    //  $http.post(window.ServiceBaseUrl + 'applications/updatestatus', statusParams).success(function (res) {
                    //     console.log("ressss",res);
                    //     if(res){
                    //         alert(res.responseMessage);
                    //         document.getElementById('mobile').value = "";
                    //         document.getElementById('message').value = "";
                    //         $('#varify').modal('hide');
                    //         document.getElementById("btn1_verified").disabled = true;
                    //     }
                    // });
                    alert(res.data.responseMessage);
                    document.getElementById('mobile').value = "";
                    document.getElementById('message').value = "";
                    $('#varify').modal('hide');
                    $("[data-dismiss=modal]").trigger({ type: "click" });
                    document.getElementById("btn1_verified").disabled = true;
                    
                    // alert("SMS sent!");
                }else{
                    // alert(res.data.responseMessage);
                }
            }, function (res) {
              //alert(res.data.responseMessage);
               
            });
        }
        function getApplicationDetail(appid) {
            //http://localhost:8000/api/applications/detail?app_numb=8346794
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'applications/detail?app_numb=' + appid,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            console.log(req);
            $http(req).then(function (res) {
                if (res.data.result) {
                    console.log(res.data.response);
                    $scope.appDetail = res.data.response;
                    $scope.appDocuments = res.data.response.documents;
                    // console.log("aaaaaaaaaa detail",$scope.appDetail);
                    // console.log(" $scope.documents====", $scope.appDocuments);                 
                    if ($scope.appDocuments != null && $scope.appDocuments.length > 0) {
                        
                        var doctype1 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 1; });
                        var doctype2 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 2; });
                        var doctype3 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 3; });
                        var doctype4 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 4; });
                        var doctype5 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 5; });
                        var doctype6 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 6; });
                        var doctype7 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 7; });
                        var doctype8 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 8; });
                        var doctype9 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 9; });
                        var doctype10 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 10; });
                        var doctype11 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 11; });
                        var doctype12 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 12; });
                        var doctype13 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 13; });
                        var doctype14 = $.grep($scope.appDocuments, function (e) { return e.documentTypeId == 14; });
                        
                        var activeDoc = $.grep($scope.appDocuments, function (e) { return (e.documentTypeId == 1 || e.documentTypeId == 10) && e.documentIsActive == 1; })[0];
                        
                        var activeDocProof = $.grep($scope.appDocuments, function (e) { return (e.documentTypeId == 11 || e.documentTypeId == 12 || e.documentTypeId == 13 || e.documentTypeId == 14) && e.documentIsActive == 1; })[0];
                        
                        var activeDocBill = $.grep($scope.appDocuments, function (e) { return (e.documentTypeId == 6 || e.documentTypeId == 7 || e.documentTypeId == 8 || e.documentTypeId == 9) && e.documentIsActive == 1; })[0];
                        
                        if (typeof (activeDoc) != 'undefined') {
                            if (activeDoc.documentTypeId == '1') {
                                $scope.appDocuments = [
                                    { name: "Form-16", documents: doctype1 },
                                    { name: "Income Tex Return", documents: doctype10 }
                                ];
                            } else {
                                $scope.appDocuments = [
                                    { name: "Income Tex Return", documents: doctype10 },
                                    { name: "Form-16", documents: doctype1 }
                                ];
                            }
                        } else {
                            $scope.appDocuments = [
                                { name: "Form-16", documents: doctype1 },
                                { name: "Income Tex Return", documents: doctype10 }
                            ];
                        }
                        
                        $scope.appDocuments.push({ name: "Salary Slip", documents: doctype2 }, { name: "Bank Statement", documents: doctype3 }, { name: "PAN", documents: doctype4 }, { name: "Aadhar", documents: doctype5 });
                        
                        if (typeof (activeDocProof) != 'undefined') {
                            if (activeDocProof.documentTypeId == '11') {
                                $scope.appDocuments.push(
                                    { name: "Driving license", documents: doctype11 },
                                    { name: "Voter Id", documents: doctype12 },
                                    { name: "Passport", documents: doctype13 },
                                    { name: "Aadhar Card", documents: doctype14 }
                                );
                            } else if (activeDocProof.documentTypeId == '12') {
                                $scope.appDocuments.push(
                                    { name: "Voter Id", documents: doctype12 },
                                    { name: "Driving license", documents: doctype11 },
                                    { name: "Passport", documents: doctype13 },
                                    { name: "Aadhar Card", documents: doctype14 }
                                );
                            } else if (activeDocProof.documentTypeId == '13') {
                                $scope.appDocuments.push(
                                    { name: "Passport", documents: doctype13 },
                                    { name: "Driving license", documents: doctype11 },
                                    { name: "Voter Id", documents: doctype12 },
                                    { name: "Aadhar Card", documents: doctype14 }
                                );
                            } else if (activeDocProof.documentTypeId == '14') {
                                $scope.appDocuments.push(
                                    { name: "Aadhar Card", documents: doctype14 },
                                    { name: "Driving license", documents: doctype11 },
                                    { name: "Voter Id", documents: doctype12 },
                                    { name: "Passport", documents: doctype13 }
                                );
                            }
                        }
                        else {
                            $scope.appDocuments.push(
                                { name: "Driving license", documents: doctype11 },
                                { name: "Voter Id", documents: doctype12 },
                                { name: "Passport", documents: doctype13 },
                                { name: "Aadhar Card", documents: doctype14 }
                            );
                        }
                        
                        if (typeof (activeDocBill) != 'undefined') {
                            if (activeDocBill.documentTypeId == '6') {
                                $scope.appDocuments.push(
                                    { name: "Landline", documents: doctype6 },
                                    { name: "PostPaid Mobile Bill", documents: doctype7 },
                                    { name: "Electricity Bill", documents: doctype8 },
                                    { name: "Municipal Tax Bill", documents: doctype9 }
                                );
                            } else if (activeDocBill.documentTypeId == '7') {
                                $scope.appDocuments.push(
                                    { name: "PostPaid Mobile Bill", documents: doctype7 },
                                    { name: "Landline", documents: doctype6 },
                                    { name: "Electricity Bill", documents: doctype8 },
                                    { name: "Municipal Tax Bill", documents: doctype9 }
                                );
                            } else if (activeDocBill.documentTypeId == '8') {
                                $scope.appDocuments.push(
                                    { name: "Electricity Bill", documents: doctype8 },
                                    { name: "Landline", documents: doctype6 },
                                    { name: "PostPaid Mobile Bill", documents: doctype7 },
                                    { name: "Municipal Tax Bill", documents: doctype9 }
                                );
                            } else if (activeDocBill.documentTypeId == '9') {
                                $scope.appDocuments.push(
                                    { name: "Municipal Tax Bill", documents: doctype9 },
                                    { name: "Landline", documents: doctype6 },
                                    { name: "PostPaid Mobile Bill", documents: doctype7 },
                                    { name: "Electricity Bill", documents: doctype8 }
                                );
                            }
                        } else {
                            $scope.appDocuments.push(
                                { name: "Landline", documents: doctype6 },
                                { name: "PostPaid Mobile Bill", documents: doctype7 },
                                { name: "Electricity Bill", documents: doctype8 },
                                { name: "Municipal Tax Bill", documents: doctype9 }
                            );
                        }
                    }else{
                        
                    }
                    
                    $scope.appAnswers = res.data.response.answers;
                   
                    $scope.ContactArray = [];
                    $scope.LoanArray =[];
                    $scope.CompanyArray =[];
                    $scope.EducateArray = [];
                    
                    for(var i=0;i< $scope.appAnswers.length;i++){
                        var obj={};
                        var ans = Object.keys($scope.appAnswers[i].answers);
                        for(var ans in $scope.appAnswers[i].answers) {
                            var value = $scope.appAnswers[i].answers[ans];
                        }
                        if(ans.indexOf('Gender') != -1 || ans.indexOf('Name') != -1 || ans.indexOf('Email') != -1 ||
                            ans.indexOf('City') != -1 || ans.indexOf('DOB') != -1 || ans.indexOf('Mobile') != -1 ||
                             ans.indexOf('In Current City Since') != -1 || ans.indexOf('At Current Address Since') != -1
                              || ans.indexOf('My Current Address Is') != -1 ||  ans.indexOf('Country') != -1){
                           
                            obj[ans] = value;
                            $scope.ContactArray.push(obj);
                        }else if(ans.indexOf('Loan Purpose') != -1 || ans.indexOf('Intended Loan Amount') != -1 || ans.indexOf('Monthly EMI') != -1
                             || ans.indexOf('Loan Months') != -1){
                            obj[ans] = value;
                            $scope.LoanArray.push(obj);
                        }else if(ans.indexOf('Company') != -1 || ans.indexOf('Monthly Salary') != -1 || 
                            ans.indexOf('Salary Account') != -1 || ans.indexOf('Joining Date') != -1 ){
                            obj[ans] = value;
                            $scope.CompanyArray.push(obj);
                        }else if(ans.indexOf('Course') != -1 || ans.indexOf('Course of Study') != -1 || ans.indexOf('Expected course expenses') != -1
                             || ans.indexOf('Course duration') != -1 || ans.indexOf('Relationship with student') != -1 || ans.indexOf('Type of employment') != -1 
                             || ans.indexOf('Net monthly income') != -1 || ans.indexOf('Address of co-borrower') != -1 || ans.indexOf('Provide collateral') != -1){
                            obj[ans] = value;
                            $scope.EducateArray.push(obj);
                        }  
                    }

                    if ($scope.appDetail.loanType == 'Personal Loan') {
                        var experience = $.grep($scope.appAnswers, function (e) { return e.questionId == 9; })[0];
                        
                        if (experience.answers['Year'] && experience.answers['Month'])
                            $scope.WorkExperience = experience.answers['Year'] + " years " + experience.answers['Month'] + " Months";
                    }
                    
                    $scope.appSalary = res.data.response.salary;
                    $scope.appStatements = res.data.response.banksStatement;
                    $scope.appSalaryEarned = res.data.response.avgSalaryEarned;
                    $scope.appTotalEMIs = res.data.response.totalEMIs;
                    $scope.appExpenses = res.data.response.avgExpenses;
                    bac.rateOfInterest = res.data.response.rateOfInterest;
                    $scope.tenure = res.data.response.loanTenure;
                    
                    $scope.labels = ["Avg. Monthly Salary Earned", "Avg. Monthly Expenses", "Total Monthly EMI(s)"];
                    $scope.data = [$scope.appSalaryEarned, $scope.appExpenses, $scope.appTotalEMIs];
                    $scope.colours = ['#F1A334', '#02C8A5', '#FF3334'];
                    
                    
                    /*
                    $scope.appSalaryEarned = 50000;
                    bac.rateOfInterest = 12;
                    $scope.tenure = 6;
                    $scope.loanRepaymentPercentage = 60;
                    $scope.appTotalEMIs = 12000;
                    */

                    $scope.calculateLoanEligibility();

                }
                else {

                }
            }, function (res) {
                console.log(res);
            });
        }
        
        $scope.loanTenureChanged = function () {
            $scope.$apply(function () {
                $scope.calculateEMI();
            });
        }
        
        getApplicationDetail($scope.appid);
        

    $scope.SendEmailToUser = function(){
        var phoneNo = document.getElementById('mobile');
         var message = document.getElementById('message');
         var alphaExp = /^[a-zA-Z]/;
        if (phoneNo.value == "" || phoneNo.value == null) {
            alert("Please enter your Mobile No.");
            return false;
        }
        if (phoneNo.value.length < 10 || phoneNo.value.length > 10) {
            alert("Mobile No. is not valid, Please Enter 10 Digit Mobile No.");
            return false;
        }
        if (message.value == "" || message.value == null) {
            alert("Please enter your Message.");
            return false;
        }
        if (!message.value.match(alphaExp)) {
             alert("Numbers are Not Allowed in Message!.");
            return false;
        }
        var params = {};
        var mobile = document.getElementById('mobile').value;
        var message = document.getElementById('message').value;
        console.log(mobile,message);
        
        params.mobile = mobile;
        params.message = message;
        console.log(params);

         var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'sms',
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
        
        return $http(req).then(function (res) {
            console.log(res);
            if (res.data.result == "true") {
                document.getElementById('mobile').value = "";
                document.getElementById('message').value = "";
                alert("SMS sent!");
            }
        }, function (res) {
           alert("SMS sent!");
        });
    }
    
        $scope.tabchange = function (eleid) {
            $('#' + eleid).addClass('active');
            $('#' + eleid).siblings().removeClass('in active');
            setTimeout(function () {
                $('#' + eleid).addClass('in');
            }, 100);
        }
        
        $scope.calculateLoanEligibility = function () {
            
            $scope.tenureInYears = $scope.tenure;// / 12;
            
            //$scope.tenureInYears = $scope.tenure / 12;
            var n1 = ((bac.rateOfInterest / 1200) / (1 - 1 / Math.pow((1 + bac.rateOfInterest / 1200), ($scope.tenure))));
            $scope.eligibleLoanAmnt = Math.round((parseFloat($scope.appSalaryEarned) * (parseFloat($scope.loanRepaymentPercentage) / parseFloat(100)) - parseFloat($scope.appTotalEMIs)) / parseFloat(n1));
            //console.log($scope.eligibleLoanAmnt + " Elligible Loan Amount");
            $scope.eligibleLoanAmnt = $scope.eligibleLoanAmnt < 1 ? 0 : $scope.eligibleLoanAmnt;
            
            
            
            $scope.interest = bac.rateOfInterest;
            $scope.interest = $scope.interest / (parseFloat(12) * parseFloat(100));
            
            var processingFees = bac.processingFeesPercentage;
            processingFees = Math.round(processingFees * $scope.eligibleLoanAmnt * 0.01);
            
            var totalInterest = Math.round((($scope.eligibleLoanAmnt * $scope.interest / (1 - (Math.pow(1 / (1 + $scope.interest), $scope.tenure)))) * $scope.tenure) - $scope.eligibleLoanAmnt);
            
            $scope.emi = Math.round($scope.eligibleLoanAmnt * $scope.interest / (1 - (Math.pow(1 / (1 + $scope.interest), $scope.tenure))));
            
            $scope.showProcessedData = true;
            $scope.labelsEMI = ["Loan Amount", "Total Interest Due", "Processing Fee"];
            $scope.dataEMI = [$scope.eligibleLoanAmnt, totalInterest, processingFees];
            $scope.coloursEMI = ['#F1A334', '#02C8A5', '#FF3334'];
            
            $scope.totalInterest = totalInterest;
            $scope.processingFees = processingFees;
            
            $scope.CreateAmortizationSchedule();
            $scope.isCalculatedFirstTime = false;
        }
        
        $scope.CreateAmortizationSchedule = function () {
            var amort = $scope.Amortizations = [];
            var pir = $scope.interest;
            
            $scope.amortizationFactor = pir / (1 - (1 / Math.pow(1 + pir, $scope.tenure)));
            
            var ma = $scope.amortizationFactor * $scope.eligibleLoanAmnt;
            
            var prevBalance = $scope.eligibleLoanAmnt;
            var i = 0;
            while (Math.floor(prevBalance) > 0) {
                var interest = pir * prevBalance;
                var principal = ma - interest;
                
                if (principal > prevBalance) {
                    principal = prevBalance;
                }
                var amortization = interest + principal;
                var advancedPayment = 0;
                
                prevBalance = prevBalance - principal - advancedPayment;
                
                var newDate = new Date();
                var nthMonthFromStartDate = new Date(newDate.setMonth(newDate.getMonth() + i));
                
                i += parseInt($scope.PaymentModeInMonths);
                amort.push({
                    MonthNumber: i,
                    AmortizationDate: nthMonthFromStartDate,
                    Interest: interest,
                    Principal: principal,
                    Amortization: amortization,
                    AdvancedPayment: advancedPayment,
                    PrincipalBalance: prevBalance
                });
            }
            
            if (amort.length) {
                $scope.totalInterestPayable =
                    amort
                        .map(function (a) { return a.Interest; })
                        .reduce(function (prev, current) { return prev + current; });
                
                $scope.totalPrincipal =
                    amort
                        .map(function (a) { return a.Principal; })
                        .reduce(function (prev, current) { return prev + current; });
                
                $scope.totalAmortization =
                    amort
                        .map(function (a) { return a.Amortization })
                        .reduce(function (prev, current) { return prev + current; });
            }

        }
        
        $scope.calculateEMI = function () {
            var processingFees = bac.processingFeesPercentage;
            processingFees = Math.round(processingFees * $scope.eligibleLoanAmnt * 0.01);
            $scope.tenureInYears = $scope.tenure;
            
            
            $scope.interest = bac.rateOfInterest;
            $scope.interest = $scope.interest / (parseFloat(12) * parseFloat(100));
            
            var totalInterest = Math.round((($scope.eligibleLoanAmnt * $scope.interest / (1 - (Math.pow(1 / (1 + $scope.interest), $scope.tenure)))) * $scope.tenure) - $scope.eligibleLoanAmnt);
            
            $scope.emi = Math.round($scope.eligibleLoanAmnt * $scope.interest / (1 - (Math.pow(1 / (1 + $scope.interest), $scope.tenure))));
            
            //console.log($scope.emi);
            $scope.showProcessedData = true;
            $scope.labelsEMI = ["Loan Amount", "Total Interest Due", "Processing Fee"];
            $scope.dataEMI = [$scope.eligibleLoanAmnt, totalInterest, processingFees];
            $scope.coloursEMI = ['#F1A334', '#02C8A5', '#FF3334'];
            
            //console.log(processingFees);
            
            $scope.totalInterest = totalInterest;
            $scope.processingFees = processingFees;
            
            $scope.CreateAmortizationSchedule();
        }
        
        $scope.onFinishFn = function (ans, ansparam) {
            $scope.$apply(function () {
                $scope[ansparam] = ans;
            });
            console.log(ansparam);
            console.log($scope[ansparam]);
            if (['eligibleLoanAmnt', 'tenure'].indexOf(ansparam) > -1)
                $scope.loanTenureChanged();
        }
        
        //tableToExcel('emitable', 'Export Data', 'excel');
        $scope.tableToExcel = (function () {
            var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name, type) {
                var uri = 'data:application/vnd.ms-' + type + ';filename=EMIcalculation.xls;base64,';
                
                if (!table.nodeType) table = document.getElementById(table)
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML.replace(/₹/gi, '&#8377;').replace(/¥/gi, '&yen;').replace(/£/gi, '&pound;') }//.replace(/د.إ/gi, '&#x62f;&#x2e;&#x625;')
                window.location.href = uri + base64(format(template, ctx))
            }
        })()
        //var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }//.replace(/₹/gi, '&#8377;')
    }
})();