
// window.ServiceBaseUrl = 'https://192.168.0.44:4430/api/';
//window.ServiceBaseUrl = 'http://localhost:8000/api/';
window.ServiceBaseUrl = './api/';

//window.ServiceBaseUrl = 'http://192.168.0.110:8000/api/';

//window.FacebookApiId = '1079339485460847'; //LIVE
window.FacebookApiId = '656672167814791'; //DEV

window.RupeeFinLiveURL = 'http://rupeefin.com/';
window.FacebookShareName = 'RupeeFin';
window.FacebookShareDescryption = 'EMI Calculator - Calculate EMI on Home, Car and Personal Loans';

// window.GoogleClientId = '153740545111-qlc4n9l1n7toe02nhm4ape5pq0smmgv1.apps.googleusercontent.com';
window.GoogleClientId = '740409167820-n4kjm5fpricjso0evd6r924f96pm1jm2.apps.googleusercontent.com';

//window.LinkedInClientId = '75skq7w7vkbeqs'; //LIVE
window.LinkedInClientId = '75cy3qqa6b0e6b'; //DEV

window.TwitterAuthLink = 'https://api.twitter.com/oauth/authorize?oauth_token=';


Array.prototype.containsByProp = function (propName, value) {
    for (var i = this.length - 1; i > -1; i--) {
        var propObj = this[i];
        if (propObj[propName] && propObj[propName].toLowerCase().replace(' ', '-') === value) {
            return propObj;
        }
    }
    return null;
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

function deformateMoney(n) {
    return n.replace(/[$,]+/g, "");
}

function formatMoney(input) {
    //return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    //return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    if (!isNaN(input)) {

        input = Math.round(input);

        var currencySymbol = '&#8377;';
        //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
        var result = input.toString().split('.');

        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        if (result.length > 1) {
            output += "." + result[1];
        }
        return output;
    }
}