angular.module('RufeeApp').controller('RufeeController', function ($scope,$rootScope, $state, $http, $cookies, toastr, BankAuthenticationService, $uibModal, $uibModalStack, $window, $anchorScroll, $location, $cookieStore, $timeout, vcRecaptchaService,otpService) {
    // if (AuthenticationService.Authenticate()) { }
    $rootScope.ChangePage = 0;
    $rootScope.IsActivityContinued = 0;
    $rootScope.IsFromExportButton = 0;
    $rootScope.headname = "Home1";
    $rootScope.user = {};
    //$rootScope.globals = {};
    $rootScope.logedin_user = null;
    $rootScope.user.first_name = '';
    $rootScope.user.last_name = '';
    $rootScope.user.email = '';
    $rootScope.user.mobile = '';
    $rootScope.user.media = '';
    $rootScope.user.gender = '';
    //{'url term':['db id','link title']}
    $rootScope.contentidlist = { 'tnc': [1, 'Terms & Conditions'], 'aboutus': [2, 'About Us'], 'pnp': [3, 'Privacy & Policy'], 'pagenotfound': [5, 'Page Not Found'] };
    // $rootScope.homeList = {'home':[1,'How it works']};
    $rootScope.user.password = '';
    $rootScope.user.password_c = '';
    // $rootScope.loans = {};
    // $rootScope.geoLocation = {};
    //$rootScope.googleCaptchaPublikKey = "6LfXrCkTAAAAAEYhnH8Dz-3CGqn18emHky14G_5h";
    $rootScope.googleCaptchaPublikKey = "6Le2ciITAAAAAB1i-wKxjmqUKqooXlH3CIs6Av__";
    var windowHeight = window.innerHeight - 190;
    if (windowHeight > 579)
        $rootScope.sliderHeight = 579;
    else
        $rootScope.sliderHeight = windowHeight;

    // $rootScope.contactusQueryForm = { Name: '', phone: '', email: '', address: '', date: '', time: '', addressType: 'This is my home address', contactType: 'Phone' };
    
    $rootScope.emailRegexPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{1,4})$/;

    $window.AuthenticateNow = function (data) {
        if (data.currentUser) {
            AuthenticationService.SetCredentials(data.currentUser.userid, data.currentUser.role, data.currentUser.firstName,
                data.currentUser.lastName, data.currentUser.email, null, false, data.currentUser.phone);
            $rootScope.$apply();
        }
    }



    $rootScope.onChangePWDClick = function () {
        $uibModalStack.dismissAll();
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'changePWDModalContent.html',
            controller: 'changePWDModalInstanceCtrl',
            size: 'md',
            // resolve: {
            //  id: function () {
            //      return id;
            //  }
            // }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            //console.log('Modal dismissed at: ' + new Date());            
        });
    }


    $rootScope.bankLogout = function () {
        BankAuthenticationService.ClearCredentials();
    }
    
    $rootScope.setResponseForCaptcha = function (response) {
        if (response != '') {
            $rootScope.isValidCaptchaForSlider = true;
        } else {
            $rootScope.isValidCaptchaForSlider = false;
        }
    };

    $rootScope.setWidgetIdForCaptcha = function (widgetId) {
        $rootScope.widgetIdOfCaptcha = widgetId;
    };

}).directive('compileData', function ($compile) {
    return {
        scope: true,
        link: function (scope, element, attrs) {

            var elmnt;

            attrs.$observe('template', function (myTemplate) {
                if (angular.isDefined(myTemplate)) {
                    // compile the provided template against the current scope
                    elmnt = $compile(myTemplate)(scope);

                    element.html(""); // dummy "clear"

                    element.append(elmnt);
                }
            });
        }
    };
})
    .run(function ($rootScope, $uibModal, $state, $window) {
        $rootScope
            .$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                $("#ui-view").html("");

                if ($rootScope.ChangePage == 0 && $rootScope.IsActivityContinued == 1 && ((fromState.name == "personal-loan.getquotewithbanks" && toState.name != "loan-documents") || (fromState.name == "education-loan.getquote" && toState.name != "educationloan-documents"))) {
                    $(".loginOverLay").show();
                    event.preventDefault();

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'confirmModalContent.html',
                        controller: 'confirmModalInstanceCtrl',
                        size: 'lg',
                        resolve: {
                            message: function () {
                                $(".loginOverLay").hide();
                                return 'Are you sure you want to navigate away from this page?<br>Your requirements haven\'t been saved yet. It will be lost if you leave this page.<br>Press Yes to continue, or No to stay on the current page.';
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {

                        $rootScope.ChangePage = 1;
                        $state.go(toState, toParams);
                    }, function () {
                        $('.bubbles-tab').find('li').removeClass('active');
                        $('#getQuote').parent().addClass('active');
                        console.log('Modal dismissed at: ' + new Date());
                        return;
                    });

                } else {
                    $rootScope.ChangePage = 0;
                    $rootScope.IsActivityContinued = 0;
                    $(".loginOverLay").show();
                }

                $rootScope.$watch('IsActivityContinued', function (value) {
                    if (value == 1) {

                        $window.onbeforeunload = function (event) {
                            if ($rootScope.IsActivityContinued == 1 && $rootScope.IsFromExportButton == 0)
                                return "Are you sure you want to navigate away from this page?";
                            else
                                $rootScope.IsFromExportButton = 0;
                        };
                    }
                });

            });

        $rootScope
            .$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $(".loginOverLay").hide();
                $rootScope.IsActivityContinued = 0;
            });

    }).filter('INR', function ($sce) {
        return function (input) {
            if ((input && !isNaN(input)) || input == 0) {
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
                return $sce.trustAsHtml(currencySymbol + output);
            } else if (input && input.toString() != 'NaN') {
                return $sce.trustAsHtml(input + '');
            }
        }
    });

// Base64 encoding service used by AuthenticationService
var Base64 = {

    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.keyStr.charAt(enc1) +
                this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) +
                this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
};
