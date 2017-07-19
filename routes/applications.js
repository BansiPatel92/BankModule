var express = require('express');
var router = express.Router();
var applications = require('./dal/applications');
var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');
var Excel = require('exceljs');
var path = require('path');
var applicationstatus = require('./dal/applicationstatus');
var mailguns = require('./common/mailgun');
var fs = require('fs');
var totalInterestPayable;
var totalPrincipal;
var totalAmortization;

//Get application details by bank id
router.get('/', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        var query = require('url').parse(req.url, true).query;
        var bankId = query["bankId"];
        var status = query["status"];
        var pageIndex = query["pageIndex"];
        var pageSize = query["pageSize"];
        var sort = query["sort"];
        var direction = query["direction"];

        var sortColumn = "";

        switch (sort) {
            case "applicationNumber":
                sortColumn = "TA.str_application_number";
                break;
            case "userName":
                sortColumn = "TU.str_first_name";
                break;
            case "phone":
                sortColumn = "TU.str_phone";
                break;
            case "loanAmount":
                sortColumn = "TAA.LoanAmount";
                break;
            case "loanPurpose":
                sortColumn = "TAA.LoanPurpose";
                break;
            case "loanType":
                sortColumn = "TL.str_name";
                break;
            case "banksLoans":
                sortColumn = "TB.str_plan_name";
                break;
            case "status":
                sortColumn = "TASM.str_type_name";
                break;
            case "appliedDate":
                sortColumn = "TA.dt_created_on";
                break;
        }

        var app = new applications();
        app.getApplicationsByBankId({ id: bankId, statusId: status, pageIndex: pageIndex, pageSize: pageSize, sort: sortColumn, direction: direction },
            function (err, param) {
                console.log("vvvvvvvvvvvvvvvv",param);
                if (!err) {
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    response.response = param;
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});

//Get application details by application number
router.get('/detail', function (req, res) {
    console.log(",,,,,,,,,,,,",req.query);
    //app_numb
    var response = Object.assign({}, responsejson);
    try {
        if (req.query.app_numb) {
            var app = new applications();
            app.getApplicationDetailByAppNumber({ applicationNumber: req.query.app_numb }, function (err, param) {
                //var response = JSON.parse(JSON.stringify(responsejson));
                if (!err) {
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    response.response = param;
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
        } else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Parameter is/are missing";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        //var response = JSON.parse(JSON.stringify(responsejson));
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});

//Get application details by application number
// router.post('/updatestatus', function (req, res) {
//     console.log("------------",req.body.applicationId);
//     var d = new Date();
//     var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
//         " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';

//     //app_numb
//     var response = Object.assign({}, responsejson);
//     try {
//         var statsParam = {};
//         statsParam.applicationId = req.body.applicationId;
//         statsParam.statusId = req.body.statusId;
//         statsParam.isCurrent = 1;
//         statsParam.updatedOn = datestring;
        
//         // var appstatus = new applicationstatus();
//         // appstatus.addStatus(statsParam, function (err3, param3) {
            
//         //     if (err3) { console.log(err3); }
//         // });

//         if (req.body.applicationId) {
//             var app = new applications();
//             app.setApplicationDetailByAppNumber(statsParam , function (err, param) {
//                 //var response = JSON.parse(JSON.stringify(responsejson));
//                 if (!err) {
//                     response.result = true;
//                     response.responseCode = 201;
//                     response.responseMessage = "Success";
//                     response.response = param;
//                 } else {
//                     response.result = false;
//                     response.responseCode = 500;
//                     response.responseMessage = "Something went wrong, try later";
//                 }
//                 var jsonString = JSON.stringify(response, replacer);
//                 res.send(jsonString);
//             });
//         } else {
//             response.result = false;
//             response.responseCode = 500;
//             response.responseMessage = "Parameter is/are missing";
//             var jsonString = JSON.stringify(response, replacer);
//             res.send(jsonString);
//         }
//     } catch (err) {
//         console.log(err);
//         //var response = JSON.parse(JSON.stringify(responsejson));
//         response.result = false;
//         response.responseCode = 500;
//         response.responseMessage = "Something went wrong, try later";
//         var jsonString = JSON.stringify(response, replacer);
//         res.send(jsonString);
//     }
// });

//Get application details by user id
///api/applications/users/123
router.get('/users/:id', function (req, res) {
    //console.log(req.params);

    var response = Object.assign({}, responsejson);
    try {
        if (req.params.id) {
            var app = new applications();
            app.getAppDetailByUserId({ userId: req.params.id }, function (err, param) {
                //var response = JSON.parse(JSON.stringify(responsejson));
                if (!err) {
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    response.response = param;
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
        } else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Parameter is/are missing";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        //var response = JSON.parse(JSON.stringify(responsejson));
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});

//Get application details by application number for user
router.get('/:appnumb/userdetail', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        if (req.params.appnumb) {
            var app = new applications();
            app.getApplicationDetailByAppNumberForUser({ applicationNumber: req.params.appnumb }, function (err, param) {
                //var response = JSON.parse(JSON.stringify(responsejson));
                if (!err) {
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    response.response = param;
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
        } else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Parameter is/are missing";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        //var response = JSON.parse(JSON.stringify(responsejson));
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});



function SendApplicationSubmissionEmail(email, firstName, applicationNumber, loanType, loanAmount, loanPurpose, applicationURL, loanTenure, estMonthlyEMI) {
    fs.readFile('./email_templates/RupeeFin_Application.html', 'utf8', function (err, filedata) {
        if (err) {
            console.log(err);
        }

        var filepath = path.join(__dirname, './TempUploads/EMICalculations-' + applicationNumber + '.xlsx');

        filedata = filedata.replace('[FIRST_NAME]', firstName);
        filedata = filedata.replace('[APPLICATION_NUMBER]', applicationNumber);
        filedata = filedata.replace('[LOAN_TYPE]', loanType);
        filedata = filedata.replace('[LOAN_AMOUNT]', loanAmount);
        filedata = filedata.replace('[LOAN_PURPOSE]', loanPurpose);
        filedata = filedata.replace('[DOCUMENT_UPLOAD_URL]', applicationURL);
        filedata = filedata.replace('[LOAN_TENURE]', loanTenure);
        filedata = filedata.replace('[EST_MONTHLY_EMI]', estMonthlyEMI);

        var emailData = {
            'to': email,
            'from': 'RupeeFin Notification<no-reply@rupeefin.com>',
            'subject': 'Application submitted successfully',
            'html': filedata,
            'replyTo': 'RupeeFin Notification<no-reply@rupeefin.com>',
            'attachment': filepath
        };

        var mailgun = new mailguns();
        mailgun.sendmail(emailData, function (err, param1) {
            if (err) {
                console.log(err);
            }
            fs.unlink(filepath);
        });
    });
}

function ConvertToINR(input) {
    if ((input && !isNaN(input)) || input == 0) {
        input = Math.round(input);
        var currencySymbol = '₹';
        var result = input.toString().split('.');

        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        if (result.length > 1) {
            output += "." + result[1];
        }
        return currencySymbol + output;
    } else if (input && input.toString() != 'NaN') {
        return 0;
    }
}

var CreateAmortizationSchedule = function (tenure, loanAmount, interest, applicationNumber, fn) {
    var amort = Amortizations = [];
    var pir = interest;

    var amortizationFactor = pir / (1 - (1 / Math.pow(1 + pir, tenure)));

    var ma = amortizationFactor * loanAmount;

    var prevBalance = loanAmount;
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

        i += parseInt(1);
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

    totalInterestPayable =
        amort
            .map(function (a) { return a.Interest; })
            .reduce(function (prev, current) { return prev + current; });

    totalPrincipal =
        amort
            .map(function (a) { return a.Principal; })
            .reduce(function (prev, current) { return prev + current; });

    totalAmortization =
        amort
            .map(function (a) { return a.Amortization })
            .reduce(function (prev, current) { return prev + current; });

    var options = {
        filename: './routes/TempUploads/EMICalculations-' + applicationNumber + '.xlsx',
        useStyles: true,
        useSharedStrings: true
    };
    var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    //var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('EMI Calculations');
    var worksheet = workbook.getWorksheet('EMI Calculations');
    worksheet.columns = [
        { header: 'Month#', key: 'MonthNumber', width: 10 },
        { header: 'Principal Paid(A)', key: 'Principal', width: 25 },
        { header: 'Interest Paid(B)', key: 'Interest', width: 25 },
        { header: 'Total Payment (A+B)', key: 'Amortization', width: 25 },
        { header: 'Balance', key: 'PrincipalBalance', width: 25 }
    ];

    worksheet.getRow(1).font = { bold: true };

    for (i = 2; i < amort.length + 2; i++) {
        var row = worksheet.getRow(i);
        row.getCell(1).value = amort[i - 2].MonthNumber;
        row.getCell(2).value = ConvertToINR(amort[i - 2].Principal);
        row.getCell(3).value = ConvertToINR(amort[i - 2].Interest);
        row.getCell(4).value = ConvertToINR(amort[i - 2].Amortization);
        row.getCell(5).value = ConvertToINR(amort[i - 2].PrincipalBalance);

        worksheet.addRow(row);
    }
    var lastRowIndex = amort.length + 2;
    var row = worksheet.getRow(lastRowIndex);
    row.getCell(1).value = "Total";
    row.getCell(3).value = ConvertToINR(totalInterestPayable);
    row.getCell(4).value = ConvertToINR(totalPrincipal);
    row.getCell(5).value = ConvertToINR(totalAmortization);

    worksheet.addRow(row);

    worksheet.getRow(lastRowIndex).font = { bold: true };

    worksheet.commit();
    workbook.commit();

    fn(amort);
    //var strTable = "";
    //strTable = "<table><thead><tr class='header'><th style='width:10%;'>Month#</th><th>Principal Paid(A)</th><th>Interest Paid( B)</th><th>Total Payment (A+B)</th><th>Balance</th></tr></thead><tbody>";
    //for (i = 0; i < amort.length; i++) {
    //    strTable = strTable + "<tr><td style='width:10%;'>" + amort[i].MonthNumber + "</td><td>" + ConvertToINR(amort[i].Principal) + "</td><td>" + ConvertToINR(amort[i].Interest) + "</td>"
    //    strTable = strTable + "<td>" + ConvertToINR(amort[i].Amortization) + "</td><td>" + ConvertToINR(amort[i].PrincipalBalance) + "</td></tr></tbody>";
    //}
    //strTable = strTable + "<tfooter><tr><td><b>Total</b></td><td></td><td><b>" + ConvertToINR(totalInterestPayable) + "</b></td><td><b>" + ConvertToINR(totalPrincipal) + "</b></td><td><b>" + ConvertToINR(totalAmortization) + "</b></td></tr></tfooter></table>";
    //return strTable;
}

//Send email of application
router.post('/email', function (req, res) {
    var response = Object.assign({}, responsejson);

    try {
        if (req.body.applicationNumber) {
            var app = new applications();
            app.getApplicationDetailByAppNumber({ applicationNumber: req.body.applicationNumber }, function (err, param) {
                if (!err) {
                    var interest = param.rateOfInterest;
                    interest = interest / (parseFloat(12) * parseFloat(100));

                    var totalInterest = Math.round(((param.loanAmount * interest / (1 - (Math.pow(1 / (1 + interest), param.loanTenure)))) * param.loanTenure) - param.loanAmount);
                    var emi = Math.round(param.loanAmount * interest / (1 - (Math.pow(1 / (1 + interest), param.loanTenure))));

                    if (req.body.sendEmail) {
                        SendApplicationSubmissionEmail(req.body.email, req.body.firstName, req.body.applicationNumber, param.loanType, ConvertToINR(param.loanAmount), param.loanPurpose, "http://localhost:3005/#/loans/personal-loan/documents/" + req.body.applicationNumber, param.loanTenure, ConvertToINR(emi));
                        
                        if (req.body.role == 2) {
                            SendApplicationSubmissionEmail(req.body.affiliatorEmail, req.body.name, req.body.applicationNumber, param.loanType, ConvertToINR(param.loanAmount), param.loanPurpose, "http://localhost:3005/#/loans/personal-loan/documents/" + req.body.applicationNumber, param.loanTenure, ConvertToINR(emi));
                        }
                        //SendApplicationSubmissionEmail('tirthak.shah@plutustec.com', req.body.firstName, req.body.applicationNumber, param.loanType, ConvertToINR(param.loanAmount), param.loanPurpose, "http://52.32.30.195/#/loans/personal-loan/documents/" + req.body.applicationNumber, param.loanTenure, ConvertToINR(emi));
                    }
                    else {
                        CreateAmortizationSchedule(param.loanTenure, param.loanAmount, interest, req.body.applicationNumber, function (amort) { });
                    }

                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
        }
        else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Something went wrong, try later";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 400;
        response.message = 'Bad Request.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//Send email for education loan application
router.post('/educationloan/email', function (req, res) {
    var response = Object.assign({}, responsejson);

    try {

        if (req.body.applicationNumber) {
            var app = new applications();
            app.getApplicationDetailByAppNumber({ applicationNumber: req.body.applicationNumber }, function (err, param) {
                if (!err) {
                    var answers = param.answers;

                    var expectedCourseExpenses;
                    var courseLevel;
                    var countryOfStudy;
                    var courseOfstudy;
                    var nameOfUniversity;
                    if (answers) {

                        for (var i = 0; i < answers.length; i++) {
                            if (answers[i].questionId == 21) {
                                expectedCourseExpenses = answers[i].answers["Expected course expenses"];
                            } else if (answers[i].questionId == 17) {
                                courseLevel = answers[i].answers["Course"];
                            }
                            else if (answers[i].questionId == 18) {
                                countryOfStudy = answers[i].answers["Country"];
                            }
                            else if (answers[i].questionId == 19) {
                                courseOfstudy = answers[i].answers["Course of Study"];
                            }
                            else if (answers[i].questionId == 20) {
                                nameOfUniversity = answers[i].answers["Name of university"];
                            }
                        }
                    }

                    fs.readFile('./email_templates/RupeeFin_Education_Loan_Application.html', 'utf8', function (err, filedata) {
                        if (err) {
                            console.log(err);
                        }

                        var userhtml = filedata;
                        var affiliatorhtml = filedata;

                        var message = 'Thank you for submitting an Application to RupeeFin.';
                        userhtml = userhtml.replace('[FIRST_NAME]', req.body.name);
                        userhtml = userhtml.replace('[THANKYOU_MESSAGE]', message);
                        userhtml = userhtml.replace('[APPLICATION_NUMBER]', req.body.applicationNumber);
                        userhtml = userhtml.replace('[LOAN_TYPE]', param.loanType);
                        userhtml = userhtml.replace('[COURSE_OF_STUDY]', courseOfstudy);
                        userhtml = userhtml.replace('[COURSE_LEVEL]', courseLevel);
                        userhtml = userhtml.replace('[COUNTRY_OF_STUDY]', countryOfStudy);
                        userhtml = userhtml.replace('[NAME_OF_UNIVERSITY]', nameOfUniversity);
                        userhtml = userhtml.replace('[EXPECTED_COURSE_EXPENSES]', ConvertToINR(expectedCourseExpenses));

                        //req.body.email = 'meet.shah@plutustec.com';
                        var emailData = {
                            'to': req.body.email,
                            'from': 'RupeeFin Notification<no-reply@rupeefin.com>',
                            'subject': 'Application submitted successfully',
                            'html': userhtml,
                            'replyTo': 'RupeeFin Notification<no-reply@rupeefin.com>'
                        };

                        var mailgun = new mailguns();
                        mailgun.sendmail(emailData, function (err, param1) {
                            if (err) {
                                console.log(err);
                            }
                        });

                        if (req.body.role == 2) {
                            message = 'Thank you for submitting an Application for ' + req.body.name + '.';
                            req.body.email = req.body.affiliatorEmail;
                            affiliatorhtml = affiliatorhtml.replace('[FIRST_NAME]', req.body.firstName);
                            affiliatorhtml = affiliatorhtml.replace('[THANKYOU_MESSAGE]', message);
                            affiliatorhtml = affiliatorhtml.replace('[APPLICATION_NUMBER]', req.body.applicationNumber);
                            affiliatorhtml = affiliatorhtml.replace('[LOAN_TYPE]', param.loanType);
                            affiliatorhtml = affiliatorhtml.replace('[COURSE_OF_STUDY]', courseOfstudy);
                            affiliatorhtml = affiliatorhtml.replace('[COURSE_LEVEL]', courseLevel);
                            affiliatorhtml = affiliatorhtml.replace('[COUNTRY_OF_STUDY]', countryOfStudy);
                            affiliatorhtml = affiliatorhtml.replace('[NAME_OF_UNIVERSITY]', nameOfUniversity);
                            affiliatorhtml = affiliatorhtml.replace('[EXPECTED_COURSE_EXPENSES]', ConvertToINR(expectedCourseExpenses));

                            //req.body.email = 'meet.shah@plutustec.com';
                            var emailData = {
                                'to': req.body.email,
                                'from': 'RupeeFin Notification<no-reply@rupeefin.com>',
                                'subject': 'Application submitted successfully',
                                'html': affiliatorhtml,
                                'replyTo': 'RupeeFin Notification<no-reply@rupeefin.com>'
                            };

                            var mailgun = new mailguns();
                            mailgun.sendmail(emailData, function (err, param1) {
                                if (err) {
                                    console.log(err);
                                }
                            });

                        }

                    });
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                }
            });
        }
        else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Something went wrong, try later";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 400;
        response.message = 'Bad Request.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//Get application details by user id for affiliator
router.get('/affiliator', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        var query = require('url').parse(req.url, true).query;
        var userId = query["userId"];
        var status = query["status"];
        var pageIndex = query["pageIndex"];
        var pageSize = query["pageSize"];
        var sort = query["sort"];
        var direction = query["direction"];

        var sortColumn = "";

        switch (sort) {
            case "applicationNumber":
                sortColumn = "TA.str_application_number";
                break;
            case "userName":
                sortColumn = "TUR.str_first_name";
                break;
            case "loanAmount":
                sortColumn = "TAA.LoanAmount";
                break;
            case "loanPurpose":
                sortColumn = "TAA.LoanPurpose";
                break;
            case "loanType":
                sortColumn = "TL.str_name";
                break;
            case "banksLoans":
                sortColumn = "TB.str_plan_name";
                break;
            case "status":
                sortColumn = "TASM.str_type_name";
                break;
            case "appliedDate":
                sortColumn = "TA.dt_created_on";
                break;
        }

        var app = new applications();
        app.getApplicationsByUserId({ id: userId, statusId: status, pageIndex: pageIndex, pageSize: pageSize, sort: sortColumn, direction: direction },
            function (err, param) {
                if (!err) {
                    response.result = true;
                    response.responseCode = 201;
                    response.responseMessage = "Success";
                    response.response = param;
                } else {
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Something went wrong, try later";
                }
                var jsonString = JSON.stringify(response, replacer);
                res.send(jsonString);
            });
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});

module.exports = router;