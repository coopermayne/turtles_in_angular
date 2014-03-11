var Turtle;
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Turtle = (function() {
  function Turtle(options, element) {
    this.startingString = options.axiom;
    this.rules = options.rules;
    this.iterations = options.iterations || 1;
    this.d_radians = options.angle * (2 * Math.PI / 360);
    this.distance = 5;
    this.lineWidth = options.lineWidth || 1;
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
    for (var i = 0; i < this.iterations; i++) {
      this.generateIteration();
    };
    this.readString(); //tures string into a set of points on canvas
    this.resizeCanvas(); //resize to best fit these points
    this.draw();
    this.resetTurtle(); // so the canvas is back to original size....
  }

  Turtle.prototype.generateIteration = function() {
    var letter, num, old, rule, ruleInputs, _results;
    //surround each letter with parens
    this.string = this.string.replace(/(.)/g, '($1)');

    for (var i = 0; i < this.rules.length; i++) {
      //only match stuff with parens around it!
      this.string = this.string.replace(new RegExp("\\((" + this.rules[i].input + ")\\)", "g"), this.rules[i].output);
    };

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
    if (direction === 'r') {
      this.radians = this.radians - this.d_radians;
    } else if (direction === 'l') {
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

  Turtle.prototype.readString = function() {
    var letter, _i, _len, _ref, _results;
    _ref = this.string;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      letter = _ref[_i];
      switch (letter) {
        case 'F':
          _results.push(this.goForward());
          break;
        case "[":
          _results.push(this.popIn());
          break;
        case "]":
          _results.push(this.popOut());
          break;
        case 'l':
          _results.push(this.turn('l'));
          break;
        case 'r':
          _results.push(this.turn('r'));
          break;
        default:
          _results.push(void 0);
      }
    }
    return _results;
  };

  Turtle.prototype.draw = function() {
    var ctx, i, point, _i, _len, _ref;
    ctx = this.context;
    //so the line is always the width we specified...
    ctx.lineWidth = ( this.lineWidth/2 ) / this.scaler;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    _ref = this.points;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      if (point.isNode) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  };

  Turtle.prototype.resetCanvas = function() {
    this.context.translate(-this.lastTrans.x, -this.lastTrans.y);
    this.context.scale(1 / this.scaler, 1 / this.scaler);
  };

  Turtle.prototype.resetTurtle = function() {
    this.resetCanvas();
    this.string = this.startingString;
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
  };

  Turtle.prototype.drawNextIteration = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.iterations++;
    customTimer(this.generateString, 'generate string', this);
    customTimer(this.readString, 'find points', this);
    this.resizeCanvas();
    customTimer(this.draw, 'draw', this);
  };

  return Turtle;
})();

