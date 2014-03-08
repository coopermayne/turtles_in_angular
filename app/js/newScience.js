var NewScience;

NewScience = (function() {
  function NewScience(options, element) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.rows = 7;
    this.rules = {
      '111': 0,
      '110': 0,
      '101': 0,
      '100': 0, 
      '011': 0,
      '010': 1,
      '001': 0,
      '000': 0
    }
    
    this.grid =  this.calculateGrid();
    //this.sqSide = this.canvas.width/options.rows;
    //this.drawPoint();
  }

  NewScience.prototype.calculateGrid = function() {
    // make the empty grid
    var rows = this.rows;
    var rules = this.rules;
    var grid = Array.apply(null, Array(rows))
    .map(function() { 
      return Array.apply(null, Array(rows))
                  .map(function() { return 0; });
    });
    // set the 1 initial point
    grid[0][Math.floor(grid.length/2)] = 1;

    var calculateCellValue = function(row_i,col_i, grid, rules) {
      previous_row = grid[row_i-1];
      parents = previous_row.slice(col_i-1,col_i+2).join("");
      console.log(parents);
      return rules[parents];
    }

    //apply rules to grid...
    for (var i = 1; i < grid.length; i++) {
      for (var j = 1; j < grid[i].length-1; j++) {
        grid[i][j] = calculateCellValue(i, j, grid, rules);
      }
    }

    return grid;
  }

  NewScience.prototype.draw = function() {
  }

  NewScience.prototype.drawPoint = function(x,y) {
    var ctx = this.context;
    ctx.fillStyle = 'white';
    ctx.fillRect(10,10,5,5);
  }


  return NewScience;
})();

