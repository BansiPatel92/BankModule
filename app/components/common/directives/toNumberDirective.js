(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .directive('toNumber', toNumber);

    toNumber.$inject = ['$rootScope'];
    function toNumber($rootScope) {
        var directive = {
            link: link,
            require: 'ngModel',
        };
        return directive;

        function link(scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                return parseFloat(value || '');
            });
        }
    }
})();