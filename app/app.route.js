/**
 * Configure the Routes
 */
/*(function () {
    'use strict';*/

config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise('/');
    
    // $urlRouterProvider.otherwise("/");
    // $urlRouterProvider.otherwise(function ($injector) {
    //    var $state = $injector.get('$state');
    //    return $state.go('/');
    // });
    
    var header = {
        templateUrl: 'components/common/headerVIew.html'
    }
    var footer = {
        templateUrl: 'components/common/footerView.html'
    }
    var bankHeader = {
        templateUrl: 'components/common/bankheaderview.html'
    }
    var bankFooter = {
        templateUrl: 'components/common/bankfooterview.html'
    }
    
    $stateProvider

        .state("bankslogin", {
        url: "/banks/login",
        views: {
            // header: bankHeader,
            content: {
                templateUrl: 'components/banks/auth/banklogin.html',
            }
            // footer: bankFooter
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [
                                'components/banks/auth/banklogincontroller.js',
                            ]
                        },
                    ]);
                }]
        }
    })
        .state("bankstatus", {
        url: "/banks/bankstatistics",
        views: {
            
            header: bankHeader,
            content: {
                templateUrl: 'components/banks/status/statistics.html',
            },
            footer: bankFooter
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'smart-table',
                            files: [
                                'shared/js/angular-smart-table/smart-table.debug.min.js'
                            ]
                        },
                        {
                            files: [
                                'components/banks/status/statisticscontroller.js'
                            ]
                        }
                    ]);
                }]
        }
    })
        .state("affiliatorsdashboard", {
        url: "/affiliators/dashboard",
        views: {
            header: header,
            content: {
                templateUrl: 'components/affiliators/home/affiliatordashboard.html',
            },
            footer: footer
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'smart-table',
                            files: [
                                'shared/js/angular-smart-table/smart-table.debug.min.js'
                            ]
                        },
                        {
                            files: [
                                'components/affiliators/home/affiliatordashboardcontroller.js',
                            ]
                        },
                    ]);
                }]
        }
    })
        .state("pagination", {
        url: "/pagination",
        views: {
            content: {
                templateUrl: 'components/common/directives/pagination.custom.html',
            }
        }
    })
        .state("banksdashboard", {
        url: "/banks/dashboard",
        views: {
            header: bankHeader,
            content: {
                templateUrl: 'components/banks/home/bankdashboard.html',
            },
            footer: bankFooter
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'smart-table',
                            files: [
                                'shared/js/angular-smart-table/smart-table.debug.min.js'
                            ]
                        },
                        {
                            files: [
                                'components/banks/home/bankdashboardcontroller.js',
                            ]
                        },
                    ]);
                }]
        }
    })
        .state("comingsoon", {
        url: "/comingsoon",
        views: {
            header: header,
            content: {
                templateUrl: 'components/home/comingsoonview.html',
            },
            footer: footer
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [
                                'components/home/comingsooncontroller.js',
                            ]
                        },
                    ]);
                }]
        }
    })
        .state("banksapplicationdetail", {
        url: "/banks/application/:id",
        views: {
            
            header: bankHeader,
            content: {
                templateUrl: 'components/banks/application/application.html',
            },
            footer: bankFooter
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'angular-chart',
                            files: [
                                'shared/js/angular-charts/angular-chart.js'
                            ]
                        },
                        {
                            name: 'ion.rangeslider',
                            files: [
                                'shared/js/ion-rangeslider/js/ion.rangeSlider.min.js',
                                'shared/js/ion-range-slider/ionic-range-slider.min.js'
                            ]
                        },
                        {
                            name: 'jkuri.slimscroll',
                            files: [
                                'shared/js/angular-slimscroll/ngSlimscroll.min.js'
                            ]
                        },
                        {
                            files: [
                                'components/common/directives/ng_only_number.js',
                                'components/banks/application/applicationcontroller.js'
                            ]
                        }
                    ]);
                }]
        }
    })
        .state("login", {
        url: "/login",
        views: {
            header: {
                templateUrl: 'components/auth/loginView.html',
            }
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            '//connect.facebook.net/en_US/sdk.js',
                            'https://apis.google.com/js/platform.js',
                            'components/auth/loginController.js',
                            'shared/services/fbAuthService.js',
                            'shared/services/googleAuthService.js',
                            'shared/services/linkedinAuthService.js',
                            'shared/services/usersService.js',
                            'shared/services/twitterService.js'
                        ]
                    });
                }]
        }
    })
        
       
        .state("banksprofile", {
        url: "banks/profile",
        views: {
            header: bankHeader,
            content: {
                templateUrl: 'components/users/profileView.html',
            },
            footer: bankFooter
        },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'imageCropper',
                            files: [
                                'shared/js/angular-image-cropper/dist/angular-image-cropper.min.js'
                            ]
                        },
                        {
                            files: [
                                'components/users/profileController.js'
                            ]
                        }]);
                }]
        }
    })  
       
}

run.$inject = ['$rootScope', '$window', '$q', '$state', '$http', '$anchorScroll', '$cookieStore'];
function run($rootScope, $window, $q, $state, $http, $anchorScroll, $cookieStore) {
    //console.log(FB);
    // $rootScope.$state = $state;
    if ($cookieStore.get('userInfo')) {
        $rootScope.globals = $cookieStore.get('userInfo');
    }
    //console.log($rootScope.globals);
    
    $rootScope.fbInt = false;
    $window.fbAsyncInit = function () {
        // Executed when the SDK is loaded
        //console.log('SDK is loaded');
        FB.init({
            appId: window.FacebookApiId,
            // channelUrl: 'channel.html',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.6'
        });
        $rootScope.FBInt = true;
    }
    $anchorScroll.yOffset = 60;
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    });
    
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //document.body.scrollTop = document.documentElement.scrollTop = 0;		
        $rootScope.titlename = toState;    	
    });
}
app.config(config).run(run);
//})