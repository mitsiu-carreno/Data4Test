(function() {
  'use strict';

  angular
  .module('data4Test')
  .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, helper, $http) {
    var vm = this;

    vm.states = [];         //Array that contains every state and it shortname
    vm.data = [];           //Array that contains every year info with every state IDH randomly generated
    vm.orderOptions = [{name:"Ascendente", id:"A"},{name:"Descendente", id:"D"},{name:"Alfabéticamente", id:"AZ"}];
    vm.currentYear = new Date().getFullYear();
    vm.selectedYear = new Date().getFullYear();     //Default year selected
    vm.selectedState = "Ags";   //Default state selected
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
        angular.forEach(newIdhEntry.states, function(state) {
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
      angular.forEach(vm.data, function(yearEntry){
        if(yearEntry.year == vm.selectedYear){
          vm.dataFilteredByYear = angular.copy(yearEntry);
        }
      });
      sortDataGraph();
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
  }
})();
