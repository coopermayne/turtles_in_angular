var NewScience;

NewScience = (function() {
  function NewScience(options, element) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.rows = options.rows;
    this.color = '#158CBA';
    this.rules={};
    for (var i = 0; i < options.rules.length; i++) {
      this.rules[options.rules[i].parents] = +options.rules[i].child;
    }

    this.start_row = 0;

    this.grid =  this.calculateGrid();
    this.nextRow = 0;

    this.progress = {done: false};
  }

  NewScience.prototype.continueDrawing = function() {
    var increments = 10;
    //check if done
    if (this.grid.length == this.nextRow) {
      console.log('done');
      this.progress.done = true;
    } else {
      //if not keep drawing...
      this.drawRows(increments);
    }
  }

  NewScience.prototype.calculateGrid = function() {
    // make the empty grid
    var rows = this.rows;

    //investigate necessary extra area...
    var bufferedCols = this.rows*2;
    var rules = this.rules;

    //fill up array with 0s
    var BufferedGrid = Array.apply(null, Array(rows))
    .map(function() { 
      return Array.apply(null, Array(bufferedCols))
                  .map(function() { return 0; });
    });

    // set the 1 initial point
    BufferedGrid[0][Math.floor(bufferedCols/2)] = 1;

    var calculateCellValue = function(row_i,col_i, grid, rules) {
      previous_row = grid[row_i-1];
      parents = previous_row.slice(col_i-1,col_i+2).join("");
      return rules[parents];
    }

    //apply rules to grid...
    for (var i = 1; i < BufferedGrid.length; i++) {
      for (var j = 1; j < BufferedGrid[i].length-1; j++) {
        BufferedGrid[i][j] = calculateCellValue(i, j, BufferedGrid, rules);
      }
    }

    //take only the middle part of the buffered grid
    var grid = [];
    for (i = 0; i < rows; i++) {
      grid[i] = BufferedGrid[i].slice(Math.ceil(bufferedCols*0.25), Math.floor(bufferedCols*0.75));
    }

    return grid;

  }

  NewScience.prototype.drawRows = function(n) {
    console.log(this.nextRow, this.grid.length);
    var grid = this.grid;
    var start_row = this.nextRow;

    for (var i = start_row; i < grid.length; i++) {

      //if we have gone n rows return....
      if (i - start_row +1> n) {
        console.log('returning');
        this.nextRow=i;
        return;
      } else {
      //if not draw on...

        for (var j = 0; j < grid[i].length-1; j++) {
          var color = 'purple';
          if(grid[i][j]){
            color = this.color;
          }

          this.drawCell(i,j, color);

        }

        this.nextRow = i+1;

      }

    };
  }

  NewScience.prototype.drawCell = function(row_i,col_i, color) {
    var pixelScaler = this.canvas.width/this.rows;
    var ctx = this.context;
    ctx.fillStyle = color;
    ctx.fillRect(pixelScaler*col_i,pixelScaler*row_i,pixelScaler,pixelScaler);
  }


  return NewScience;
})();

