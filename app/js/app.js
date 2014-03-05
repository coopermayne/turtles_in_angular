'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [])

app.controller('appCtrl', function($http, $scope,Favorites) {
  $scope.favorites = [];
  $scope.options = {};

  var handleSuccess = function(data, status) {
    for (var i = 0; i < data.length; i++) {
      data[i].rules = [];
      data[i].rules.push({input: data[i].rule1_input, output: data[i].rule1_output});
      data[i].rules.push({input: data[i].rule2_input, output: data[i].rule2_output});
      data[i].rules.push({input: data[i].rule3_input, output: data[i].rule3_output});
    };
    console.log(data);
    $scope.favorites = data;
    $scope.options = data[0];
  }

  Favorites.getFavorites()
      .success(handleSuccess)
      .error(function() {console.log('fail'); });

  $scope.change = function() {
    console.log($scope.options);
  };

  $scope.render = function(options) {
    var t = new Turtle(options);
  };

  $scope.save = function(options) {
    alert('saving....');
  };

  $scope.$watch('options.angle',function() {
    var a = new AngleDisplay($scope.options.angle);
  }, true);

  $scope.$watch('options',function() {
    if ($scope.options.angle) {
      $scope.render($scope.options);
    }
  }, true);

  $scope.changeAngle = function(number) {
    $scope.options.angle = +$scope.options.angle + (+number);
  };

  $scope.changeIteration = function(number) {
    $scope.options.iterations = +$scope.options.iterations + (+number);
  };

  $scope.changeLineWidth= function(number) {
    //set to default if it hadn't been set
    
    //DISABLED...
    console.log('disable... was making program slow for some reason');

    //$scope.options.lineWidth = $scope.options.lineWidth || 1;
    //if (number===-1) {
      //$scope.options.lineWidth = +$scope.options.lineWidth - (+$scope.options.lineWidth/3);
    //} else if (number ===1){
      //$scope.options.lineWidth = +$scope.options.lineWidth + (+$scope.options.lineWidth/3);
    //}
  };
});

app.directive('supersuper', function() {
  return function(scope, element, attr) {
  };
});

app.directive('previewangle', function() {
  return function(scope, element, attr) {
  };
});

app.factory('Favorites', function($http) {
  return {
    getFavorites: function(){
      return $http.get('http://0.0.0.0:3000/saved_params');
    }
  }
});
