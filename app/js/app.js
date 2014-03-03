'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [])

app.controller('appCtrl', function($scope) {
});

app.controller('appCtrl', function($scope,Favorites) {
  $scope.favorites = Favorites;
  $scope.options = Favorites[0];
  $scope.change = function() {
    console.log($scope.options);
  };

  $scope.render = function(options) {
    var t = new Turtle(options);
  }

  $scope.$watch('options',function() {
    console.log($scope.options);
    $scope.render($scope.options);
  }, true);

  $scope.incrementAngle = function() {
    $scope.options.angle += 1;
  };

  $scope.decrementAngle = function() {
    $scope.options.angle -= 1;
  };

  $scope.nextIteration = function() {
    $scope.options.iterations += 1;
  };

  $scope.prevIteration = function() {
    $scope.options.iterations -= 1;
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

app.factory('Favorites', function() {
  return [
    {
      id: 0,
      name: 'Sierpinski Triangle',
      axiom: 'FX',
      rules: [
        {
          input: 'X',
          output: 'YlFXlFY'
        }, {
          input: 'Y',
          output: 'XrFYrFX'
        }, {
          input: null,
          output: null
        }
      ],
      iterations: 6,
      angle: 60
    },
    {
      id: 1,
      name: 'Dragon',
      axiom: "FX",
      rules: [
        {
          input: 'X',
          output: 'XlYFl'
        }, {
          input: 'Y',
          output: 'rFXrY'
        }, {
          input: null,
          output: null
        }
      ],
      iterations: 6,
      angle: 90
    },
    {
      id: 2,
      name: 'Plant',
      axiom: 'FX',
      rules: [
        {
          input: 'X',
          output: 'Fr[[X]lX]lF[lFX]rX'
        }, {
          input: 'F',
          output: 'FF'
        }, {
          input: null,
          output: null
        }
      ],
      iterations: 7,
      angle: 30
    },
    {
      id: 3,
      name: 'Koch Curve',
      axiom: 'FrrFrrF',
      rules: [
        {
          input: 'F',
          output: 'FlFrrFlF'
        }, {
          input: null,
          output: null
        }, {
          input: null,
          output: null
        }
      ],
      iterations: 8,
      angle: 60 + 25.8
    }
  ];
});
