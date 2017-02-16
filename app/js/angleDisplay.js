var AngleDisplay;

//TODO clear the display instead of just drawing over yourself!

AngleDisplay = function(angle, element) {
  angle = angle * (2 * Math.PI / 360);
  this.canvas = element;
  var ctx = this.canvas.getContext('2d');
  var center_x = this.canvas.width/2;
  var center_y = this.canvas.height;
  var radius = this.canvas.height;

  ctx.beginPath();
  ctx.fillStyle = 'purple';
  ctx.arc(center_x,center_y,radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = '#158CBA';
  ctx.moveTo(center_x,center_y);
  ctx.arc(center_x,center_y,radius, Math.PI, Math.PI+angle, false);
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth= 2;
  ctx.strokeStyle = 'white';
  ctx.arc(center_x,center_y,radius/1.5, Math.PI, angle+Math.PI, false);
  ctx.stroke();

  var arrowStart = {};
  var secondPoint = {};
  var thirdPoint = {};
  arrowStart.x = ( radius/1.5 ) * -Math.cos(2*Math.PI-angle) + center_x;
  arrowStart.y = ( radius/1.5 ) * Math.sin(2*Math.PI-angle) + center_y;
  secondPoint.x = 10 * Math.sin(-angle-Math.PI/4) + arrowStart.x;
  secondPoint.y = 10 * Math.cos(-angle-Math.PI/4) + arrowStart.y;
  thirdPoint.x = 10 * Math.sin(-Math.PI+angle-Math.PI/4) + arrowStart.x;
  thirdPoint.y = 10 * Math.cos(angle-Math.PI/4) + arrowStart.y;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.moveTo(arrowStart.x, arrowStart.y);
  ctx.lineTo(secondPoint.x,secondPoint.y);
  ctx.moveTo(arrowStart.x, arrowStart.y);
  ctx.lineTo(thirdPoint.x,thirdPoint.y);
  ctx.lineTo(secondPoint.x,secondPoint.y);
  ctx.fill();

  //var imageObj = new Image();

  //imageObj.onload = function() {
    //ctx.drawImage(imageObj, 69, 50);
  //};
  //imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
  //drawArrow(ctx, 10,10,10,3,0);

};

drawArrow= function(ctx, x, y, radius, sides, rotateAngle) {
  if (sides < 3) return;
  var a = (Math.PI * 2)/sides;
  ctx.beginPath();
  ctx.strokeStyle = 'yellow';
  //ctx.translate(x,y);
  //ctx.rotate(rotateAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
  ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
  }
  ctx.closePath();
}
