'use strict';

/* Services */

angular.module('myApp.services', []).

factory('favorites', function($http) {
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
