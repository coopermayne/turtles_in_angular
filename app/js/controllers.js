'use strict';

/* Controllers */

angular.module('myApp.controllers', []).


controller('newScience', function($scope) {
  $scope.determineColor = function(val) {
    if (val=="1") {
      return "black";
    }
  }
  $scope.rules = [
    {parents: '111', child: '0'},
    {parents: '110', child: '0'},
    {parents: '101', child: '0'},
    {parents: '100', child: '1'}, 
    {parents: '011', child: '1'},
    {parents: '010', child: '1'},
    {parents: '001', child: '1'},
    {parents: '000', child: '0'}
  ]
}).

controller('turtleCtrl', function($scope,favorites) {
  // every time the object changes we have 
  // to set up a new copy for the user to work with
  $scope.setFavCopy = function(options) {
    // set up a copy of the selected options so 
    // that people can save their changes...
    $scope.favCopy = angular.copy(options);
    $scope.favCopy.name = null;

    //close name form if we change to another saved favorite
    $scope.nameForm = false;
  }

  // load list of cool patterns from database
  $scope.favorites = [];
  $scope.favCopy = {};

  var loadList = function() {
    favorites.getFavorites()
        .success(handleLoadSuccess)
        .error(function(data,error,fn) {console.log(data ,error); });
  }

  var handleLoadSuccess = function(data, status) {
    for (var i = 0; i < data.length; i++) {
      data[i].rules = [];
      data[i].rules.push({input: data[i].rule1_input, output: data[i].rule1_output});
      data[i].rules.push({input: data[i].rule2_input, output: data[i].rule2_output});
      data[i].rules.push({input: data[i].rule3_input, output: data[i].rule3_output});
    };
    $scope.favorites = data;
    $scope.options = data[0];
    $scope.setFavCopy($scope.options);
  }

  ///////////////// LOAD THE LIST /////////////////////
  loadList();
  /////////////////////////////////////////////////////


  //set up button functions
  $scope.changeAngle = function(number) {
    $scope.favCopy.angle = +$scope.favCopy.angle + (+number);
  };

  $scope.changeIteration = function(number) {
    $scope.favCopy.iterations = +$scope.favCopy.iterations + (+number);
  };

  ////////////////////////////////////////////////////////////
  ///////  SAVING THE FORM TO DB 
  ////////////////////////////////////////////////////////////

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
    $scope.setFavCopy($scope.options);
    // add the saved object to the list of favorites
    // and treat it like all the rest...
  };

  $scope.save = function(options) {
    //hide name form... try to save... alert with result
    $scope.nameForm = false;

    options = favorites.prepareForDb(options);

    favorites.postFavorite(options)
      .success(handleSaveSuccess)
      .error(handleSaveFailure);
  };
}).

controller('adminCtrl', function($scope, favorites) {
  $scope.favorites=[];

  $scope.deleteFavorite = function(fav) {
    favorites.deleteFavorite(fav)
      .success(function() {
        console.log('success');
        var favIndex = $scope.favorites.indexOf(fav);
        $scope.favorites.splice(favIndex,1);
      })
      .error(function(){console.log('error')});
  }

  favorites.getFavorites()
    .success(function(data) {
      $scope.favorites = data;
    })
    .error(function() {console.log('error'); });
});

