(function() {
  'use strict';

  angular
  .module('data4Test')
  .controller('MainController', MainController);

  /** @ngInject */
  function MainController($interval, helper, $http) {
    var vm = this;

    vm.states = [];         //Array that contains every state and it shortname
    vm.data = [];           //Array that contains every year info with every state IDH randomly generated
    vm.orderOptions = [{name:"Ascendente", id:"A"},{name:"Descendente", id:"D"},{name:"Alfabéticamente", id:"AZ"}];
    vm.currentYear = new Date().getFullYear();
    vm.selectedYear = new Date().getFullYear();     //Default year selected
    vm.selectedState = 1;   //Default state selected
    vm.selectedOrder = vm.orderOptions[0].id;       //Default order selected
    vm.dataFilteredByYear = [];   //Array with idh only from the year selected


    vm.createData = createData;
    vm.getDataGraph = getDataGraph;
    vm.sortDataGraph = sortDataGraph


    //Ajax to get the list of states
    $http.get('app/components/helper/states.json').success(function(response, status, headers, config){
      vm.states = response;
      createData();
    }).error(function(response, status, headers, config){
      console.error(response);
      alert('Desapareció la nación!');
    });

    function createData(){
      //Generate random number of years between 5-10
      var years = helper.generateRandom(5, 10, 0);

      //Foreach year generate random idh by state
      for(var year=0; year<=years; year++){
        var newIdhEntry = {
          year        : vm.currentYear - year ,
          states      : angular.copy(vm.states),
          averageIdh  : 0,
          lowestIdh   : 1,
          highestIdh  : 0
        };


        var idhSum = 0; //summation of idh
        //Foreach state generate random IDH between 0-1 with 2 decimals
        angular.forEach(newIdhEntry.states, function(state, key) {
          state.idh = helper.generateRandom(0, 1, 2);

          //Calculate the average, lowest and highest idh from selected year
          idhSum += parseFloat(state.idh);
          if(state.idh > newIdhEntry.highestIdh)
            newIdhEntry.highestIdh = state.idh;
          if(state.idh < newIdhEntry.lowestIdh)
            newIdhEntry.lowestIdh = state.idh;
        });
        //Calc average (summation / length)
        newIdhEntry.averageIdh = idhSum/newIdhEntry.states.length;

        //Add the new entry to the data
        vm.data.push(newIdhEntry);
      }
      getDataGraph();
      sortDataGraph();
    }

    // Separates only the data from the year selected
    function getDataGraph (){
      angular.forEach(vm.data, function(yearEntry, key){
        if(yearEntry.year == vm.selectedYear){
          vm.dataFilteredByYear = angular.copy(yearEntry);
        }
      });
    }

    //Sort the data according to input
    function sortDataGraph (){
      if(vm.selectedOrder == "A"){        //Ascending
        vm.dataFilteredByYear.states.sort(function(a, b){
          return a.idh - b.idh;
        });
      }else if(vm.selectedOrder == "D"){  //Decending
        vm.dataFilteredByYear.states.sort(function(a, b){
          return b.idh - a.idh;
        });
      }else{                              //Alphabetical
        vm.dataFilteredByYear.states.sort(function(a, b){
          var nameA = a.fullName.toLowerCase(), nameB = b.fullName.toLowerCase()
          if(nameA < nameB){
            return -1;
          }else if(nameA > nameB){
            return 1;
          }else {
            return 0
          }
        });
      }
    }

    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("../app/components/fixedData.tsv", function(d) {
      d.frequency = +d.frequency;
      return d;
    }, function(error, data) {
      if (error) throw error;

      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

      g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

      g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
    });

    /*
    $interval(function(){
      console.log(helper.generateRandom(0, 10, 4));
     }, 1000);
     */
  }
})();
