(function () {
    'use strict';
    
    angular
        .module('RufeeApp')
        .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                //var type = scope.$eval(attrs.documentType);
                //element.bind('change', onChangeHandler);
                element.bind('change', function (event) {
                    scope.$apply(function () {
                        onChangeHandler(event);
                        element.val(null);        
                    });
                });
            }
        };
        
    });
})();