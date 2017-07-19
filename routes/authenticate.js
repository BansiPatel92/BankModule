var express = require('express');
var router = express.Router();
// var users = require('./dal/users');
// var review = require('./dal/review');
// var session = require('./middlewares/session');
var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');
var mailguns = require('./common/mailgun');
// var usersv = require('./validation/users');
var fs = require('fs');
// var smsUtil = require('./common/sms');
//var encryption = require('./common/encryption');
var crypto = require('crypto');

function encryptMD5(data) {
    return crypto.createHash('md5').update(data).digest("hex")
}

router.get('/uaparse', function (req, res) {
    var parser = require('ua-parser-js');
    // get user-agent header 
    var ua = parser(req.headers['user-agent']);
    // write the result as response 
    res.end(JSON.stringify(ua, null, '  '));
    // var user = {};
    // user.firstName = 'Kamal';
    // user.email = 'kamal.mandalia@plutustec.com';
    //SendNewDeviceEmail(user, req, res);
})

router.get('/md5', function (req, res) {
    console.info('password', req.query.data);
    //var data = JSON.parse(req.query.data);
    //var encrypt = new encryption();
    // encrypt.encryptMD5(req.query.data, function (param) {
    //     res.send(param);
    // })
    res.send(encryptMD5(req.query.data));
    // var crypto = require('crypto');
    // var ans = [];
    // console.info('data.length', data.length);
    // for (var i in data) {
    //     var obj = {};
    //     obj.pwd = data[i];
    //     obj.enc = crypto.createHash('md5').update(data[i]).digest("hex");
    //     ans.push(obj);
    // }
    // res.send(ans);
})



router.get('/enquiry', function (req, res) {
    console.log(req.query);
    console.log("Coming to this!");
    var response = Object.assign({}, responsejson);
    var emailData = {
        'to': req.query.email,
        "from": 'RupeeFin Notification<no-reply@rupeefin.com>',
        'subject': req.query.subject,
        'html': req.query.message,
        'replyTo': ''
    };
    // console.log(emailData);
    var mailgun = new mailguns();
    mailgun.sendmail(emailData, function (err1, param1) {
        if (!err1) {
            response.result = true;
            response.responseCode = 201;
            response.responseMessage = "Success";
            response.response = param1;
        } else {
            response.result = false;
            response.responseCode = 500;
            response.responseMessage = "Something went wrong, try later";
            console.log(err1);
        }
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });


});



//kamal.mandalia@plutustec.com
router.get('/testotpfn/:email', function (req, res) {
    sendOTPMail(2, '125894', 'There!', req.params.email,
        function (err, params) {
            res.send(params);
            console.log(err);
        });
})

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

function SendUserRegistrationEmail(email, firstName, lastName, phoneNumber) {
    fs.readFile('./email_templates/RupeeFin_Registration.html', 'utf8', function (err, filedata) {
        if (err) {
            console.log(err);
        }

        filedata = filedata.replace('[FIRST_NAME]', firstName);
        filedata = filedata.replace('[USER_NAME]', 'Name: ' + firstName + ' ' + lastName);
        if (phoneNumber != null) {
            if (phoneNumber != "") {
                filedata = filedata.replace('[USER_PHONE_NUMBER]', 'Phone: ' + phoneNumber);
            }
            else
                filedata = filedata.replace('[USER_PHONE_NUMBER]', '');
        }

        var emailData = {
            'to': email,
            "from": 'RupeeFin Notification<no-reply@rupeefin.com>',
            'subject': 'Registered Successfully',
            'html': filedata,
            'replyTo': ''
        };


        var mailgun = new mailguns();
        mailgun.sendmail(emailData, function (err, param1) {
            if (err) {
                console.log(err);
            }
        });
    });
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    //return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};

function SendNewDeviceEmail(user, req, ua) {
    if (ua) {
        fs.readFile('./email_templates/RupeeFin_New_On_Device.html', 'utf8', function (err, filedata) {
            if (err) {
                console.log(err);
            } else {
                filedata = filedata.replace('[FIRST_NAME]', user.firstName || 'RupeeFin user');
                filedata = filedata.replace('[EMAIL]', user.email || '');
                filedata = filedata.split('[OS]').join(ua.os.name);//filedata = filedata.replace('[OS]', ua.os.name);
                filedata = filedata.replace('[OS_VERSION]', ua.os.version);
                filedata = filedata.replace('[DATE_TIME]', new Date());
                filedata = filedata.split('[DEVICE]').join(ua.browser.name);//.replace('[DEVICE]', ua.browser.name);

                var emailData = {
                    'to': user.email,
                    "from": 'RupeeFin <no-reply@rupeefin.com>',
                    'subject': 'New sign-in from ' + ua.browser.name + ' on ' + ua.os.name,
                    'html': filedata,
                    'replyTo': ''
                };

                var mailgun = new mailguns();
                mailgun.sendmail(emailData, function (err, param1) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }


}

module.exports = router;