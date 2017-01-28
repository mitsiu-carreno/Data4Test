(function(){
  'use strict';

  angular
    .module('data4Test')
    .directive('idhGraph', idhGraph);

    function idhGraph(){
      var directive = {
        restrict  : 'E',
        scope     : {
          data  : '@',  // idh data
          state : '@',  // selected state
          sort  : '@',  // sort mode
          year  : '@'   // selected year
        },
        link        : graphLink,
        controller  : idhGraphController,
        controllerAs: 'vm'
      };

      return directive;

      function graphLink(scope, el, attr, vm){
        console.log(scope);
      }

      function idhGraphController(){
        var vm = this;

        console.log('In directive controller');
      }
    }
})();
