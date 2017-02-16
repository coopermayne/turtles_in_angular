var Turtle;
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Turtle = (function() {
  function Turtle(options, element) {
    this.startingString = options.axiom;
    this.rules = options.rules;
    this.iterations = options.iterations || 1;
    //keep track of how many the object has already calculated
    this.iterationsCalculated = 0;

    this.d_radians = options.angle * (2 * Math.PI / 360);
    this.distance = 5;
    this.lineWidth = options.lineWidth || 2;
    this.distanceMultiplier = options.distanceMultiplier || 1;
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.radians = 0;
    this.string = options.axiom;
    this.popList = [];
    this.max = {
      x: 0,
      y: 0
    };
    this.min = {
      x: 0,
      y: 0
    };
    this.lastTrans = {
      x: 0,
      y: 0
    };
    this.scaler = 1;
    this.pos = {
      x: 0,
      y: 0
    };

    this.points = [$.extend(true, {}, this.pos)];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.progress = {
      stringGenerated: false,
      pointsGenerated: false,
      canvasResized: false,
      drawDone: false,
      resetCanvas: false,
      chunks: [],
      chunk_i: 0,
      totalChunks: 0,
      chunkingInProgress: false,
      genPointsProgress: 0,
      pointsTotal: 0,
      pointsDrawn: 0
    };

    this.maxStringLength = 10000;

  }

  Turtle.prototype.angle = function(deg) {
    this.d_radians = angle * (2 * Math.PI / 360);
  };

  Turtle.prototype.continueDrawing = function() {

    if (!this.progress.stringGenerated) {
      this.generateString(); //max chunk length
      return [ this.progress , 'generateString'];
    }
    if (!this.progress.pointsGenerated){
      this.generatePoints();
      return [ this.progress, 'genPoints' ];
    }
    if (!this.progress.canvasResized) {
      this.resizeCanvas(); //resize to best fit these points
      return [ this.progress, 'resizeCanvas' ];
    }
    if (!this.progress.drawDone){
      this.draw({rate: 5000});
      return [ this.progress, 'draw' ];
    }
    if (!this.progress.resetCanvas){
      this.resetCanvas(); // the transformations to the canvas are undone here...
      return [ this.progress, 'resetCan' ];
    }else{
      return [ this.progress, 'else' ];
    }
  };

  Turtle.prototype.generateString = function() {
    var letter, num, old, rule, ruleInputs, _results;

    if (this.progress.chunkingInProgress) { //if we are in the middle of handling chunks... continue!

      var res = this.continueChunking();

      if (res=='done') {
        this.string = this.progress.chunks.join("");
        this.iterationsCalculated += 1;

        //reset chunks....
        this.progress.chunks = [];
        this.progress.chunk_i =  0;
        this.progress.chunkingInProgress =  false;
      }
    } else if (this.string.length > this.maxStringLength) {  //if not chunking AND string is too long... we start chunking process

      this.startChunking();
      this.progress.chunkingInProgress = true;

    } else { //if not chunking AND string is not long... we just replace it....
      this.string = this.stringReplacement(this.string);
      this.iterationsCalculated += 1;
    }

    if (this.iterations==this.iterationsCalculated) {
      this.progress.stringGenerated = true;
    }

  };

  Turtle.prototype.startChunking = function() {
      this.progress.totalChunks = 
        ( this.string.length/this.maxStringLength ) + 1;
  };


  Turtle.prototype.continueChunking= function() {   //return 'done' after doing the last chunk!
    var chunk_i = this.progress.chunk_i;
    var max = this.maxStringLength;

    var subStr = this.string.substring(chunk_i*max, (chunk_i+1)*max);

    this.progress.chunks.push(this.stringReplacement(subStr));


    if (this.progress.chunk_i == this.progress.totalChunks || this.progress.chunk_i > this.progress.totalChunks) {
      return 'done';
    } else {
      this.progress.chunk_i += 1;
    }


  };


  Turtle.prototype.stringReplacement = function(str) {

    var new_str = str.replace(/(.)/g, '($1)');

    for (var i = 0; i < this.rules.length; i++) {
      //only match stuff with parens around it!
      new_str = new_str.replace(new RegExp("\\((" + this.rules[i].input + ")\\)", "g"), this.rules[i].output);
    }

    new_str = new_str.replace(/[\(\)]/g, "");
    return new_str;
  };

  Turtle.prototype.goForward = function() {
    this.pos.x += this.distance * Math.cos(this.radians);
    this.pos.y += this.distance * Math.sin(this.radians);
    this.points.push({
      x: this.pos.x,
      y: this.pos.y
    });
    
    //set the mins and maxes
    if (this.pos.x > this.max.x) {
      this.max.x = this.pos.x;
    }
    if (this.pos.y > this.max.y) {
      this.max.y = this.pos.y;
    }
    if (this.pos.x < this.min.x) {
      this.min.x = this.pos.x;
    }
    if (this.pos.y < this.min.y) {
      this.min.y = this.pos.y;
    }
  };

  Turtle.prototype.turn = function(direction) {
    if (direction === '-') {
      this.radians = this.radians - this.d_radians;
    } else if (direction === '+') {
      this.radians = this.radians + this.d_radians;
    }
  };

  Turtle.prototype.popIn = function() {
    this.popList.push({
      radians: this.radians,
      pos: {
        x: this.pos.x,
        y: this.pos.y
      }
    });
  };

  Turtle.prototype.popOut = function() {
    var r;
    r = this.popList.pop();
    this.pos = r.pos;
    this.radians = r.radians;
    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      isNode: true
    });
  };

  Turtle.prototype.generatePoints = function() {
    //TODO reads 10000 each time it is called and returns progress
    var letter, _i, _len, _ref;
    var nextStop = this.progress.genPointsProgress + 10000;

    if(this.string.length < nextStop){
      nextStop = this.string.length;
      this.progress.pointsGenerated = true;
    }

    for (_i = this.progress.genPointsProgress; _i < nextStop; _i++) {
      letter = this.string[_i];
      switch (letter) {
        case 'F':
          this.goForward();
          break;
        case "[":
          this.popIn();
          break;
        case "]":
          this.popOut();
          break;
        case '-':
          this.turn('-');
          break;
        case '+':
          this.turn('+');
          break;
        default:
          break;
      }
    }

    this.progress.genPointsProgress = nextStop;
    this.progress.pointsTotal = this.points.length;
  };

  Turtle.prototype.draw = function(options) {
    var ctx, i, point, count;
    var rate = this.progress.pointsTotal/150;
    if (rate>options.rate) {
      rate = options.rate;
    }
    count = this.progress.pointsDrawn;
    ctx = this.context;
    //so the line is always the width we specified...
    ctx.lineWidth = ( this.lineWidth/2 ) / this.scaler;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (i = this.progress.pointsDrawn; i < this.points.length; i++) {
      if (this.progress.pointsDrawn-count> rate) {
        break;
      }
      point = this.points[i];
      if (point.isNode) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
      this.progress.pointsDrawn = i;
    }
    ctx.stroke();
    if (this.progress.pointsDrawn+1 == this.progress.pointsTotal) {
      this.progress.drawDone = true;
      this.resetCanvas();
    }

  };

  Turtle.prototype.resetCanvas = function() {
    this.context.translate(-this.lastTrans.x, -this.lastTrans.y);
    this.context.scale(1 / this.scaler, 1 / this.scaler);
    this.progress.resetCanvas = true;
  };

  Turtle.prototype.resizeCanvas = function() {
    var center, dx, dy, height, heightRatio, rulesString, text, width, widthRatio;
    width = this.max.x - this.min.x;
    height = this.max.y - this.min.y;
    center = {
      x: this.min.x + width / 2,
      y: this.min.y + height / 2
    };
    widthRatio = this.canvas.width / width;
    heightRatio = this.canvas.height / height;
    this.scaler = Math.min.apply(null, [widthRatio, heightRatio, 15]) * 0.9;
    dx = -1 * (center.x - this.canvas.width / (2 * this.scaler));
    dy = -1 * (center.y - this.canvas.height / (2 * this.scaler));
    this.context.scale(this.scaler, this.scaler);
    this.lastTrans.x = dx;
    this.lastTrans.y = dy;
    this.context.translate(dx, dy);

    this.progress.canvasResized = true;
  };

  return Turtle;
})();

