var querystring = require('querystring');
var http = require('https');

var method = sms.prototype;

function sms() {
    this.id = 0;
}

method.sendsms = function (dataSMS , fn) {
    try {
        if (dataSMS.mobile && dataSMS.otp && dataSMS.template) {
            
            var strMessage = "";
            if (dataSMS.template == 'RupeeFin_OTP.html') {
                strMessage = "Use [OTP] as one time password (OTP) to login to your RupeeFin account. Do not share this OTP to anyone for security reasons. Valid for 2 days.";
            }
            else if (dataSMS.template == 'RupeeFin_ForgotPWD_OTP.html') {
                strMessage = "Use [OTP] as one time password (OTP) to reset your passowd. Do not share this OTP to anyone for security reasons. Valid for an hour.";
            }
            else if (dataSMS.template == 'RupeeFin_Email_Change_OTP') {
                strMessage = "Use [OTP] as one time password (OTP) to change your Email address. Do not share this OTP to anyone for security reasons. Valid for 2 days.";
            }
            strMessage = strMessage.replace("[OTP]", dataSMS.otp);
            
            var data = querystring.stringify({
                authkey: "124562Aq1CwYF3w61S57d68d1c",
                mobiles: dataSMS.mobile,
                message: strMessage,
                sender: "RupFin",
                route: 4,
                country: 91
            });
            
            var options = {
                host: 'control.msg91.com',
                port: 443,
                path: '/api/sendhttp.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data)
                }
            };
            
            var response;
            
            var reqSMS = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log("body: " + chunk);
                    response = chunk;
                });
            });
            
            reqSMS.write(data);
            reqSMS.end();
            
            fn(null, response);
        }
        else {
            fn(null, "Missing Parameters");
        }
    } catch (err) {
        console.log('SMS Error:' + err);
        fn(err, null);
    }
}

module.exports = sms;