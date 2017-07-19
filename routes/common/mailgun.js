var method = mailgun.prototype;

var api_key = 'key-2614245d4e499e794758baa99e0a4035';
var domain = 'rupeefin.com';//'sandbox6723517f31fb452abfed452eb7654c87.mailgun.org';
var fromMail = 'RupeeFin Notifications<no-reply@rupeefin.com>';
var toMail = 'rupeefinerror@gmail.com';
var replyToEmail = 'rupeefinerror@gmail.com';

function mailgun() {
    this.id = 0;
}

method.sendmail = function (data, fn) {
    try {
        var email = require('mailgun-js')({ apiKey: api_key, domain: domain });
        
        if (data.from == '' || data.from == null)
            data.from = fromMail;
        
        if (data.to == '' || data.to == null)
            data.to = toMail;
        
        if (data.replyTo == '' || data.replyTo == null)
            data.replyTo = replyToEmail;
        
        if (data.attachment == '' || data.attachment == null)
            data.attachment = "";

        var finaldata = {
            'from': data.from, 
            'to' : data.to,
            'subject': data.subject, 
            'html' : data.html, 
            'h:Reply-To' : data.replyTo,
            'attachment': data.attachment
        };
        
        email.messages().send(finaldata, function (err, body) {
            if (err) {
                console.log('Mailgun Error:' + err);
                fn(err, null);
            }
            else {
                var mailguns = new mailgun();
                mailguns.id = 1;
                fn(null, mailguns);
            }
        });
    } catch (err) {
        console.log('Mailgun Error:' + err);
        fn(err, null);
    }
}

method.sendErrorMail = function (data, fn) {
    try {
        var email = require('mailgun-js')({ apiKey: api_key, domain: domain });
        
        var finaldata = {
            'from': 'RupeeFin Error<no-reply@rupeefin.com>', 
            'to' : "rupeefinerror@gmail.com",
            'subject': "Error in RupeeFin", 
            'html' : data.html
        };
        
        email.messages().send(finaldata, function (err, body) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var mailguns = new mailgun();
                mailguns.id = 1;
                fn(null, mailguns);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

module.exports = mailgun;