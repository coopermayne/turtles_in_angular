'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
filter('upcase', function() {
    return function(input, uppercase) {
      console.log('working');
      return input.toUpperCase();
    };
  });
