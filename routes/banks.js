var express = require('express');
var router = express.Router();
var banks = require('./dal/banks');
var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');
var crypto = require('crypto');

function encryptMD5(data) {
    return crypto.createHash('md5').update(data).digest("hex")
}

//Bank's login api
router.post('/login', function (req, res) {
    console.log(req.body.email);
    var response = Object.assign({}, responsejson);
    try {
        if (req.body.password) {
            req.body.password = encryptMD5(req.body.password);
        }
        var bank = new banks();
        bank.email = req.body.email;
        bank.password = req.body.password;
        
        bank.login(bank,
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