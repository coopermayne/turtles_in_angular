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
      scope.$watch('options', function() {
        var rendering = new NewScience(scope.options, document.getElementsByTagName('canvas')[0]);
        var step = function(rend, scope) {
          var res = rend.continueDrawing();
          //if not done we call this again and keep going
          if (!rend.progress.done) {
            var timeout = setTimeout(function() {
              step(rend, scope);
            }, 500);

            //update the scope so it knows where the animation is....
            scope.currentDrawingProcess = {rendering:rend, timeoutId:timeout};
          } else {
            //if we are done! we clear out currentDrawingProcess
            scope.currentDrawingProcess.timeoutId = false;
          }
        };

        ///////////////////////////////////////////////////////
        ///////// THE SELF REF FUNCTION THAT DOES IT ALL
        ///////////////////////////////////////////////////////
        step(rendering, scope);

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

          if (diffs.indexOf('id') !==-1) {return false;} //if we changed objects we have to generate everything new
          if (diffs.length > 2) {return false;} //if we change more than one thing... we have to gen all again
          if (diffs.indexOf('name') !==-1) {return 'name';} //if only angle we can tweek existing object
          if (diffs.indexOf('angle') !==-1) {return 'angle';} //if only angle we can tweek existing object
          if (diffs.indexOf('iterations') !==-1) {return 'iterations';} //if only interations we can tweek existing object
        }

        //don't update the picture while person is naming the turtle!
        if (findDiff(newValue, oldValue) == 'name') {return false;}

        ////detemrine what changed....
        //var oldTurtle = scope.currentDrawingProcess && scope.currentDrawingProcess.turtle;
        //if (findDiff(newValue,oldValue) == 'angle') {
          ////modify angle and tell the turtle to update
          //oldTurtle.angle = newValue.angle;
          //oldTurtle.progress = {
            //stringGenerated: true, //only this is true... this just saves us from 
                                    ////regenerating string on big iterations 
                                     ////when we change angle
            //pointsGenerated: false,
            //canvasResized: false,
            //drawDone: false,
            //resetCanvas: false,
            //pointsTotal: 0,
            //pointsDrawn: 0
          //};

        //}else if(findDiff(newValue,oldValue) == 'iterations'){
          ////modify iterations and tell the turtle to update
          //console.log('only iterations changed');

          //oldTurtle.progress = {
            //stringGenerated: false,
            //pointsGenerated: false,
            //canvasResized: false,
            //drawDone: false,
            //resetCanvas: false,
            //pointsTotal: 0,
            //pointsDrawn: 0
          //};
          //oldTurtle.iterations = newValue.iterations;

        //}else{
          //console.log('making a new one')
          //var t = new Turtle(scope.favCopy, element[0]);
        //}

        //only iterations changed

        var t = new Turtle(scope.favCopy, element[0]);

        var step = function(turtle, scope) {
          var start = new Date().getTime();

          var res = turtle.continueDrawing();

          var end = new Date().getTime();
          var time = end - start;

          if (time> 100) {
            console.log(res[0], res[1]);
          }

          //if not done we call this again and keep going
          if (!res[0].resetCanvas) {
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
