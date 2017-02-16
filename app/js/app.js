'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.filters'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/turtleApp.html',
      controller: 'turtleCtrl'
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

