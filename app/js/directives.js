'use strict';

/* Directives */
angular.module('myApp.directives', []).

directive('rule', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/rule.html',
    link: function(scope,el,attr) {
      scope.index = +attr.index+1;
    }
  }
}).

directive('newSci', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      scope.$watch('rules', function() {
        var options = {
          rows: 200,
          rules: scope.rules
        };
        new NewScience(options, document.getElementsByTagName('canvas')[0]);
      }, true);
    }
  }
}).

directive('changeOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      scope.changeAngleOnClick = function(ev) {
        var rx= ev.pageX - ev.currentTarget.getBoundingClientRect().left - ev.currentTarget.getBoundingClientRect().width/2;
        var ry = ev.currentTarget.getBoundingClientRect().bottom - ev.pageY;
        var newAngle = (180*Math.atan(ry/rx)/Math.PI).toFixed(1);
        if( newAngle<0 ){
          scope.favCopy.angle = Math.abs(newAngle);
        }else{
          scope.favCopy.angle = 180 - newAngle;
        }
      }
    }
  }
}).

directive('updateOnChange', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      //make a new angleDisplay whenever there is new data
      scope.$watch('favCopy.angle',function() {
        new AngleDisplay(scope.favCopy.angle, element[0]);
      }, true);
    }
  }
}).

directive('renderTurtle', function() {
  return {
    restric: 'A',
    link: function(scope, element, attr) {
      scope.$watch('favCopy',function() {
        if (scope.favCopy.angle) {
          if ( scope.currentDrawingProcess ) {
            clearInterval(scope.currentDrawingProcess.id);
            scope.currentDrawingProcess.turtle.resetCanvas();
          }
          var t = new Turtle(scope.favCopy, element[0]);
          var interval = setInterval(function() {
            t.continueDrawing();
            console.log('drawing.....')
            if ( t.progress.drawDone ) {
              clearInterval(interval);
              scope.currentDrawingProcess = false;
              console.log('done');
            }
          }, 11);
          scope.currentDrawingProcess = {turtle: t, id: interval};
        }
      }, true);
    }
  }
});
