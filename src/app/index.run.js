(function() {
  'use strict';

  angular
    .module('data4Test')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
