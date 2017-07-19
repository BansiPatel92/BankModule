angular.module('RufeeApp')
    .controller('loginModalInstanceCtrl',
    function ($timeout, $rootScope, $scope, $uibModalInstance, $uibModalStack, $uibModal, toastr, userService, AuthenticationService, $window, $state) {

        //$scope.fbLoginButton = fbAuth.watchLoginChange;
        //$scope.linkedInButton = linkedinAuth.linkedInLogin;
        //linkedinAuth.linkedinInit();
        //fbAuth.fbInitiIfnot()
        //setTimeout(function () {
        //    googleAuth.googleInit('googleSignIn');
        //}, 500);
        //// $scope.tweeterButton = twitterService.twitterGetToken;
        //// $rootScope.twitter = {};
        //// twitterService.checkTwitterData();

        $scope.loginme = {};
        $scope.loginme.email = '';

        if (typeof ($rootScope.userEmail) != 'undefined' && $rootScope.userEmail != "") {
            $scope.loginme.email = $rootScope.userEmail;
        }

        $scope.loginme.password = '';
        $rootScope.user.allowsubmit = true;
        $rootScope.user.showinputs = null;

        $scope.$watch(
            function () { return $rootScope.globals; },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.cancel();
                }
            }
        );

        $scope.close = function () {
            $uibModalInstance.close('');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.logmein = function () {
            //alert($scope.loginme.email + ' \n\r ' + $scope.loginme.password);
            //$scope.cancel();
            $(".loginOverLay").show();
            AuthenticationService.Login($scope.loginme.email, $scope.loginme.password)
                .then(function (res) {

                    if (res.data.response && res.data.result) {
                        AuthenticationService.SetCredentials(res.data.response.id, res.data.response.userType,
                            res.data.response.firstName, res.data.response.lastName, res.data.response.email, $scope.password, false, res.data.response.phone,
                            res.data.response.profileImageName);
                        $scope.close();

                        if ($rootScope.titlename != 'Personal loan - Deals' && $rootScope.titlename != 'Education loan - Deals') {

                            AuthenticationService.GetRecentApplication(res.data.response.id)
                                .then(function (res) {
                                    if (res.data.result) {

                                        if (typeof (res.data.response.applicationNumber) != 'undefined' && typeof (res.data.response.applicationId) != 'undefined') {

                                            var modalInstance = $uibModal.open({
                                                animation: true,
                                                templateUrl: 'confirmModalContent.html',
                                                controller: 'confirmModalInstanceCtrl',
                                                size: 'lg',
                                                resolve: {
                                                    message: function () {
                                                        return 'As per your last login, you were working on Application - #' + res.data.response.applicationNumber + '.<br> Click "YES" if you would like to continue from where you left off.';
                                                    }
                                                }
                                            });

                                            modalInstance.result.then(function (selectedItem) {

                                                if (res.data.response.loanType == 'Personal Loan')
                                                    $state.go('loan-documents', { appNum: res.data.response.applicationNumber });
                                                else if (res.data.response.loanType == 'Education Loan')
                                                    $state.go('educationloan-documents', { appNum: res.data.response.applicationNumber });
                                            }, function () {
                                                console.log('Modal dismissed at: ' + new Date());
                                            });
                                        }
                                    } else {

                                    }

                                }, function (res) {
                                    console.log(res);
                                });
                        }

                    }
                    else {
                        toastr.error("Incorrect email or password.", 'Error');
                        $scope.loginme.password = '';
                    }

                    //$scope.disableLogin = false;
                }, function (res) {
                    console.log(res);
                    toastr.error('Something went wrong, try later.', 'Error');
                });
        }

    }).controller('sigupModalInstanceCtrl',
    function ($rootScope, $scope, $cookieStore, $uibModalInstance, $uibModalStack, $uibModal, toastr, userService, otpService, AuthenticationService) {

        $scope.popupTitle = 'SignUp';
        $scope.signupSubmit = signupSubmitFn;
        $scope.otpcount = 0;
        if ($rootScope.user.showinputs == 'fgpwd')
            $scope.popupTitle = 'Forgot Password';
        $rootScope.user.sendotp = false;
        if (!$rootScope.user.email)
            $rootScope.user.sendotp = true;
        var otpTransition = $rootScope.user.showinputs == 'signup' || $rootScope.user.showinputs == null ? 'signup' : 'fgpwd';

        //console.log($rootScope.user.sendotp);
        //$cookieStore.remove('otpTransactionInfo');

        $scope.$watch(
            function () { return $rootScope.globals; },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.cancel();
                }
            }
        );

        function signupSubmitFn() {
            var otpinfo = AuthenticationService.GetOtpTransactionInfo(otpTransition, $rootScope.user.email);
            //console.info('otpinfo', otpinfo);
            if (otpinfo && otpinfo.email == $rootScope.user.email) {
                $scope.otpcount = otpinfo.otpcount;
            }
            if ($rootScope.user.logindata) {
                AuthenticationService.SetCredentials($rootScope.user.logindata.id, $rootScope.user.logindata.userType, $rootScope.user.logindata.firstName, $rootScope.user.logindata.lastName, $rootScope.user.logindata.email, $rootScope.user.logindata.password, false, $rootScope.user.logindata.phone);
            }
            // forgot password
            else if ($rootScope.user.showinputs == 'fgpwdinputs') {
                $rootScope.user.allowsubmit = false;
                var userId = 0;
                if ($rootScope.user.showinputs == 'fgpwdinputs') userId = -1;
                $(".loginOverLay").show();
                otpService.checkOTPandSetPwdUser(userId, $rootScope.user.otp, $rootScope.user.password, function (params) {
                    if (params.result == true) {
                        toastr.success('Your password has been updated successfully', 'Done');
                        $scope.cancel();
                        $rootScope.onLoginClick();
                    } else {
                        toastr.error(params.responseMessage, 'Error');
                    }
                    $rootScope.user.allowsubmit = true;
                }, $rootScope.user.email);
            } else if ($rootScope.user.password && $rootScope.user.showinputs != 'fgpwdinputs') {
                //console.log($rootScope.user);
                $(".loginOverLay").show();
                userService.validateData();
            } else if ($rootScope.user.media) {
                //console.log($rootScope.user.media);
                if ($rootScope.user.sendotp == true) {
                    $(".loginOverLay").show();
                    otpService.sendOTPtoUser(0, $rootScope.user.email, $rootScope.user.first_name, $rootScope.user.phone, function (params) {
                        if (params == true) {
                            toastr.success('One-Time-Password has been sent to your email address.', 'Sent');
                            $rootScope.user.showinputs = 'signup';
                        } else {
                            toastr.error(params, 'Error');
                        }
                    })
                } else {
                    $rootScope.user.showinputs = 'signup';
                }
            } else {
                //$rootScope.user.media = 'signup';
                $rootScope.user.allowsubmit = false;
                var userId = 0;
                if ($rootScope.user.showinputs == 'fgpwd') userId = -1;
                $(".loginOverLay").show();
                otpService.sendOTPtoUser(userId, $rootScope.user.email, $rootScope.user.first_name, $rootScope.user.phone, function (params) {
                    if (params == true) {
                        toastr.success('One-Time-Password has been sent to your email address.', 'Sent');
                        if ($rootScope.user.showinputs == 'fgpwd') {
                            //for forgot password
                            $rootScope.user.showinputs = 'fgpwdinputs';
                        } else {
                            $rootScope.user.showinputs = 'signup';
                            $rootScope.user.media = 'signup';
                        }
                    } else {
                        toastr.error(params, 'Error');
                    }
                    $rootScope.user.allowsubmit = true;
                })

            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            // $rootScope.user = {};
            // $rootScope.user.first_name = '';
            // $rootScope.user.last_name = '';
            // $rootScope.user.email = '';
            // $rootScope.user.mobile = '';
            // $rootScope.user.media = '';
            // $rootScope.user.gender = '';
            // $rootScope.user.password = '';
            // $rootScope.user.password_c = '';
        };

        $scope.resendOTP = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmModalContent.html',
                controller: 'confirmModalInstanceCtrl',
                size: 'md',
                resolve: {
                    message: function () {
                        return 'Are you sure you want to receive the OTP again?';
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $rootScope.user.allowsubmit = false;
                var userId = 0;
                if ($rootScope.user.showinputs == 'fgpwdinputs') userId = -1;
                $(".loginOverLay").show();
                otpService.sendOTPtoUser(userId, $rootScope.user.email, $rootScope.user.first_name, $rootScope.user.phone, function (params) {
                    if (params == true) {
                        $scope.otpcount += 1;
                        AuthenticationService.SetOtpTransactionInfo(otpTransition, $rootScope.user.email, $scope.otpcount);
                        toastr.success('One-Time-Password has been sent to your email address.', 'Sent');
                        if ($rootScope.user.showinputs != 'fgpwdinputs') {
                            $rootScope.user.showinputs = 'signup';
                            $rootScope.user.media = 'signup';
                        }
                    } else {
                        toastr.error(params, 'Error');
                    }
                    $rootScope.user.allowsubmit = true;
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }).controller('logoutModalInstanceCtrl',
    function ($rootScope, $scope, $uibModalInstance, $uibModalStack, AuthenticationService) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            AuthenticationService.ClearCredentials();
            $uibModalInstance.dismiss('cancel');
        }
    }).controller('changePWDModalInstanceCtrl',
    function ($rootScope, $scope, toastr, $uibModalInstance, $uibModalStack, userService) {
        $scope.changepwd = {};
        $scope.changepwd.password = '';
        $scope.changepwd.new_password = '';
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            $(".loginOverLay").show();
            userService.changeUserPWD($rootScope.bankGlobals.currentUser.userId,
                $scope.changepwd.password, $scope.changepwd.new_password).then(function (res) {
                    if (res.result) {
                        toastr.success('Password has been updated successfully', 'Success');
                        $scope.cancel();
                    } else {
                        toastr.error(res.responseMessage, 'Error');
                    }
                }, function (res) {
                    toastr.error('Something went wrong, try later.', 'Error');
                });
        }

        // $scope.checkboxclick = function () {
        //     $scope.variable = $scope.variable * -1;
        // }

        // $scope.filter = function (obj) {
        //     if ($scope.variable == -1) {
        //         return obj.key == -1;
        //     }
        // }
    }).controller('confirmModalInstanceCtrl',
    function ($rootScope, $scope, $uibModalInstance, $uibModalStack, AuthenticationService, message, $sce) {

        $scope.displayMesg = $sce.trustAsHtml(message);
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            $uibModalInstance.close('cancel');
        }
    })
