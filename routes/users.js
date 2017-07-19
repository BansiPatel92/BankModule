var express = require('express');
var router = express.Router();
var users = require('./dal/users');
var applications = require('./dal/applications');
var fs = require('fs');

var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');

var crypto = require('crypto');

function encryptMD5(data) {
    return crypto.createHash('md5').update(data).digest("hex")
}

//Get user by id
//?userId=123
router.get('/', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        if (req.query.userId) {
            var user = new users();
            user.getUserById(req.query, function (err, param) {
                if (!err) {
                    param.password = '';
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
            })
        } else {
            response.result = false;
            response.responseCode = 201;
            response.message = 'Parameter(s) required.';
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.message = 'Something went wrong, try later.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//Save user details
router.post('/:userId', function (req, res) {
    var response = Object.assign({}, responsejson);

    try {
        var d = new Date();
        var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':00';

        if (req.params.userId) {
            if (!req.body.userId)
                req.body.userId = req.params.userId;
            var user = new users();
            // if (req.body.otp && req.body.new_email) {
            //     var validDate = new Date();
            //     var data = {};
            //     data.otp = req.body.otp;
            //     data.userId = req.body.userId;
            //     data.validTill = validDate.toMysqlFormat();
            //     data.isActive = 1;
            //     data.setActive = 0;
            //     data.updatedOn = datestring;

            //     user.checkOTPwithUser(data, function (err, param) {
            //         if (!err) {
            //             if (param.info.affectedRows == 1) {
            //                 data.email = req.body.new_email;
            //                 user.updateUserEmail(data, function (errs, params) {
            //                     if (!err) {
            //                         response.result = true;
            //                         response.responseCode = 201;
            //                         response.responseMessage = "Success";
            //                     } else {
            //                         response.result = false;
            //                         response.responseCode = 500;
            //                         response.responseMessage = "Something went wrong, try later";
            //                     }
            //                     var jsonString = JSON.stringify(response, replacer);
            //                     res.send(jsonString);
            //                 })
            //             } else {
            //                 response.result = false;
            //                 response.responseCode = 500;
            //                 response.responseMessage = "OTP does not match, please try again or resend OTP";
            //                 var jsonString = JSON.stringify(response, replacer);
            //                 res.send(jsonString);
            //             }
            //         } else {
            //             response.result = false;
            //             response.responseCode = 500;
            //             response.responseMessage = "Something went wrong, try later";
            //             var jsonString = JSON.stringify(response, replacer);
            //             res.send(jsonString);
            //         }
            //     });
            // } else {
                user.updateUserDetail(req.body, function (err, param) {
                    if (!err) {
                        response.result = true;
                        response.responseCode = 201;
                        response.responseMessage = "Success";
                    } else {
                        response.result = false;
                        response.responseCode = 500;
                        response.responseMessage = "Something went wrong, try later";
                    }
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                })
            // }
        } else {
            response.result = false;
            response.responseCode = 201;
            response.responseMessage = 'Parameter(s) required.';
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = 'Something went wrong, try later.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//POST:.../api/users/:userId/password
router.post('/:userId/password', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        if (req.params.userId) {
            if (!req.body.userId)
                req.body.userId = req.params.userId;
            
            if (req.body.password) {
                req.body.password = encryptMD5(req.body.password);
            }
            var user = new users();
            user.getUserById({ userId: req.body.userId }, function (err, param) {
                if (!err && param) {
                    if (param.password == req.body.password && req.body.newPassword != param.password) {
                        var data = {};

                        if (req.body.newPassword) {
                            req.body.newPassword = encryptMD5(req.body.newPassword);
                        }

                        data.password = req.body.newPassword;
                        data.userId = req.body.userId;
                        user.changePassword(data, function (err1, param1) {
                            if (!err1 && param1) {
                                if (param1.info.affectedRows > 0) {
                                    response.result = true;
                                    response.responseCode = 201;
                                    response.responseMessage = "Success";
                                } else {
                                    response.result = false;
                                    response.responseCode = 500;
                                    response.responseMessage = 'Something went wrong, try later.';
                                }
                            } else {
                                response.result = false;
                                response.responseCode = 500;
                                response.responseMessage = 'Something went wrong, try later.';
                            }
                            var jsonString = JSON.stringify(response, replacer);
                            res.send(jsonString);
                        })
                    } else if (req.body.newPassword == param.password && param.password == req.body.password) {
                        response.result = false;
                        response.responseCode = 500;
                        response.responseMessage = 'Please use different password other than current';
                        var jsonString = JSON.stringify(response, replacer);
                        res.send(jsonString);
                    } else {
                        response.result = false;
                        response.responseCode = 500;
                        response.responseMessage = 'Old password is incorrect';
                        var jsonString = JSON.stringify(response, replacer);
                        res.send(jsonString);
                    }
                } else {
                    console.log(err);
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = 'Something went wrong, try later.';
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                }
            })

        } else {
            response.result = false;
            response.responseCode = 201;
            response.responseMessage = 'Parameter(s) required.';
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = 'Something went wrong, try later.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//POST:.../api/users/:userId/image
router.post('/:userId/image', function (req, res) {
    console.log("aaaaaaaaaaaaaaaaaaaaa",req.body.fileName);
    var response = Object.assign({}, responsejson);
    try {
        if (req.params.userId && req.body.fileData && req.body.fileName) {
            var img = req.body.fileData;

            var img = img.substr(img.indexOf(',') + 1);
            var dir = './Uploads/Profile-Image/' + req.params.userId;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            fs.writeFile(dir + '/' + req.body.fileName, img, 'base64', function (err) {
                if (err) {
                    console.log('err : ' + err);
                    response.result = false;
                    response.responseCode = 500;
                    response.responseMessage = 'Something went wrong, try later.';
                    var jsonString = JSON.stringify(response, replacer);
                    res.send(jsonString);
                } else {
                    var user = new users();
                    var data = {};
                    data.userId = req.params.userId;
                    data.profileImageName = req.body.fileName;
                    user.updateProfileImage(data, function (err1, param) {
                        if (!err1) {
                            response.result = true;
                            response.responseCode = 201;
                            response.responseMessage = "Success";
                        } else {
                            response.result = false;
                            response.responseCode = 500;
                            response.responseMessage = "Something went wrong, try later";
                        }
                        var jsonString = JSON.stringify(response, replacer);
                        res.send(jsonString);
                    })
                }
            });
        } else {
            response.result = false;
            response.responseCode = 201;
            response.responseMessage = 'Parameter(s) required.';
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = 'Something went wrong, try later.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

//Get recent application detail for user
router.get('/:userId/recentapplication', function (req, res) {
    var response = Object.assign({}, responsejson);
    try {
        if (req.params.userId) {
            var app = new applications();
            app.getRecentApplicationDetails(req.params, function (err, param) {
                if (!err) {
                    param.password = '';
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
            })
        } else {
            response.result = false;
            response.responseCode = 201;
            response.message = 'Parameter(s) required.';
            var jsonString = JSON.stringify(response, replacer);
            res.send(jsonString);
        }
    } catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.message = 'Something went wrong, try later.';
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
})

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    //return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};

module.exports = router;