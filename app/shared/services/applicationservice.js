(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('ApplicationService', ApplicationService);

    ApplicationService.$inject = ['$rootScope', '$http'];
    function ApplicationService($rootScope, $http) {
        var service = {
            getApplicationDetail: getApplicationDetailFn,
            getApplicationDetailForUser: getApplicationDetailForUserFn
        };

        return service;

        function getApplicationDetailFn(appid) {
            //http://localhost:8000/api/applications/detail?app_numb=8346794
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'applications/detail?app_numb=' + appid,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res;
            }, function (res) {
                return res;
            });
        }

        function getApplicationDetailForUserFn(appid) {
            //http://localhost:8000/api/applications/8346794/userdetail
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'applications/'+ appid+'/userdetail' ,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            return $http(req).then(function (res) {
                return res;
            }, function (res) {
                return res;
            });
        }
    }
})();