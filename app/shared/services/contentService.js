(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('contentService', contentService);

    contentService.$inject = ['$rootScope', '$http','handleResponseService'];
    function contentService($rootScope, $http,handleResponseService) {
        var service = {
            getContentById: getContentByIdFn
        };

        return service;

        ////////////////
        function getContentByIdFn(id, fn) {
            var req = {
                method: 'GET',
                url: window.ServiceBaseUrl + 'cms?id=' + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }
            
            return $http(req).then(function (response) {
                if (response.data.result == true)
                    fn(response.data.response);
                else
                    fn(null);
            }, function (response) {
                console.log(response);
            });
        }
        function handleSuccess(data) {
            console.log(data);
        }
        function handleError(data) {
            console.log(data);
        }
    }
})();