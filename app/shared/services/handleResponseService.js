(function () {
    'use strict';

    angular
        .module('RufeeApp')
        .factory('handleResponseService', handleResponseService);

    handleResponseService.$inject = ['toastr'];
    function handleResponseService(toastr) {
        var service = {
            handleSuccessResponse: handleSuccessResponseFn,
            handleFailureResponse: handleFailureResponseFn
        };

        return service;

        ////////////////
        function handleSuccessResponseFn(res, fn) {
            if (typeof fn == 'function') {
                fn(res.data);
            } else {
                if (res.data.result) {
                    toastr.success('Data has been submited.', 'Success');
                } else {
                    toastr.error(res.data.errors.join(','), 'Error');
                }
            }
        }
        function handleFailureResponseFn(res) {
            console.log(res);
            toastr.error('Please try later', 'Error');
        }
    }
})();