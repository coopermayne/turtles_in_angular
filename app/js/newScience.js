var NewScience;

NewScience = (function() {
  function NewScience(options, element) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.rows = options.rows;
    this.rules={};
    for (var i = 0; i < options.rules.length; i++) {
      this.rules[options.rules[i].parents] = +options.rules[i].child;
    }

    this.start_row = 0;

    this.grid =  this.calculateGrid();
    this.lastRenderedRow = 0;

    this.progress = {done: false};
  }

  NewScience.prototype.continueDrawing = function() {
    this.drawRows(parseInt(this.grid.length/100));
  }

  NewScience.prototype.calculateGrid = function() {
    // make the empty grid
    var rows = this.rows;
    var bufferedRows = this.rows*2;
    var rules = this.rules;
    var BufferedGrid = Array.apply(null, Array(bufferedRows))
    .map(function() { 
      return Array.apply(null, Array(bufferedRows))
                  .map(function() { return 0; });
    });
    // set the 1 initial point
    BufferedGrid[0][Math.floor(BufferedGrid.length/2)] = 1;

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
    var grid = []
    for (var i = 0; i < rows; i++) {
      grid[i] = BufferedGrid[i].slice(Math.ceil(rows/2), Math.floor(rows*1.5)+1);
    }

    return grid;

  }

  NewScience.prototype.drawRows = function(n) {
    console.log(this.lastRenderedRow, this.grid.length);
    var grid = this.grid;
    var start_row = this.lastRenderedRow;
    console.log(start_row)

    for (var i = start_row+1; i < grid.length; i++) {
      if (i - this.lastRenderedRow > n) {
        console.log(i,this.lastRenderedRow);
        return
      }else{console.log('else')}
      for (var j = 0; j < grid[i].length-1; j++) {
        var color = 'white';
        if(grid[i][j]){
          color = 'black';
        }

        this.drawCell(i,j, color);

      };
      this.lastRenderedRow = i+1;
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

