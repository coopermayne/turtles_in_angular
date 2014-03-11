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
      scope.$watch('favCopy',function(newValue, oldValue) {

        //guard againsts the empty object
        if (!newValue.angle) {return false;}

        // if we are in the middle of some process... 
        // we have to clear it to prepare for new drawing...
        if ( scope.currentDrawingProcess && scope.currentDrawingProcess.timeoutId ) {
          clearTimeout(scope.currentDrawingProcess.timeoutId);
          scope.currentDrawingProcess.turtle.resetCanvas();
        }

        var findDiff = function(obj1,obj2) {
          var diffs = [];
          for (var property in obj1){
            if (obj1[property] !== obj2[property]) {
              diffs.push(property);
            }            
          }

          console.log(diffs)
          if (diffs.indexOf('id') !==-1) {return false;} //if we changed objects we have to generate everything new
          if (diffs.length > 2) {return false;} //if we change more than one thing... we have to gen all again
          if (diffs.indexOf('angle') !==-1) {return 'angle';} //if only angle we can tweek existing object
          if (diffs.indexOf('iterations') !==-1) {return 'iterations';} //if only interations we can tweek existing object
        }

        //detemrine what changed....
        if (findDiff(newValue,oldValue) == 'angle') {
          //modify angle and tell the turtle to update
          console.log('only angle changed');
        }else if(findDiff(newValue,oldValue) == 'iterations'){
          //modify iterations and tell the turtle to update
          console.log('only iterations changed');
        }else{
          console.log('making a new one')
          var t = new Turtle(scope.favCopy, element[0]);
        }

        //only iterations changed


        var step = function(turtle, scope) {
          var res = turtle.continueDrawing();
          //if not done we call this again and keep going
          if (!res.resetCanvas) {
            var timeout = setTimeout(function() {
              step(turtle, scope);
            }, 13);

            //update the scope so it knows where the animation is....
            scope.currentDrawingProcess = {turtle:turtle, timeoutId:timeout};
          } else {
            //if we are done! we clear out currentDrawingProcess
            scope.currentDrawingProcess.timeoutId = false;
          }
        };

        ///////////////////////////////////////////////////////
        ///////// THE SELF REF FUNCTION THAT DOES IT ALL
        ///////////////////////////////////////////////////////
        step(t, scope);
        
      }, true);
    }
  }
});
