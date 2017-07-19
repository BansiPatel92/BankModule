(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .directive('capitalizeFirst', function (uppercaseFilter, $parse) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs, modelCtrl) {
                
                scope.$watch("ngModel", function () {
                    scope.ngModel = scope.ngModel.replace(/^(.)|\s(.)/g, function (v) { return v.toUpperCase(); });
                });
            }
        };
    });
})();