var AngleDisplay;

AngleDisplay = function(angle, element) {
  this.angle = angle * (2 * Math.PI / 360);
  this.canvas = element;
  this.context = this.canvas.getContext('2d');
  var center_x = this.canvas.width/2;
  var center_y = this.canvas.height;
  var radius = this.canvas.height;

  this.context.beginPath();
  this.context.fillStyle = 'purple';
  this.context.arc(center_x,center_y,radius, 0, 2*Math.PI);
  this.context.fill()
  this.context.beginPath();
  this.context.fillStyle = '#158CBA';
  this.context.moveTo(center_x,center_y);
  this.context.arc(center_x,center_y,radius, Math.PI, this.angle+Math.PI, false);
  this.context.fill();
};
