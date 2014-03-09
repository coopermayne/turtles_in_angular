var NewScience;

NewScience = (function() {
  function NewScience(options, element) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.rows = options.rows;
    this.rules = {
      '111': 0,
      '110': 0,
      '101': 0,
      '100': 1, 
      '011': 1,
      '010': 1,
      '001': 1,
      '000': 0
    }
    
    this.grid =  this.calculateGrid();
    this.draw();
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

  NewScience.prototype.draw = function() {
    var grid = this.grid;

    for (var i = 0; i < grid.length; i++) {
      for (var j = 1; j < grid[i].length-1; j++) {
        var color = 'white';
        if(grid[i][j]){
          color = 'black';
        }

        this.drawCell(i,j, color);
      };
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

