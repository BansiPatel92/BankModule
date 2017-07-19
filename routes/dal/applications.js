var method = applications.prototype;

function applicationData() {
    this.totalApplications = 0;
    this.applications = [];
}

function applications() {
    this.applicationId = 0;
    this.applicationNumber = "";
    this.userId = "";
    this.userName = "";
    this.loanTypeId = 0;
    this.loanType = "";
    this.banksLoansId = 0;
    this.banksLoans = "";
    this.loanAmount = 0.0;
    this.loanPurpose = "";
    this.answers = [];
    this.documents = [];
    this.documentsCount = 0;
    this.salary = [];
    this.banksStatement = [];
    this.avgSalaryEarned = 0;
    this.totalEMIs = 0;
    this.avgExpenses = 0;
    this.loanTenure = 0;
    this.rateOfInterest = 0.0;
    this.bankName = '';
    this.status = "";
    this.appliedDate = "";
    this.monthlySalary = 0;
}

function applicationAnswers() {
    this.applicationId = 0;
    this.bankQuoteId = 0;
    this.questionId = 0;
    this.questionLabel = 0;
    this.answers = [];
}

function applicationDocuments() {
    this.applicationId = 0;
    this.documentId = 0;
    this.documentTypeId = 0;
    this.documentType = "";
    this.documentName = "";
    this.documentFileName = "";
    this.documentUploadedDate = "";
    this.documentIsActive = "";
}

function applicationSalaryDetails() {
    this.applicationId = 0;
    this.grossSalary = 0;
    this.netSalary = 0;
    this.month = 0;
    this.year = 0;
}

function applicationBankStatement() {
    this.applicationId = 0;
    this.transactionDate = 0;
    this.creditAmount = 0.0;
    this.debitAmount = 0.0;
    this.description = "";
    this.balance = 0.0;
}

method.addApplication = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'insert into tbl_applications ';
        sqlquery += '(str_application_number,int_user_id,int_banks_loans_id,int_loan_type_id,str_ip_address,dec_latitude,dec_longitude,str_device_details,str_geographic_details,int_created_by,int_updated_by,dt_created_on,dt_updated_on) ';
        sqlquery += 'values(:application_number,:user_id,:banks_loans_id,:loan_type_id,:ip_address,:latitude, :longitude, :device_details, :geographic_details, :created_by, :updated_by, :createdOn, :updatedOn)';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {
            if (result.info.affectedRows == 1) {
                fn(null, result.info.insertId);
                cnn.end();
            } else {
                fn(null, 0);
                cnn.end();
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getApplicationDetailByAppNumber = function (data, fn) {
    try {
        var cnn = require('./db');
        prep = cnn.prepare('Select TA.int_id,TA.str_application_number,TA.int_user_id,TU.str_first_name,TU.str_last_name,TA.int_loan_type_id,' +
            'TL.str_name LoanTypeName,TA.int_banks_loans_id, TB.str_plan_name, TB.int_tenure_max ' +
            'from tbl_applications TA inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
            'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
            'inner join tbl_users TU on TA.int_user_id = TU.int_id  ' +
            'where TA.str_application_number = :applicationNumber;' +
            'Select TA.int_id ApplicationId,TAA.int_loan_quotes_id,TAA.int_question_id,TQM.str_question_label,TAA.str_answer from tbl_applications TA ' +
            'inner join tbl_application_answers TAA on TA.int_id = TAA.int_application_id ' +
            'inner join tbl_question_master TQM on TQM.int_id = TAA.int_question_id ' +
            'where TA.str_application_number = :applicationNumber;' +
            'Select TA.int_id ApplicationId,TAD.int_document_type_id,TAD.str_docuement_name, TAD.str_document_file_name, TAD.dt_updated_on, DTM.str_type_name,TAD.int_isactive from tbl_applications TA ' +
            'inner join tbl_application_documents TAD on TA.int_id = TAD.int_application_id ' +
            'inner join tbl_document_type_master DTM on DTM.int_id = TAD.int_document_type_id ' +
            'where TA.str_application_number = :applicationNumber Order by TAD.int_document_type_id,TAD.int_isactive desc,TAD.dt_updated_on;' +
            'Select TA.int_id ApplicationId,TAS.dec_gross_salary,TAS.dec_net_salary,TAS.int_month,TAS.int_year ' +
            'from tbl_applications TA inner join tbl_application_salary_details TAS on TA.int_id = TAS.int_application_id ' +
            'where TA.str_application_number = "7921028"  order by TAS.int_month desc;' +
            'Select TA.int_id ApplicationId,TAB.dt_transaction_date,TAB.dec_amount,TAB.int_iscredit,TAB.str_comment,TAB.dec_balance ' +
            'from tbl_applications TA inner join tbl_application_balance_sheet TAB on TA.int_id = TAB.int_application_id ' +
            'where TA.str_application_number = "7921028" order by TAB.dt_transaction_date desc,TAB.int_id desc;' +
            'Select TBC.int_id,TBC.str_answer,TBC.str_condition,TBC.dec_min_value,TBC.dec_max_value ' +
            'from tbl_applications TA inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
            'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
            'inner join tbl_bank_loans_conditions TBC on TB.int_id = TBC.int_banks_loans_id and TBC.int_condition_type = 1 ' +
            'where TA.str_application_number = :applicationNumber;'
        );
        
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                // console.log("eeeeeeeeeeeeeeeee",rows);
                
                if (rows[0].length > 0) {
                    for (i = 0; i < rows[0].length; i++) {
                        var application = new applications();
                        application.applicationId = rows[0][i].int_id;
                        application.applicationNumber = rows[0][i].str_application_number;
                        application.userId = rows[0][i].int_user_id;
                        application.loanType = rows[0][i].LoanTypeName;
                        application.loanTypeId = rows[0][i].int_loan_type_id;
                        application.banksLoans = rows[0][i].str_plan_name;
                        application.banksLoansId = rows[0][i].int_banks_loans_id;
                        application.userName = rows[0][i].str_first_name + ' ' + rows[0][i].str_last_name;
                        application.loanTenure = rows[0][i].int_tenure_max;
                        
                        //Application Answer List
                        for (i = 0; i < rows[1].length; i++) {
                            var applicationAnswer = new applicationAnswers();
                            applicationAnswer.applicationId = application.applicationId;
                            applicationAnswer.bankQuoteId = rows[1][i].int_loan_quotes_id;
                            applicationAnswer.questionId = rows[1][i].int_question_id;
                            applicationAnswer.questionLabel = rows[1][i].str_question_label;
                            applicationAnswer.answers = JSON.parse(rows[1][i].str_answer);
                            
                            if (applicationAnswer.questionId == 31 || applicationAnswer.questionId == 5) {
                                for (prop in applicationAnswer.answers) {
                                    applicationAnswer.answers[prop] = decodeURIComponent(applicationAnswer.answers[prop]);
                                }
                            }
                            
                            application.answers.push(applicationAnswer);
                            
                            if (applicationAnswer.answers["Loan Purpose"] != null) {
                                application.loanPurpose = applicationAnswer.answers["Loan Purpose"];
                            }
                            if (applicationAnswer.answers["Intended Loan Amount"] != null)
                                application.loanAmount = applicationAnswer.answers["Intended Loan Amount"];
                            
                            if (applicationAnswer.answers["Expected course expenses"] != null)
                                application.loanAmount = applicationAnswer.answers["Expected course expenses"];
                            
                            if (applicationAnswer.answers["Monthly EMI"] != null)
                                application.totalEMIs = applicationAnswer.answers["Monthly EMI"];
                            
                            if (applicationAnswer.answers["Monthly Salary"] != null)
                                application.monthlySalary = applicationAnswer.answers["Monthly Salary"];
                        }
                        //Application Document List
                        for (i = 0; i < rows[2].length; i++) {
                            var applicationDocument = new applicationDocuments();
                            applicationDocument.applicationId = application.applicationId;
                            applicationDocument.documentTypeId = rows[2][i].int_document_type_id;
                            applicationDocument.documentUploadedDate = new Date(rows[2][i].dt_updated_on);
                            applicationDocument.documentType = rows[2][i].str_type_name;
                            applicationDocument.documentIsActive = rows[2][i].int_isactive;
                            
                            //switch (parseInt(rows[2][i].int_document_type_id)) {
                            //    case 1://Form - 16
                            //        applicationDocument.documentType = "Form - 16";
                            //        break;
                            //    case 2://SalarySlip
                            //        applicationDocument.documentType = "Salary Slip";
                            //        break;
                            //    case 3://Bank Statement
                            //        applicationDocument.documentType = "Bank Statement";
                            //        break;
                            //    case 4://PAN
                            //        applicationDocument.documentType = "PAN";
                            //        break;
                            //    case 5://Aadhar
                            //        applicationDocument.documentType = "Aadhar";
                            //        break;
                            //    case 6://BSNL Bill
                            //        applicationDocument.documentType = "BSNL Bill";
                            //        break;
                            //    case 7://Telephone Bill
                            //        applicationDocument.documentType = "Telephone Bill";
                            //        break;
                            //    case 8://Electricity Bill
                            //        applicationDocument.documentType = "Electricity Bill";
                            //        break;
                            //    case 9://Tax Bill
                            //        applicationDocument.documentType = "Tax Bill";
                            //        break;
                            //}
                            
                            applicationDocument.documentName = rows[2][i].str_docuement_name;
                            applicationDocument.documentFileName = rows[2][i].str_document_file_name;
                            
                            application.documents.push(applicationDocument);
                        }
                        //Application Salary Details
                        var avgSalaryEarned = 0;
                        var totalMonths = 0;
                        for (i = 0; i < rows[3].length; i++) {
                            var applicationSalary = new applicationSalaryDetails();
                            applicationSalary.applicationId = application.applicationId;
                            applicationSalary.grossSalary = rows[3][i].dec_gross_salary;
                            applicationSalary.netSalary = rows[3][i].dec_net_salary;
                            applicationSalary.month = rows[3][i].int_month;
                            applicationSalary.year = rows[3][i].int_year;
                            
                            application.salary.push(applicationSalary);
                            
                            avgSalaryEarned = parseFloat(avgSalaryEarned) + parseFloat(applicationSalary.netSalary);
                            totalMonths++;
                        }
                        if (avgSalaryEarned > 0)
                            application.avgSalaryEarned = Math.round(parseFloat(avgSalaryEarned) / parseFloat(totalMonths));
                        
                        //Application Bank Statement
                        var amountDebited = 0.0;
                        var currentMonth = 0;
                        var totalMonths = 1;
                        if (rows[4].length > 0) {
                            currentMonth = new Date(rows[4][0].dt_transaction_date).getMonth();
                            for (i = 0; i < rows[4].length; i++) {
                                var applicationStatement = new applicationBankStatement();
                                applicationStatement.applicationId = application.applicationId;
                                applicationStatement.transactionDate = new Date(rows[4][i].dt_transaction_date);
                                applicationStatement.description = rows[4][i].str_comment;
                                applicationStatement.balance = rows[4][i].dec_balance;
                                
                                if (rows[4][i].int_iscredit == 1)
                                    applicationStatement.creditAmount = rows[4][i].dec_amount;
                                else {
                                    applicationStatement.debitAmount = rows[4][i].dec_amount;
                                    amountDebited = parseFloat(amountDebited) + parseFloat(rows[4][i].dec_amount);
                                }
                                application.banksStatement.push(applicationStatement);
                                
                                
                                
                                try {
                                    if (currentMonth != applicationStatement.transactionDate.getMonth()) {
                                        currentMonth = applicationStatement.transactionDate.getMonth();
                                        totalMonths = totalMonths + 1;
                                    }
                                }
                        catch (ex) {

                                }
                                application.avgExpenses = parseFloat(amountDebited) / parseFloat(totalMonths);
                            }
                        }
                        
                        var rateOfInterest = 0.0;
                        for (i = 0; i < rows[5].length; i++) {
                            switch (rows[5][i].str_condition) {
                                case "<":
                                    if (parseInt(application.loanAmount) < parseInt(rows[5][i].str_answer))
                                        rateOfInterest = rows[5][i].dec_max_value;
                                    break;
                                case ">":
                                    if (parseInt(application.loanAmount) > parseInt(rows[5][i].str_answer))
                                        rateOfInterest = rows[5][i].dec_max_value;
                                    break;
                                case "<=":
                                    if (parseInt(application.loanAmount) <= parseInt(rows[5][i].str_answer))
                                        rateOfInterest = rows[5][i].dec_max_value;
                                    break;
                                case ">=":
                                    if (parseInt(application.loanAmount) >= parseInt(rows[5][i].str_answer))
                                        rateOfInterest = rows[5][i].dec_max_value;
                                    break;
                                case "=":
                                    if (parseInt(application.loanAmount) == parseInt(rows[5][i].str_answer))
                                        rateOfInterest = rows[5][i].dec_max_value;
                                    break;
                            }
                            if (rateOfInterest > 0.0)
                                break;
                        }
                        if (rateOfInterest <= 0.0)
                            rateOfInterest = 12;
                        //application.rateOfInterest = rateOfInterest;
                        application.rateOfInterest = 12.99;
                        fn(null, application);
                    }
                }
                else
                    fn(null, null);
            }
        });

    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.setApplicationDetailByAppNumber = function(data, fn){
    console.log("--------------------------");
    try {
        var cnn = require('./db');
        
        var sqlquery = 'update tbl_applications_status set bit_is_current = 0, dt_updated_on = :updatedOn  Where int_application_id = :applicationId and bit_is_current = 1; ';
        
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {
            
            sqlquery = 'insert into tbl_applications_status(int_application_id,int_status_id,bit_is_current,dt_created_on,dt_updated_on) ';
            sqlquery += 'values(:applicationId,:statusId,:isCurrent,:updatedOn,:updatedOn); ';
            
            var prep = cnn.prepare(sqlquery);
            cnn.query(prep(data)).on("result", function (result) {
                console.log("-----------------rows updated ---------",result.info.affectedRows);
                if (result.info.affectedRows == 1) {
                    fn(null, result.info.insertId);
                    cnn.end();
                } else {
                    fn(null, 0);
                    cnn.end();
                }
            });
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}
method.getApplicationsByBankId = function (data, fn) {
    // console.log("--------------",data);
    try {
        var cnn = require('./db');
        //var prep = cnn.prepare('Select TA.int_id,TA.str_application_number,TA.int_user_id,TU.str_first_name,TU.str_last_name,TA.int_loan_type_id, ' +
        //    'TL.str_name LoanTypeName,TA.int_banks_loans_id, TB.str_plan_name, TASM.str_type_name AS str_status_text, TA.dt_created_on AppliedDate ' +
        //    'from tbl_applications TA inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
        //    'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
        //    'left join tbl_applications_status TAS on TA.int_id = TAS.int_application_id and TAS.bit_is_current =1 ' +
        //    'left join tbl_application_status_master TASM on IFNULL(TAS.int_status_id,1) = TASM.int_id ' +
        //    'inner join tbl_users TU on TA.int_user_id = TU.int_id where TB.int_bank_id = :id and ("-1" = :statusId or IFNULL(TAS.int_status_id,1) = :statusId) Order by TA.dt_created_on desc;' +
        //    'Select TA.int_id ApplicationId,TAA.int_loan_quotes_id,TAA.int_question_id,TAA.str_answer ' +
        //    'from tbl_applications TA ' +
        //    'inner join tbl_application_answers TAA on TA.int_id = TAA.int_application_id ' +
        //    'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
        //    'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
        //    'where TB.int_bank_id = :id;');
        var strSQL = 'Select TA.int_id,TA.str_application_number,TA.int_user_id,TU.str_first_name,TU.str_phone,TU.str_last_name,TA.int_loan_type_id, ' +
                               'TL.str_name LoanTypeName, TA.int_banks_loans_id, TB.str_plan_name, TASM.str_type_name AS str_status_text, ' +
                               'TA.dt_created_on AppliedDate, TAA.* ' +
                               'from tbl_applications TA ' + 
                               'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' + 
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
                               'inner join tbl_users TU on TA.int_user_id = TU.int_id ' +
                               'left join tbl_applications_status TAS on TA.int_id = TAS.int_application_id and TAS.bit_is_current = 1 ' +
                               'left join tbl_application_status_master TASM on IFNULL(TAS.int_status_id, 1) = TASM.int_id ' +
                               'left join(Select TA.int_id ApplicationId, ' +
                               'CAST(MAX(CASE WHEN TAA.str_answer like \'%Intended Loan Amount%\' THEN concat(\'\', REPLACE(REPLACE(TAA.str_answer, \'{ "Intended Loan Amount" : "\', \'\'), \'" }\', \'\') * 1) WHEN TAA.str_answer like \'%Expected course expenses%\' THEN concat(\' \', REPLACE(REPLACE(TAA.str_answer, \'{ "Expected course expenses" : "\', \'\'), \'" }\', \' \') * 1) ELSE 0 END)  AS DECIMAL(12,2)) LoanAmount, ' +
                               'CAST(MAX(CASE WHEN TAA.str_answer like \'%Expected course expenses%\' THEN concat(\'\', REPLACE(REPLACE(TAA.str_answer, \'{ "Expected course expenses" : "\', \'\'), \'" }\', \'\') * 1) ELSE 0 END)  AS DECIMAL(12,2)) ExpectedCourseExpenses, ' +
                               'CASE WHEN TAA.str_answer like \'%Loan Purpose%\' THEN REPLACE(REPLACE(TAA.str_answer, \'{ "Loan Purpose" : "\', \'\'), \'" }\', \'\') ELSE \'\' END LoanPurpose ' + 
                               'from tbl_applications TA ' +
                               'inner join tbl_application_answers TAA on TA.int_id = TAA.int_application_id ' +
                               'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' + 
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' + 
                               'where TB.int_bank_id = ' + data.id + ' and (TAA.str_answer like \'%Intended Loan Amount%\' or TAA.str_answer like \'%Loan Purpose%\' or TAA.str_answer like \'%Expected course expenses%\') ' +
                               'Group by TA.int_id ' +
                               'order by TA.int_id,REPLACE(REPLACE(TAA.str_answer,\'{ "Loan Purpose" : "\',\'\'),\'" }\',\'\') desc ' +
                               ') TAA on TAA.ApplicationId = TA.int_id ' +
                               'where TB.int_bank_id = ' + data.id + ' and ("-1" = ' + data.statusId + ' or IFNULL(TAS.int_status_id,1) = ' + data.statusId + ')  ' +
                               'Order by ' + data.sort + ' ' + data.direction + ' limit ' + data.pageSize + ' offset ' + data.pageIndex + '; ' +
                               'Select COUNT(1) TotalApplications ' +
                               'from tbl_applications TA ' +
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' + 
                               'inner join tbl_users TU on TA.int_user_id = TU.int_id ' + 
                               'left join tbl_applications_status TAS on TA.int_id = TAS.int_application_id and TAS.bit_is_current = 1 ' +
                               'where TB.int_bank_id = ' + data.id + ' and ("-1" = ' + data.statusId + ' or IFNULL(TAS.int_status_id,1) = ' + data.statusId + ');'
        
        // console.log(strSQL);
        
        
        var prep = cnn.prepare(strSQL);
        
        cnn.query(prep(data), function (err, rows) {
            // console.log("1111111111111111111111",rows);
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var applicationList = new applicationData();
                
                for (i = 0; i < rows[0].length; i++) {
                    var application = new applications();
                    application.applicationId = rows[0][i].int_id;
                    application.applicationNumber = rows[0][i].str_application_number;
                    application.userId = rows[0][i].int_user_id;
                    application.loanType = rows[0][i].LoanTypeName;
                    application.loanTypeId = rows[0][i].int_loan_type_id;
                    application.banksLoans = rows[0][i].str_plan_name;
                    application.banksLoansId = rows[0][i].int_banks_loans_id;
                    application.phone = rows[0][i].str_phone;
                    application.userName = rows[0][i].str_first_name + ' ' + rows[0][i].str_last_name;
                    application.status = rows[0][i].str_status_text;
                    application.appliedDate = new Date(rows[0][i].AppliedDate);
                    application.loanPurpose = rows[0][i].LoanPurpose;
                    application.loanAmount = rows[0][i].LoanAmount;
                    
                    if (application.loanType == 'Education Loan') {
                        //application.loanAmount = rows[0][i].ExpectedCourseExpenses;
                        application.loanPurpose = 'N/A';
                    }
                    
                    //console.log(rows[0][i].LoanAmount);
                    
                    if (rows[1] != null && rows[1] != 'undefined') {
                        applicationList.totalApplications = rows[1][0].TotalApplications;
                    }
                    
                    //if (rows[1] != null && rows[1] != 'undefined') {
                    //    var answersFiltered = rows[1].filter(function (el) {
                    //        return el.ApplicationId == application.applicationId
                    //    });
                    
                    //    for (j = 0; j < answersFiltered.length; j++) {
                    //        var applicationAnswer = new applicationAnswers();
                    //        //applicationAnswer.applicationId = application.applicationId;
                    //        //applicationAnswer.bankQuoteId = answersFiltered[j].int_loan_quotes_id;
                    //        //applicationAnswer.questionId = answersFiltered[j].int_question_id;
                    //        applicationAnswer.answers = JSON.parse(answersFiltered[j].str_answer);
                    //        if (answersFiltered[j].int_question_id == 31 || answersFiltered[j].int_question_id == 5) {
                    //            for (prop in applicationAnswer.answers) {
                    //                applicationAnswer.answers[prop] = decodeURIComponent(applicationAnswer.answers[prop]);
                    //            }
                    //        }
                    
                    //        //application.answers.push(applicationAnswer);
                    
                    //        if (applicationAnswer.answers["Loan Purpose"] != null) {
                    //            application.loanPurpose = applicationAnswer.answers["Loan Purpose"];
                    //        }
                    //        if (applicationAnswer.answers["Intended Loan Amount"] != null)
                    //            application.loanAmount = applicationAnswer.answers["Intended Loan Amount"];
                    //    }
                    //}
                    
                    applicationList.applications.push(application);
                }
                fn(null, applicationList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.updateBankLoanDetail = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'update tbl_applications Set int_banks_loans_id = :banks_loans_id,dt_updated_on = :updatedOn, int_created_by= :createdBy Where int_id = :application_id';
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data)).on("result", function (result) {
            if (result.info.affectedRows == 1) {
                fn(null, result.info.insertId);
                cnn.end();
            } else {
                fn(null, 0);
                cnn.end();
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

//users app detail 
method.getAppDetailByUserId = function (data, fn) {
    try {
        //console.log(data);
        var cnn = require('./db');
        var prep = cnn.prepare('Select TA.int_id,TA.str_application_number,B.str_name as BankName,TA.int_loan_type_id,' +
            'TL.str_name LoanTypeName,TA.int_banks_loans_id, TB.str_plan_name, count(ad.int_id) as documentscount,TA.dt_created_on ' +
            'from tbl_applications TA inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
            'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
            'inner join tbl_banks B on B.int_id = TB.int_bank_id ' +
            'inner join tbl_users TU on TA.int_user_id = TU.int_id ' +
            'left join tbl_application_documents ad on ad.int_application_id = TA.int_id and ad.int_isactive = 1 where TA.int_user_id = :userId ' +
            'group by TA.int_id,TA.str_application_number,B.str_name,TA.int_loan_type_id,TL.str_name, TA.int_banks_loans_id, TB.str_plan_name Order by TA.dt_created_on desc; ' +
            'Select TA.int_id ApplicationId,TAA.int_loan_quotes_id,TAA.int_question_id,TAA.str_answer ' +
            'from tbl_applications TA ' +
            'inner join tbl_application_answers TAA on TA.int_id = TAA.int_application_id ' +
            'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' +
            'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
            'where TA.int_user_id = :userId;');
        
        
        var applicationList = [];
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                for (i = 0; i < rows[0].length; i++) {
                    var application = new applications();
                    application.applicationId = rows[0][i].int_id;
                    application.applicationNumber = rows[0][i].str_application_number;
                    application.bankName = rows[0][i].BankName;
                    application.loanType = rows[0][i].LoanTypeName;
                    application.loanTypeId = rows[0][i].int_loan_type_id;
                    application.banksLoans = rows[0][i].str_plan_name;
                    application.banksLoansId = rows[0][i].int_banks_loans_id;
                    application.documentsCount = rows[0][i].documentscount;
                    application.appliedDate = new Date(rows[0][i].dt_created_on);
                    
                    if (rows[1] != null && rows[1] != 'undefined') {
                        var answersFiltered = rows[1].filter(function (el) {
                            return el.ApplicationId == application.applicationId
                        });
                        
                        for (j = 0; j < answersFiltered.length; j++) {
                            var applicationAnswer = new applicationAnswers();
                            applicationAnswer.applicationId = application.applicationId;
                            applicationAnswer.bankQuoteId = answersFiltered[j].int_loan_quotes_id;
                            applicationAnswer.questionId = answersFiltered[j].int_question_id;
                            applicationAnswer.answers = JSON.parse(answersFiltered[j].str_answer);
                            if (answersFiltered[j].int_question_id == 31 || answersFiltered[j].int_question_id == 5) {
                                for (prop in applicationAnswer.answers) {
                                    applicationAnswer.answers[prop] = decodeURIComponent(applicationAnswer.answers[prop]);
                                }
                            }
                            
                            application.answers.push(applicationAnswer);
                            
                            if (applicationAnswer.answers["Loan Purpose"] != null) {
                                application.loanPurpose = applicationAnswer.answers["Loan Purpose"];
                            }
                            if (applicationAnswer.answers["Intended Loan Amount"] != null)
                                application.loanAmount = applicationAnswer.answers["Intended Loan Amount"];

                            if (applicationAnswer.answers["Expected course expenses"] != null)
                                application.loanAmount = applicationAnswer.answers["Expected course expenses"];

                            if (application.loanType == 'Education Loan') {
                                application.loanPurpose = 'N/A';
                            }

                        }
                    }
                    
                    applicationList.push(application);
                }
                fn(null, applicationList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getApplicationDetailByAppNumberForUser = function (data, fn) {
    try {
        var cnn = require('./db');
        prep = cnn.prepare('Select TA.int_id ApplicationId,TAD.int_document_type_id DocumentTypeId,TAD.str_docuement_name DocumentName, TAD.str_document_file_name DocumentFileName,TAD.int_id DocumentId from tbl_applications TA ' +
            'inner join tbl_application_documents TAD on TA.int_id = TAD.int_application_id and TAD.int_isactive = 1 where TA.str_application_number = :applicationNumber Order by TAD.int_document_type_id;');
        
        //prep = cnn.prepare('Select a.int_application_id ApplicationId,DTM.int_id DocumentTypeId, DTM.str_type_name TypeName, a.str_docuement_name DocumentName,a.str_document_file_name DocumentFileName '+
        //'from tbl_document_type_master DTM left join ( Select TAD.int_application_id , TAD.int_document_type_id, TAD.str_docuement_name, TAD.str_document_file_name '+
        //'from tbl_applications TA left join tbl_application_documents TAD on TA.int_id = TAD.int_application_id Where TA.str_application_number = :applicationNumber '+
        //')a on a.int_document_type_id = DTM.int_id');
        
        
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var application = new applications();
                //Application Document List
                for (i = 0; i < rows.length; i++) {
                    var applicationDocument = new applicationDocuments();
                    applicationDocument.applicationId = data.applicationNumber;
                    applicationDocument.documentTypeId = rows[i].DocumentTypeId;
                    applicationDocument.documentId = rows[i].DocumentId;
                    //applicationDocument.documentType = rows[i].TypeName;
                    
                    //switch (parseInt(rows[i].int_document_type_id)) {
                    //    case 1://Form - 16
                    //        applicationDocument.documentType = "Form - 16";
                    //        break;
                    //    case 2://SalarySlip
                    //        applicationDocument.documentType = "Salary Slip";
                    //        break;
                    //    case 3://Bank Statement
                    //        applicationDocument.documentType = "Bank Statement";
                    //        break;
                    //    case 4://PAN
                    //        applicationDocument.documentType = "PAN";
                    //        break;
                    //    case 5://Aadhar
                    //        applicationDocument.documentType = "Aadhar";
                    //        break;
                    //    case 6://BSNL Bill
                    //        applicationDocument.documentType = "BSNL Bill";
                    //        break;
                    //    case 7://Telephone Bill
                    //        applicationDocument.documentType = "Telephone Bill";
                    //        break;
                    //    case 8://Electricity Bill
                    //        applicationDocument.documentType = "Electricity Bill";
                    //        break;
                    //    case 9://Tax Bill
                    //        applicationDocument.documentType = "Tax Bill";
                    //    case 10://ITR
                    //        applicationDocument.documentType = "Income Tax Return";
                    //        break;
                    //}
                    
                    applicationDocument.documentName = rows[i].DocumentName;
                    applicationDocument.documentFileName = rows[i].DocumentFileName;
                    
                    application.documents.push(applicationDocument);
                }
                
                fn(null, application);
            }
        });

    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getBankNameByAppNumber = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'Select TB.str_name,TA.int_id from tbl_applications TA ' +
            'inner join tbl_banks_loans TBL on TA.int_banks_loans_id = TBL.int_id ' +
            'inner join tbl_banks TB on TB.int_id = TBL.int_bank_id ' +
            'Where TA.str_application_number = :applicationNumber;';
        
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var app = new applications();
                
                if (rows.length > 0) {
                    app.bankName = rows[0].str_name;
                    app.applicationId = rows[0].int_id;
                }
                
                fn(null, app);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getRecentApplicationDetails = function (data, fn) {
    try {
        var cnn = require('./db');
        var sqlquery = 'Select TA.int_id,TA.str_application_number,TMP.dt_updated_on,TL.str_name LoanTypeName from ' +
            '( ' +
            'Select distinct int_application_id,dt_updated_on from tbl_application_documents ' +
            'union ' +
            'Select distinct int_id,dt_updated_on from tbl_applications ' +
            'union ' +
            'Select distinct int_id,dt_updated_on from tbl_applications_status ' +
            'union ' +
            'Select distinct int_application_id,dt_updated_on from tbl_application_answers ' +
            'union ' +
            'Select distinct int_application_id,dt_updated_on from tbl_application_balance_sheet ' +
            'union ' +
            'Select distinct int_application_id,dt_updated_on from tbl_application_salary_details ' +
            ')TMP ' +
            'inner join tbl_applications TA on TA.int_id = TMP.int_application_id and int_user_id = :userId and TA.int_banks_loans_id != 0 ' +
            'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' + 
            'Order By TMP.dt_updated_on desc limit 1;';
        
        var prep = cnn.prepare(sqlquery);
        cnn.query(prep(data), function (err, rows) {
            
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var app = new applications();
                
                if (rows.length > 0) {
                    app.applicationId = rows[0].int_id;
                    app.applicationNumber = rows[0].str_application_number;
                    app.loanType = rows[0].LoanTypeName;
                }
                fn(null, app);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getApplicationsByUserId = function (data, fn) {
    try {
        var cnn = require('./db');
        var strSQL = 'Select TA.int_id,TA.str_application_number,TA.int_user_id,TUR.str_first_name,TUR.str_last_name,TA.int_loan_type_id, ' +
                               'TL.str_name LoanTypeName, TA.int_banks_loans_id, TB.str_plan_name, TASM.str_type_name AS str_status_text, ' +
                               'TA.dt_created_on AppliedDate, TAA.* ' +
                               'from tbl_applications TA ' + 
                               'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' + 
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' +
                               'inner join tbl_users TUR on TA.int_user_id = TUR.int_id ' +
                               'inner join tbl_users TU on TA.int_user_id = TU.int_id or TA.int_created_by = TU.int_id ' +
                               'left join tbl_applications_status TAS on TA.int_id = TAS.int_application_id and TAS.bit_is_current = 1 ' +
                               'left join tbl_application_status_master TASM on IFNULL(TAS.int_status_id, 1) = TASM.int_id ' +
                               'left join(Select TA.int_id ApplicationId, ' +
                               'CAST(MAX(CASE WHEN TAA.str_answer like \'%Intended Loan Amount%\' THEN concat(\'\', REPLACE(REPLACE(TAA.str_answer, \'{ "Intended Loan Amount" : "\', \'\'), \'" }\', \'\') * 1) ELSE 0 END)  AS DECIMAL(12,2)) LoanAmount, ' +
                               'CAST(MAX(CASE WHEN TAA.str_answer like \'%Expected course expenses%\' THEN concat(\'\', REPLACE(REPLACE(TAA.str_answer, \'{ "Expected course expenses" : "\', \'\'), \'" }\', \'\') * 1) ELSE 0 END)  AS DECIMAL(12,2)) ExpectedCourseExpenses, ' +
                               'CASE WHEN TAA.str_answer like \'%Loan Purpose%\' THEN REPLACE(REPLACE(TAA.str_answer, \'{ "Loan Purpose" : "\', \'\'), \'" }\', \'\') ELSE \'\' END LoanPurpose ' + 
                               'from tbl_applications TA ' +
                               'inner join tbl_users TU on TA.int_user_id = TU.int_id or TA.int_created_by = TU.int_id ' +
                               'inner join tbl_application_answers TAA on TA.int_id = TAA.int_application_id ' +
                               'inner join tbl_loan_type_master TL on TA.int_loan_type_id = TL.int_id ' + 
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' + 
                               'where TU.int_id  = ' + data.id + ' and (TAA.str_answer like \'%Intended Loan Amount%\' or TAA.str_answer like \'%Loan Purpose%\' or TAA.str_answer like \'%Expected course expenses%\') ' +
                               'Group by TA.int_id ' +
                               'order by TA.int_id,REPLACE(REPLACE(TAA.str_answer,\'{ "Loan Purpose" : "\',\'\'),\'" }\',\'\') desc ' +
                               ') TAA on TAA.ApplicationId = TA.int_id ' +
                               'where TU.int_id  = ' + data.id + ' and ("-1" = ' + data.statusId + ' or IFNULL(TAS.int_status_id,1) = ' + data.statusId + ')  ' +
                               'Order by ' + data.sort + ' ' + data.direction + ' limit ' + data.pageSize + ' offset ' + data.pageIndex + '; ' +
                               'Select COUNT(1) TotalApplications ' +
                               'from tbl_applications TA ' +
                               'inner join tbl_banks_loans TB on TA.int_banks_loans_id = TB.int_id ' + 
                               'inner join tbl_users TU on TA.int_user_id = TU.int_id or TA.int_created_by = TU.int_id ' + 
                               'left join tbl_applications_status TAS on TA.int_id = TAS.int_application_id and TAS.bit_is_current = 1 ' +
                               'where TU.int_id = ' + data.id + ' and ("-1" = ' + data.statusId + ' or IFNULL(TAS.int_status_id,1) = ' + data.statusId + ');'
        
        console.log("strSQL",strSQL);
        var prep = cnn.prepare(strSQL);
        
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var applicationList = new applicationData();
                
                for (i = 0; i < rows[0].length; i++) {
                    var application = new applications();
                    application.applicationId = rows[0][i].int_id;
                    application.applicationNumber = rows[0][i].str_application_number;
                    application.userId = rows[0][i].int_user_id;
                    application.loanType = rows[0][i].LoanTypeName;
                    application.loanTypeId = rows[0][i].int_loan_type_id;
                    application.banksLoans = rows[0][i].str_plan_name;
                    application.banksLoansId = rows[0][i].int_banks_loans_id;
                    application.userName = rows[0][i].str_first_name + ' ' + rows[0][i].str_last_name;
                    application.status = rows[0][i].str_status_text;
                    application.appliedDate = new Date(rows[0][i].AppliedDate);
                    application.loanPurpose = rows[0][i].LoanPurpose;
                    application.loanAmount = rows[0][i].LoanAmount;
                    
                    if (application.loanType == 'Education Loan') {
                        application.loanAmount = rows[0][i].ExpectedCourseExpenses;
                        application.loanPurpose = 'N/A';
                    }
                    
                    if (rows[1] != null && rows[1] != 'undefined') {
                        applicationList.totalApplications = rows[1][0].TotalApplications;
                    }
                    
                    applicationList.applications.push(application);
                }
                fn(null, applicationList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

module.exports = applications;