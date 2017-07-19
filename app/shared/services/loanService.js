(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .service('loandService', loandService);

    loandService.$inject = ['$rootScope', '$http', '$state'];
    function loandService($rootScope, $http, $state) {
        this.getLoanTypes = getLoanTypesFn;

        ////////////////

        function getLoanTypesFn(fn) {
            var req = {
                method: 'GET',
                async: false,
                url: window.ServiceBaseUrl + 'loans',
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }

            $http(req).then(function (res) {
                if (res.data.result) {
                    $rootScope.loans = res.data.response;
                    if(typeof fn == 'function') fn();
                } else {

                }
            }, function (data) {

            });
        }
    }
})();