(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .controller('ProfileController', ProfileController)
        .directive("fileread", [function () {
            return {
                scope: {
                    fileread: "="
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        var reader = new FileReader();
                        reader.onload = function (loadEvent) {
                            scope.$apply(function () {
                                scope.fileread.data = loadEvent.target.result;
                            });
                        }
                        //if (!scope.fileread)
                        scope.fileread = {};
                        //console.log(scope.fileread);
                        scope.fileread.name = changeEvent.target.files[0].name;
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    });
                }
            }
        }]);

    ProfileController.$inject = ['$rootScope', '$scope', '$state', 'toastr', 'AuthenticationService','userService','$uibModal'];
    function ProfileController($rootScope, $scope, $state, toastr, AuthenticationService,userService, $uibModal) {
        $rootScope.titlename = 'My Profile';
        $scope.profileuser = {};
        $scope.profileuser.email = '';
        $scope.propic = null;

        $scope.$watch(
            function () { return $scope.propic; },
            function (newValue, oldValue) {
                // console.log('newValue');
                // console.log(newValue);
                //console.log('oldValue', new Date());
                // console.log(oldValue);
                if (newValue !== oldValue && newValue.name) {
                    $scope.onImageSelect(newValue);
                }
            }
        );

        AuthenticationService.Authenticate();
        function getUserProfileData() {
            userService.getUserById($rootScope.bankGlobals.currentUser.userId, function (res) {
                if (res) {
                    // $scope.$apply(function(){
                        $scope.profileuser = res;
                        
                    // });
                    //$scope.profileuser.profileImageName = '';
                    //console.log($scope.profileusesr);
                } else {
                    toastr.error('Something went wrong, try later.', 'Error');
                }
            });
        }
        getUserProfileData();

        $scope.saveUserData = function () {
            //alert('submit');
            var userdata = {};
            userdata.userId = $scope.profileuser.id;
            userdata.firstName = $scope.profileuser.firstName;
            userdata.lastName = $scope.profileuser.lastName;
            userdata.email = $scope.profileuser.email;
            userdata.address1 = $scope.profileuser.address1 || '';
            userdata.address2 = $scope.profileuser.address2 || '';
            userdata.city = $scope.profileuser.city || '';
            userdata.state = $scope.profileuser.state || '';
            userdata.zip = $scope.profileuser.zip || '';
            userdata.country = $scope.profileuser.country || '';
            userdata.phone = $scope.profileuser.phone || '';
            userService.updateUserData(userdata).then(function (res) {
                if (res.result) {
                    toastr.success('Profile has been updated successfully', 'Success');

                    AuthenticationService.SetCredentials($rootScope.bankGlobals.currentUser.userId,
                                $rootScope.bankGlobals.currentUser.role,
                                $scope.profileuser.firstName,
                                $scope.profileuser.lastName,
                                $rootScope.bankGlobals.currentUser.email, null, false,
                                $rootScope.bankGlobals.currentUser.phone);

                }
                else
                    toastr.error(res.responseMessage, 'Error');
            }, function (res) {
                toastr.error('Something went wrong, try later.', 'Error');
            });
        }

        $scope.editEmail = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'changeEmailModalContent.html',
                controller: 'changeEmailModalInstanceCtrl',
                size: 'md',
                resolve: {
                    email: function () {
                        return $scope.profileuser.email;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                getUserProfileData();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.onImageSelect = function (imageBase64) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'changeDPModalContent.html',
                controller: 'changeDPModalInstanceCtrl',
                size: 'md',
                resolve: {
                    imageBase64: function () {
                        return imageBase64;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                getUserProfileData();
                document.getElementById("proImageInput").value = "";
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
                document.getElementById("proImageInput").value = "";
            });
        }
    };
    angular
        .module('RufeeApp').controller('changeEmailModalInstanceCtrl',
        function ($rootScope, $scope, toastr, $uibModalInstance, $uibModalStack, $uibModal, userService, email, AuthenticationService) {
            $scope.oldemail = email;
            $scope.emailform = {};
            $scope.emailform.email = '';
            $scope.emailform.otp = '';
            $scope.view = 'email';
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
            $scope.close = function () {
                $uibModalInstance.close('');
            }
            $scope.resendOTP = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'confirmModalContent.html',
                    controller: 'confirmModalInstanceCtrl',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return 'Are you sure to resend OTP?';
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $(".loginOverLay").show();
                    otpService.sendOTP(2, $rootScope.bankGlobals.currentUser.userId, $scope.emailform.email, $rootScope.bankGlobals.currentUser.firstName, $rootScope.bankGlobals.currentUser.phone, function (params) {
                        if (params == true) {
                            toastr.success('One-Time-Password has been sent to your email address', 'Sent');
                        } else {
                            toastr.error(params, 'Error');
                        }
                    })
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
            $scope.submitEmailForm = function () {
                if ($scope.view == 'email') {
                    if ($scope.emailform.email != email) {
                        $(".loginOverLay").show();
                        otpService.sendOTP(2, $rootScope.bankGlobals.currentUser.userId, $scope.emailform.email, $rootScope.bankGlobals.currentUser.firstName, $rootScope.bankGlobals.currentUser.phone, function (params) {
                            if (params == true) {
                                toastr.success('One-Time-Password has been sent to your email address', 'Sent');
                                $scope.view = 'otp';
                            } else {
                                toastr.error(params, 'Error');
                            }
                        })
                    } else {
                        toastr.error('Please enter diffrent email than old one', 'Error');
                    }
                } else {
                    var userdata = {};
                    userdata.userId = $rootScope.bankGlobals.currentUser.userId;
                    userdata.otp = $scope.emailform.otp;
                    userdata.new_email = $scope.emailform.email;
                    $(".loginOverLay").show();
                    userService.updateUserData(userdata).then(function (res) {
                        if (res.result) {
                            toastr.success('Profile has been updated successfully', 'Success');
                            AuthenticationService.SetCredentials($rootScope.bankGlobals.currentUser.userId,
                                $rootScope.bankGlobals.currentUser.role,
                                $rootScope.bankGlobals.currentUser.firstName,
                                $rootScope.bankGlobals.currentUser.lastName,
                                $scope.emailform.email, null, false,
                                $rootScope.bankGlobals.currentUser.phone);
                            $scope.close();
                        }
                        else
                            toastr.error(res.responseMessage, 'Error');
                    }, function (res) {
                        toastr.error('Something went wrong, try later.', 'Error');
                    });
                }
            }
        }).controller('changeDPModalInstanceCtrl',
        function ($rootScope, $scope, toastr, $uibModalInstance, $uibModalStack, userService, imageBase64, AuthenticationService) {

            //console.log(imageBase64.data.length);
            console.log(imageBase64.name);
            $scope.imageUrlOrBase64 = imageBase64.data;
            console.log($scope.imageUrlOrBase64.length);
            //$scope.$apply();
            $scope.resultImage = 0;
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
            $scope.close = function () {
                $uibModalInstance.close('');
            }

            $scope.myButtonLabels = {
                rotateLeft: '<span title="rotate left" class="fa fa-undo"></span>',
                rotateRight: '<span title="rotate right" class="fa fa-repeat"></span>',
                zoomIn: '<span title="zoom in" class="fa fa-search-plus"></span>',
                zoomOut: '<span title="zoom out" class="fa fa-search-minus"></span>',
                fit: '<span title="fit to screen" class="fa fa-picture-o"></span>',
                crop: '<span title="done" class="fa fa-check"></span>'
            }

            $scope.updateResultImage = function (base64) {
                //console.log('updateResultImage');
                if ($scope.imageUrlOrBase64 != base64 && $scope.resultImage == 0) {
                    //$scope.resultImage = base64;
                    $scope.resultImage = base64.length
                    //console.log('resultImage');
                    updatePicture(base64);
                }
            };

            $scope.getCropperApi = function (api) {
                //api.zoomIn(0.01);
                //api.zoomOut(0.01);
                //api.rotate(0);
                api.fit();
                //api.crop();
                //api.remove();
                //$scope.resultImage = api.crop();
            };

            function updatePicture(fileData) {
                console.log("updated picture!!!!");
                //userService
                //console.log(fileData);
                // var name = imageBase64.name
                // console.log(name);
                var filename = guid() + imageBase64.name.substring(imageBase64.name.lastIndexOf('.'));
                userService.changeUserImage(fileData, filename).then(function (res) {
                    if (res.result) {
                        alert('Profile image has been updated successfully');
                        AuthenticationService.SetCredentials($rootScope.bankGlobals.currentUser.userid, $rootScope.bankGlobals.currentUser.role,
                            $rootScope.bankGlobals.currentUser.firstName, $rootScope.bankGlobals.currentUser.lastName, $rootScope.bankGlobals.currentUser.email,
                            null, false, $rootScope.bankGlobals.currentUser.phone, filename);
                        $scope.close();
                    }
                    else
                        toastr.error(res.responseMessage, 'Error');
                }, function (res) {
                    toastr.error('Something went wrong, try later.', 'Error');
                });
            }

            // setTimeout(function () {
            //     console.log(angular.element('.imgCropper-wrapper').length);
            //     var wrapper = angular.element('<div style="border:1px solid #22eeff;border-radius:100%;background:rgba(255,255,255,0.5)"/>');
            //     angular.element('.imgCropper-wrapper').wrap(wrapper);
            // }, 1000);
        })
})();