'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [])

app.controller('appCtrl', function($scope) {
});

app.controller('appCtrl', function($scope) {
  $scope.tSettings = [
    {name: 'dragon', age: 12},
    {name: 'noder', age: 22},
    {name: 'puppy', age: 32}
  ]
  $scope.test = "something";
});
