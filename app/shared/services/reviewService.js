(function() {
'use strict';

    angular
        .module('RufeeApp')
        .factory('reviewService', reviewService);

    reviewService.$inject = ['$rootScope','$http'];
    function reviewService($rootScope,$http) {
        var service = {
            saveReviews:saveReviewsFn,
            getReviews:getReviewsFn
        };
        
        return service;

        function getReviewsFn(fn) {
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'review',
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            $http(req).then(function (res) {
                fn(res.data);
            }, function (res) {
                console.log(res);
                fn(null);
            });
        }
        function saveReviewsFn(fn) {
            var req = {
                method: 'POST',
                url: window.ServiceBaseUrl + 'review',
                data: $rootScope.reviewdata,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            $http(req).then(function (res) {
                fn(res.data);
            }, function (res) {
                console.log(res);
                fn(null);
            });
        }
    }
})();