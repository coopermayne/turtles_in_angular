'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [])

app.controller('appCtrl', function($http, $scope,favorites) {
  
  $scope.setUpCopy = function(options) {
    //set up a copy of the selected options so that people can save their changes...
    $scope.favCopy = angular.copy(options);
    $scope.favCopy.name = null;
    $scope.favCopy.creator = 'user';
    $scope.favCopy.id = null;

    //close name form if we change to another saved favorite
    $scope.nameForm = false;
  }

  //load list of cool patterns from database
  $scope.favorites = [];
  $scope.favCopy = {};
  var handleLoadSuccess = function(data, status) {
    for (var i = 0; i < data.length; i++) {
      data[i].rules = [];
      data[i].rules.push({input: data[i].rule1_input, output: data[i].rule1_output});
      data[i].rules.push({input: data[i].rule2_input, output: data[i].rule2_output});
      data[i].rules.push({input: data[i].rule3_input, output: data[i].rule3_output});
    };
    $scope.favorites = data;
    $scope.options = data[0];
    $scope.setUpCopy($scope.options);
  }
  var loadList = function() {
    favorites.getFavorites()
        .success(handleLoadSuccess)
        .error(function() {console.log('fail'); });
  }

  loadList();

  var render = function(options) {
    new Turtle(options); //is it ok to not assing this to a var?...
  };

  //make a new angleDisplay whenever there is new data
  $scope.$watch('favCopy.angle',function() {
    new AngleDisplay($scope.favCopy.angle);
  }, true);

  $scope.$watch('favCopy',function(newValue,oldValue) {
    if ($scope.favCopy.angle) {
      render($scope.favCopy);
    }
    console.log();
  }, true);

  //set up button functions
  $scope.changeAngle = function(number) {
    $scope.favCopy.angle = +$scope.favCopy.angle + (+number);
  };
  $scope.changeIteration = function(number) {
    $scope.favCopy.iterations = +$scope.favCopy.iterations + (+number);
  };

  //saving form
  $scope.nameForm = false;
  $scope.showNameForm = function() {
    $scope.nameForm = true;
  };

  $scope.cancelSave = function() {
    //reset name?
    $scope.nameForm = false;
  };

  var handleSaveFailure = function() {
    console.log('failure')
    // alert that it didn't work...
    // info about what the problem was
  };

  var handleSaveSuccess = function(data) {
    console.log('success');
    // make an alert saying successfully saved....
    $scope.favorites.unshift($scope.favCopy);
    $scope.options = $scope.favorites[0];
    $scope.setUpCopy($scope.options);
    // add the saved object to the list of favorites
    // and treat it like all the rest...
  };

  var prepareForDb = function(options) {
    return { saved_param: {
        creator: options.creator,
        name: options.name,
        axiom: options.axiom,
        rule1_input: options.rule1_input,
        rule1_output: options.rule1_output,
        rule2_input: options.rule2_input,
        rule2_output: options.rule2_output,
        rule3_input: options.rule3_input,
        rule3_output: options.rule3_output,
        iterations: options.iterations,
        angle: options.angle
      }
    }
  };

  $scope.save = function(options) {
    //hide name form... try to save... alert with result
    $scope.nameForm = false;

    options = prepareForDb(options);

    favorites.postFavorite(options)
      .success(handleSaveSuccess)
      .error(handleSaveFailure);
  };
});

app.factory('favorites', function($http) {
  return {
    getFavorites: function(){
      //return $http.get('http://0.0.0.0:3000/saved_params');
      return $http.get('http://shielded-badlands-4041.herokuapp.com/saved_params');
    },
    postFavorite: function(fav) {
      //return $http.post('http://0.0.0.0:3000/saved_params', fav);
      return $http.post('http://shielded-badlands-4041.herokuapp.com/saved_params', fav);
    }
  }
});
