(function(){
  'use strict';

  angular
    .module('data4Test')
    .directive('idhGraph', idhGraph);

    function idhGraph(){
      var directive = {
        restrict  : 'E',
        scope     : {
          data  : '=',  // idh data
          state : '=',  // selected state
          sort  : '=',  // selected order
          label : '@'   // label used on text
        },
        link        : graphLink
      };

      return directive;

      function graphLink(scope, el, attr, vm){
        //Watch changes on state selection to render graph
        scope.$watch('state', function(){
          return scope.render(scope.data);
        },true);

        //Watch changes on sort selection to render graph
        scope.$watch('sort', function(){
          return scope.render(scope.data);
        }, true);

        //Watch changes on year selection to render graph
        scope.$watch('data', function(){
          return scope.render(scope.data);
        });

        //Create an svg tag inside element
        var svg = d3.select(el[0])
          .append('svg')
          .attr("width", "100%");

        window.onresize = function(){
          return scope.$apply()
        };
        scope.$watch(function(){
          return angular.element(window)[0].innerWidth;
        }, function(){
          return scope.render(scope.data);
        });

        //Function to draw graph
        scope.render = function(data){
          if(data !== undefined){   //Directive try to work even if random data isn't generated yet
            //Clear all previous elements
            svg.selectAll("*").remove();

            //Set measurments for graph
            var width, height, max;
            width = el[0].getBoundingClientRect().width - 20;
            height = scope.data.length * 35;
            max = 1;

            svg.attr("height", height);

            //Draw each of the rectangles
            svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("fill", "#7f9fb6")
            .attr("height", 30)
            .attr("width", 0)
            .attr("x", 10)
            .attr("id", function(d){return d.shortName})
            .attr("y", function(d, i){
              return i * 35;
            })
            .transition()
            .duration(1000)
            .attr("width", function(d){
              return d.idh/(max/width);
            });

            //Find state selected and change fill and stroke
            svg.select("#" + scope.state)
            .attr("stroke", "#004677")
            .attr("fill", "#fff");

            //Draw each of the labels
            svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("fill", "#455560")
            .attr("y", function(d,i){return i * 35 + 22})
            .attr("x", 15)
            .text(function(d){return d[scope.label] +" ("+d.idh+")";});
          }
        };

      }

    };
})()
