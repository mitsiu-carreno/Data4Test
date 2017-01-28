(function(){
  'use strict';

  angular
    .module('data4Test')
    .service('helper', helper);

    function helper() {

      this.generateRandom = generateRandom;

      /*
      This function generates a random int or float depending on the number of decimals
      int min -> minimum number
      int max -> maximum number
      int decimals -> 0 outputs Int
                   -> 0 outputs float
      */
      function generateRandom(min, max, decimals){
        var newRandom = (Math.random() * (max - min) + min).toFixed(decimals);
        return newRandom;
      }
    }
})();
