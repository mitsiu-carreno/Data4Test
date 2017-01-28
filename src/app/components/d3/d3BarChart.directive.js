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

        //Create an svg tag inside element
        var svg = d3.select(el[0])
          .append('svg')
          .attr("width", "100%")
          .attr("height", "100%");

        var margin = {top:20, right:20, bottom:30, left:40},
          width  =+ svg.attr('width') - margin.left - margin.right,
          height =+ svg.attr('height') - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.tsv("../app/components/fixedData.tsv", function(d){
          d.frequency =+ d.frequency;
          return d;
        }, function(err, data){
          if(err){
            console.error("Err while reading tvs" + err);
            throw err;
          }
        })
      }

      function idhGraphController(){
        var vm = this;

        console.log('In directive controller');
      }
    }
})();
