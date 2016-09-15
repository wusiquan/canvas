'use strict';

var round = Math.round;
var sqrt = Math.sqrt;
var ceil = Math.ceil;
var RADIUS = 20;
var DIAMETER = 2 * RADIUS;
var canvas = document.getElementById('wsq');
var context = canvas.getContext('2d');

var rect;

context.beginPath();
context.fillStyle = '#999';
context.fillRect(0, 0, 600, 600);

var lastClientX;
var lastClientY;
context.globalCompositeOperation = "destination-out";

function getDistance(x1, y1, x2, y2) {
  return round(sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function getTransparentRatio() {

}

// 两点在斜率为k的直线上且距离40
// x' = ±(20 / √1+k^2)  + x1
// y' = k(x' - x1) + y1
function draw(clientX, clientY, rect) {
  if (lastClientX) {
    var distance = getDistance(lastClientX, lastClientY, clientX, clientY);
    // 在直线上每隔20补充圆
    if (distance >= DIAMETER) {
      var x, y;
      var i = 1;
      var k = (clientY - lastClientY) / (clientX - lastClientX);
      var nums = ceil((distance - RADIUS) / RADIUS);
      for (; i <= nums; i++) {
        x = round(i * RADIUS / sqrt(1 + k * k) + lastClientX);
        y = k * ( x - lastClientX ) + lastClientY;
        drawCircle(x - rect.left, y - rect.top, RADIUS);
      }
    }
  }

  drawCircle(clientX - rect.left, clientY - rect.top, RADIUS);
};

function erase(event) {
  event.preventDefault();
  var touchObj = event.targetTouches[0];

  var clientX = round(touchObj.clientX);
  var clientY = round(touchObj.clientY);

  draw(clientX, clientY, rect);

  lastClientX = clientX;
  lastClientY = clientY;
}

canvas.addEventListener('touchstart', function () {
  lastClientX = null;
  lastClientY = null;
  // 在canvas定义后取该值,结果是误
  rect = canvas.getBoundingClientRect();
  canvas.addEventListener('touchmove', erase, false);
}, false);

canvas.addEventListener('touchend', function () {
  var ratio = getTransparentRatio();

  canvas.removeEventListener('touchmove', erase, false);
});