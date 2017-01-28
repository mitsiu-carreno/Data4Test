(function(){
  'use strict';

  angular
    .module('data4Test')
    .service('helper', helper);

    function helper() {
      this.generateRandom = generateRandom;

      function generateRandom(min, max, decimals){
        var newRandom = (Math.random() * (max - min) + min).toFixed(decimals);
        return newRandom;
      }
    }
})();
