(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .factory('fbAuth', fbAuth);
    
    fbAuth.$inject = ['$rootScope', '$http', 'userService', 'toastr', '$window'];
    function fbAuth($rootScope, $http, userService, toastr, $window) {
        var service = {
            watchLoginChange: fbLoginStatusChange,
            getUserInfo: getFBUserInfo,
            fbInitiIfnot: fbInitiIfnotFn,
            fbShare: fbShareFn
        };
        
        var fields = [
            'id',
            'name',
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'link',
            'age_range',
            'birthday',
            'email',
            'hometown'
        ].join(',');
        
        return service;
        ////////////////
        function fbInitiIfnotFn() {
            if ($rootScope.FBInt == false) {
                $window.fbAsyncInit();
            }
        }
        
        function fbLoginStatusChange() {
            // console.log('fbLoginStatusChange');
            
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    getFBUserInfo();
                } else { //if (response.status !== 'not_authorized') {
                    FB.login(function (response) {
                        if (response.status === 'connected')
                            getFBUserInfo();
                        else {
                            console.log('unable to connecte to facebook, try later');
                            $(".loginOverLay").hide();
                            //toastr.error('unable to connecte to facebook, try later', 'Error');
                        }
                    }, { scope: 'public_profile,email' });
                }
            });
        }
        
        function getFBUserInfo() {
            //console.log('getFBUserInfo');
            $(".loginOverLay").show();
            FB.api('/me', { fields: fields }, function (res) {
                $rootScope.$apply(function () {
                    //$rootScope.user = res;
                    $rootScope.user.id = res.id;
                    $rootScope.user.first_name = res.first_name;
                    $rootScope.user.last_name = res.last_name;
                    $rootScope.user.email = res.email;
                    $rootScope.user.data = res;
                    $rootScope.user.media = 'fb';
                });
                //console.log($rootScope.user);
                if (Object.keys($rootScope.user).length) {
                    //alert('done');
                    userService.getUserInfo();
                } else {
                    $(".loginOverLay").hide();
                    //alert('not done');
                    //toastr.error('unable to connecte to facebook, try later', 'Error');
                }
            });
        }
        
        function fbShareFn() {
            FB.ui({
                method: 'feed',
                name: window.FacebookShareName, link: window.RupeeFinLiveURL, description: window.FacebookShareDescryption
            }, function (response) { if (response && response.post_id) { toastr.success('Your post has been shared successfully', 'Success'); } });
        }
    }
})();