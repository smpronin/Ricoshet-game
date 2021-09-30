'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');
let liveCount = 3;

let game = {
  condition: 'waiting',
  liveCount: 3
}

console.log(canvas);

let p1 = {
  x: 200,
  y: 80
}

let p2 = {
  x: 190,
  y: 150
}

console.log(direction(p1, p2));
// console.log(Math.atan2(0, -1) / Math.PI * 180);

let action = {
  moveLeft: false,
  moveRight: false,
  start: false
}

let ballInit = {
  x: 228,
  y: 20,
  r: Math.round(Math.min(canvas.width, canvas.height) / 32),
  vx: 0,
  vy: 0,
  lineWidth: 1,
  fillStyle: '#FFFFFF',
  strokeStyle: '#000000',
  clipped: false
}

ballInit.x = 400;
ballInit.y = 150;
ballInit.vx = -1;
ballInit.vy = 0;

// ballInit.x = 400;
// ballInit.y = 300;
// ballInit.vx = -0.5;
// ballInit.vy = 0.5;

let ball = {
  x: ballInit.x,
  y: ballInit.y,
  r: ballInit.r,
  vx: ballInit.vx,
  vy: ballInit.vy,
  lineWidth: ballInit.lineWidth,
  fillStyle: ballInit.fillStyle,
  strokeStyle: ballInit.strokeStyle,
  clipped: ballInit.clipped,
  angle: null,
  velocity: null
}
ball.angle = Math.atan(ball.vx / ball.vy) / Math.PI * 180;
ball.velocity = Math.pow(ball.vx * ball.vx + ball.vy * ball.vy, 0.5);

console.log('Ball', ball.angle);

let paddle = {
  x: canvas.width / 2 - canvas.width / 8,
  y: 280, //canvas.height - canvas.height / 20,
  vx: canvas.width / 300,
  width: canvas.width / 4,
  height: 50, //canvas.height / 32,
  curve: 30,
  lineWidth: 1,
  fillStyle: '#FFFFFF',
  strokeStyle: '#000000'
}

// console.log({ paddle });

let textStyle = {
  x: 50,
  y: 100,
  font: '48px serif',
  fillStyle: '#35A1FF'
}

let brickInit = {
  startX: 0,
  startY: 0,
  lineCount: 1,
  rowCount: 1,
  // width: canvas.width/brickInit.lineCount, //160,
  height: 80,
  gapWidth: 200,
  gapHeight: 80,
  fillStyle: '#35A1FF'
}



brickInit.width = (canvas.width - (brickInit.lineCount + 1) * brickInit.gapWidth) / brickInit.lineCount;
brickInit.aliveCount = brickInit.lineCount * brickInit.rowCount;

// console.log({ brickInit });

let brick = [];

for (let l = 0; l < brickInit.lineCount; l++) {
  brick[l] = [];
  let x = brickInit.gapWidth + l * (brickInit.width + brickInit.gapWidth);
  let y = brickInit.gapHeight;
  for (let r = 0; r < brickInit.rowCount; r++) {
    brick[l][r] = {
      x: x,
      y: y,
      width: brickInit.width,
      height: brickInit.height,
      alive: true,
      clipped: false
    }
    y += brickInit.height + brickInit.gapHeight;
  }
}

console.log({ brick });

function draw() {
  // Движение мяча
  ball.angle = Math.atan(ball.vx / ball.vy) / Math.PI * 180;
  ball.velocity = Math.pow(ball.vx * ball.vx + ball.vy * ball.vy, 0.5);
  ball.x += ball.vx;
  ball.y += ball.vy;
  /* if (ball.x <= ball.r) {
    ball.x = ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.x >= canvas.width - ball.r) {
    ball.x = canvas.width - ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.y <= ball.r) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y >= canvas.height - ball.r) {
    ball.y = canvas.height - ball.r
    ball.vy = -ball.vy;
  } */


  /* // Взаимодействие мяча с подложкой
  let paddleBallCollision = collisionDetection(ball, paddle);
  if (paddleBallCollision.direction != null && ball.clipped == false) {
    console.log('1', ball.vx);
    ball.clipped = true;
    let ballCurve = tragectoryCurve(ball, paddleBallCollision.offset.px, paddle.curve);
    ball.vx = ballCurve.vx;
    ball.vy = -ballCurve.vy;
    console.log('2', ball.vx);
    console.log(paddleBallCollision);
  } */


  // if (ball.clipped == true && ball.y > paddle.y - ball.r) { ball.clipped = false }

  // console.log(ball);

  /* // Условия победы/ поражения
  if (ball.y >= canvas.height - ball.r) {
    game.condition = 'loose';
    ball.vx = 0;
    ball.vy = 0;
  } else if (brickInit.aliveCount == 0) {
    game.condition = 'win';
    ball.vx = 0;
    ball.vy = 0;
  } */

  // Столкновения с кирпичами
  for (let l = 0; l < brickInit.lineCount; l++) {
    for (let r = 0, tmp = 0; r < brickInit.rowCount; r++) {
      let collision = collisionDetection(ball, brick[l][r]);
      // console.log(collision);
      if (brick[l][r].clipped == false) {
        if ((collision.direction == 'up' || collision.direction == 'down') && brick[l][r].alive == true) {
          brick[l][r].clipped = true;
          ball.vy = -ball.vy;
          // brick[l][r].alive = false;
          brickInit.aliveCount--;
          console.log(collision)
        }
        if ((collision.direction == 'left' || collision.direction == 'right') && brick[l][r].alive == true) {
          brick[l][r].clipped = true;
          ball.vx = -ball.vx;
          // brick[l][r].alive = false;
          brickInit.aliveCount--;
          console.log(collision, direction({ x: brick[l][r].x + brick[l][r].width, y: brick[l][r].y }, ball), direction({ x: brick[l][r].x + brick[l][r].width, y: brick[l][r].y + brick[l][r].height }, ball))
          console.log(ball.x, ball.y);
        }
        if ((collision.direction == 'topleft' || collision.direction == 'bottomright') && brick[l][r].alive == true) {
          brick[l][r].clipped = true;
          tmp = ball.vx;
          ball.vx = -ball.vy;
          ball.vy = -tmp;
          // brick[l][r].alive = false;
          brickInit.aliveCount--;
          console.log(collision)
        }
        if ((collision.direction == 'bottomleft' || collision.direction == 'topright') && brick[l][r].alive == true) {
          console.log([brick[l][r].x, brick[l][r].y + brick[l][r].height, ball.r])
          brick[l][r].clipped = true;
          tmp = ball.vx;
          ball.vx = ball.vy;
          ball.vy = tmp;
          // brick[l][r].alive = false;
          brickInit.aliveCount--;
          console.log(collision)
        }
      }
    }
  }


  // Движение подложки
  if (action.moveRight == true) {
    paddle.x += paddle.vx;
    // game.condition == 'waiting' ? ball.x += paddle.vx : 0;
  }
  if (action.moveLeft == true) {
    paddle.x -= paddle.vx;
    // game.condition == 'waiting' ? ball.x -= paddle.vx : 0;
  }
  if (paddle.x >= canvas.width - paddle.width) {
    paddle.x = canvas.width - paddle.width;
    // game.condition == 'waiting' ? ball.x = canvas.width - paddle.width / 2 : 0;
  }
  if (paddle.x <= 0) {
    paddle.x = 0;
    // game.condition == 'waiting' ? ball.x = paddle.width / 2 : 0;

  }

  if (action.start == true
    //&& game.condition == 'waiting'
  ) {
    // ball.vy = - Math.random() * 2;
    // ball.vx = Math.pow(2 * 2 - ball.vy * ball.vy, 0.5);
    ball.x = ballInit.x;
    ball.y = ballInit.y;
    ball.vy = ballInit.vy;
    ball.vx = ballInit.vx;
    game.condition = 'game';
  }


  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // if (game.condition == 'game' && game.condition != 'win') {
  drawBall(ball);
  // drawPaddle(paddle);
  drawBrick(brickInit);
  requestAnimationFrame(draw);
  // } else {
  //   drawBall(ball);
  //   drawPaddle(paddle);
  //   drawBrick(brickInit);
  //   if (game.condition == 'loose') {
  //     drawText('Game Over', textStyle);
  //   } else if (game.condition == 'win') {
  //     drawText('You Win', textStyle);
  //   } else {
  //     drawText('Press Space', textStyle);
  //   }
  //   requestAnimationFrame(draw);
  // }
}

draw();