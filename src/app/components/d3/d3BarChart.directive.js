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
          label : '@'
        },
        link        : graphLink
      };

      return directive;

      function graphLink(scope, el, attr, vm){

        scope.$watch('state', function(){
          return scope.render(scope.data);

        },true);

        scope.$watch('sort', function(){
          if(scope.sort == "A"){        //Ascending
            //$scope.$watch(function(){
              scope.data.sort(function(a, b){
                return a.idh - b.idh;
              });
            //});
            return scope.render(scope.data);
          }else if(scope.sort == "D"){  //Decending
            //$scope.$watch(function(){
              scope.data.sort(function(a, b){
                return b.idh - a.idh;
              });
            //}, true);
            return scope.render(scope.data);
          }else{                              //Alphabetical
            scope.data.sort(function(a, b){
              var nameA = a.fullName.toLowerCase(), nameB = b.fullName.toLowerCase()
              if(nameA < nameB){
                return -1;
              }else if(nameA > nameB){
                return 1;
              }else {
                return 0
              }
            });
            return scope.render(scope.data);
          }

        }, true);


        scope.$watch('data', function(){
          console.log(scope.data);
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

        scope.render = function(data){
          svg.selectAll("*").remove();

          var width, height, max;
          //width = d3.select(el[0])[0][0].offsetWidth - 20;
          width = 500;
          height = scope.data.length * 35;
          max = 1;

          svg.attr("height", height);

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

          svg.select("#" + scope.state)
            .attr("stroke", "#004677")
            .attr("fill", "#fff");

          svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("fill", "#455560")
            .attr("y", function(d,i){return i * 35 + 22})
            .attr("x", 15)
            .text(function(d){return d[scope.label] +" ("+d.idh+")";});
        };

      }

    };
})();
