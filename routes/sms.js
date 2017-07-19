var express = require('express');
var router = express.Router();
var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');
var http = require('https');
var sms_user = require('./dal/sms');
var request = require('request');
var async = require("async");
var applications = require('./dal/applications');
// router.get('/', function (req, res) {
//     var quote = new quotes();
//     async.series([
//         function (callback) {
//             quote.getQuotesByLoanType({ loanTypeId: 1 },
//             function (err, param) {
//                 if (!err) {
//                     console.log("GetQuotesByLoanType response received");
//                     callback(null,1);
//                 } else {
//                     console.log("GetQuotesByLoanType response received");
//                 }
//             });
//             //callback();
//         },
//         function (callback) {
//             console.log("1st statement after GetQuotesByLoanType");
//             callback(null,2);
//         },
//         function (callback) {
//             quote.getQuotesByLoanType({ loanTypeId: 1 },
//             function (err, param) {
//                 if (!err) {
//                     console.log("2nd GetQuotesByLoanType response received");
//                     callback(null,3);
                    
//                 } else {
//                     console.log("2nd GetQuotesByLoanType response received");
//                 }
//             });
            
//         },
//         function (callback) {
//             console.log("2nd statement after GetQuotesByLoanType");
//             callback(null,4);
//         },
//         function (callback) {
//             quote.getQuotesByLoanType({ loanTypeId: 1 },
//             function (err, param) {
//                 if (!err) {
//                     console.log("3rd GetQuotesByLoanType response received");
//                     callback(null,5);
//                 } else {
//                     console.log("3rd GetQuotesByLoanType response received");
//                 }
//             });
//         },
//         function (callback) {
//             console.log("3rd statement after GetQuotesByLoanType");
//             callback(null,6);
//         }
//     ],    
//     function (err, results) {
//     // results is now equal to ['one', 'two']
//         res.send(results);
//     });
//     console.log("test!");
// });

// router.post('/', function (req, res) {
//     console.log("vvvvvvvv",req.body.mobile,req.body.message);
//     var response = Object.assign({}, responsejson);

//     try {
//         if (req.body.mobile && req.body.message) {
            
//     //         var data = JSON.stringify({
//     //             authkey: "RwYUANzJR94-G4jKxQFz3CPVID1GylgMvNDF27ow5u",
//     //             mobiles: req.body.mobile,
//     //             message: req.body.message,
//     //             sender: "RupeeFin",
//     //             route: 1,
//     //             country: 91
//     //         });
//     //         // console.log("vvvvvvv",data);
//     //         var options = {
//     //             host: 'control.msg91.com',
//     //             port: 443,
//     //             path: '/api/sendhttp.php',
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/x-www-form-urlencoded',
//     //                 'Content-Length': Buffer.byteLength(data)
//     //             }
//     //         };
            
//     //         var reqSMS = http.request(options, function (res) {
//     //             res.setEncoding('utf8');
//     //             res.on('data', function (chunk) {
//     //             //console.log("body: " + chunk);
//     //                 response = chunk;
//     //             });
//     //         });
            
//     //         reqSMS.write(data);
//     //         reqSMS.end();
            
//     //         response.result = true;
//     //         response.responseCode = 200;
//     //         response.responseMessage = "Success";
//     //         var jsonString = JSON.stringify(response, replacer);
//     //         console.log(jsonString);
//     //         res.send(jsonString);
//     //     }
//     //     else {
//     //         response.result = false;
//     //         response.responseCode = 400;
//     //         response.responseMessage = "Missing parameters";
//     //         var jsonString = JSON.stringify(response, replacer);
//     //         res.send(jsonString);
//     //     }

//     // } catch (err) {
//     //     console.log(err);
//     //     response.result = false;
//     //     response.responseCode = 500;
//     //     response.responseMessage = "Something went wrong, try later";
//     //     var jsonString = JSON.stringify(response, replacer);
//     //     res.send(jsonString);
//     // }

//     var apiKey = urlencode('RwYUANzJR94-G4jKxQFz3CPVID1GylgMvNDF27ow5u');
//     // var data = JSON.stringify({
//     //     authkey: "RwYUANzJR94-G4jKxQFz3CPVID1GylgMvNDF27ow5u",
//     //     mobiles: req.body.mobile,
//     //     message: req.body.message,
//     //     sender: "RupeeFin",
//     //     route: 1,
//     //     country: 91
//     // });

//     var numbers = array(req.body.mobile, 7043396684);
//     var sender = urlencode('TXTLCL');
//     var message = rawurlencode(req.body.message);
 
//     numbers = implode(',', numbers);

//     var data1 = array({'apikey' : apiKey, 'numbers' : numbers, "sender" : sender, "message" : message});
 
//     var data = JSON.stringify({
//         authkey: "RwYUANzJR94-G4jKxQFz3CPVID1GylgMvNDF27ow5u",
//         numbers: req.body.mobile,
//         message: req.body.message,
//         sender: "TXTLCL",
//         username: 'pbansi92@gmail.com',
//         password: 'Bansipatel92'
//     });
//     // Send the POST request with cURL
//     // $ch = curl_init('https://api.textlocal.in/send/');
//     // curl_setopt($ch, CURLOPT_POST, true);
//     // curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//     // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     // $response = curl_exec($ch);
//     // curl_close($ch);
    
//     // // Process your response here
//     // echo $response;

//             var options = {
//                 path: 'https://api.textlocal.in/send/',
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'Content-Length': Buffer.byteLength(data)
//                 }
//             };
            
//             var reqSMS = http.request(options, function (res) {
//                 res.setEncoding('utf8');
//                 res.on('data', function (chunk) {
//                 //console.log("body: " + chunk);
//                     response = chunk;
//                 });
//             });
            
//             reqSMS.write(data);
//             reqSMS.end();
//         }
//         else {
//             response.result = false;
//             response.responseCode = 400;
//             response.responseMessage = "Missing parameters";
//             var jsonString = JSON.stringify(response, replacer);
//             res.send(jsonString);
//         }
// } catch (err) {
//         console.log(err);
//         response.result = false;
//         response.responseCode = 500;
//         response.responseMessage = "Something went wrong, try later";
//         var jsonString = JSON.stringify(response, replacer);
//         res.send(jsonString);
//     }
// });


router.post('/', function (req, res) {
    // console.log("vvvvvvvv",req.body.mobile,req.body.message);
    var response = Object.assign({}, responsejson);
    var d = new Date();
    var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';
    try {
        if (req.body.mobile && req.body.message) {
            request.post({url:'https://api.textlocal.in/send/',form:{apikey:'2OzRpHw6lJ8-dikCEyBNHeRWDJxKcHbDIlRvz7ejro',numbers:'91'+req.body.mobile,message:req.body.message,sender:'TXTLCL',username:'mstatustest5@gmail.com',password:'Plutus@123'}}, function(err,httpResponse,body){ 
                // res.send("success");
                var data = JSON.parse(body);
                // console.log("vvvvvvvvvvv",data);
                if(data && data.status == "success"){
                    // res.send('success');
                    var params ={};
                    params.sms_id = 0 ;
                    params.batch_id = data.batch_id;
                    params.msg_id = data.messages[0].id;
                    params.msg_content = data.message.content;
                    params.msg_balance = data.balance;
                    params.recipient = data.messages[0].recipient;
                    params.sender = data.message.sender;
                    params.msg_status = data.status;
                    params.msg_cost = data.cost;
                    params.createdOn = datestring;

                    var statsParam ={};
                    statsParam.applicationId = req.body.applicationId;
                    statsParam.statusId = req.body.statusId;
                    statsParam.isCurrent = 1;
                    statsParam.updatedOn = datestring;
                    // console.log("params>>>>>>>>",params);

                    var sms = new sms_user();
                    sms.addSMSDetails(params, function (err, param) {
                        if (!err && param && param != 0) {
                            var app = new applications();
                            app.setApplicationDetailByAppNumber(statsParam , function (err, param) {
                                if (!err && param && param != 0) {
                                console.log("aaaaaaaaaa",param);
                                    response.result = true;
                                    response.responseCode = 201;
                                    response.responseMessage = "Success";
                                    response.response.id = param;
                                } else {
                                      console.log("bbbbbbbbbb",err);
                                    response.result = false;
                                    response.responseCode = 500;
                                    response.responseMessage = "Something went wrong, try later";
                                }
                                var jsonString = JSON.stringify(response, replacer);
                                res.send(jsonString);
                            });

                        }else{
                            response.result = false;
                            response.responseCode = 500;
                            response.responseMessage = "Something went wrong, try later";
                        }
                    });
                } else {
                    console.log(err);
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = "Insufficient Message Credit!";
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                }
            });
        }else {
            response.result = false;
            response.responseCode = 400;
            response.responseMessage = "Missing parameters";
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
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

