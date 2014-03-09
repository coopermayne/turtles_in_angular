'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/mainApp.html',
      controller: 'appCtrl'
  }).
    when('/new_science', {
      templateUrl: 'templates/newScience.html',
      controller: 'newScience'
  }).
    when('/admin', {
      templateUrl: 'templates/adminApp.html',
      controller: 'adminCtrl'
  });
}]);

app.controller('newScience', function($scope) {
  $scope.determineColor = function(val) {
    console.log('black');
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
});

app.directive('newSci', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
    }
  }
});

app.directive('updateOnChange', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      //make a new angleDisplay whenever there is new data
      scope.$watch('favCopy.angle',function() {
        new AngleDisplay(scope.favCopy.angle, element[0]);
      }, true);
    }
  }
});

app.directive('supersuper', function() {
  return {
    restric: 'A',
    link: function(scope, element, attr) {
      scope.$watch('favCopy',function() {
        if (scope.favCopy.angle) {
          new Turtle(scope.favCopy, element[0]);
        }
      }, true);
    }
  }
});

app.controller('appCtrl', function($scope,favorites) {

  $scope.changeAngleOnClick = function(ev) {
    var rx= ev.pageX - ev.currentTarget.getBoundingClientRect().left - ev.currentTarget.getBoundingClientRect().width/2;
    var ry = ev.currentTarget.getBoundingClientRect().bottom - ev.pageY;
    var newAngle = (180*Math.atan(ry/rx)/Math.PI).toFixed(1);
    if( newAngle<0 ){
      $scope.favCopy.angle = Math.abs(newAngle);
    }else{
      $scope.favCopy.angle = 180 - newAngle;
    }
  }

  $scope.setFavCopy = function(options) {
    // set up a copy of the selected options so 
    // that people can save their changes...
    $scope.favCopy = angular.copy(options);
    $scope.favCopy.name = null;

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
    $scope.setFavCopy($scope.options);
  }
  var loadList = function() {
    favorites.getFavorites()
        .success(handleLoadSuccess)
        .error(function(data,error,fn) {console.log(data ,error); });
  }

  loadList();


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
});

app.controller('adminCtrl', function($scope, favorites) {
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

app.factory('favorites', function($http) {
  //var url = 'http://0.0.0.0:3000/saved_params';
  var url = 'http://shielded-badlands-4041.herokuapp.com/saved_params';
  return {
    prepareForDb: function(options) {
      return { saved_param: {
          creator: options.creator,
          name: options.name,
          axiom: options.axiom,
          rule1_input: options.rules[0].input,
          rule1_output: options.rules[0].output,
          rule2_input: options.rules[1].input,
          rule2_output: options.rules[1].output,
          rule3_input: options.rules[2].input,
          rule3_output: options.rules[2].output,
          iterations: options.iterations,
          angle: options.angle
        }
      }
    },
    getFavorites: function(){
      return $http.get(url);
    },
    postFavorite: function(fav) {
      return $http.post(url, fav);
    },
    deleteFavorite: function(fav) {
      return $http({
        method: 'DELETE',
        url: url + "/" + fav.id
      })
    }
  }
});
