document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(k) {
    if (k.code == 'KeyD' || k.code == 'ArrowRight') {
        action.moveRight = true;
    }
    if (k.code == 'KeyA' || k.code == 'ArrowLeft') {
        action.moveLeft = true;
    }
    if (k.code == 'KeyW' || k.code == 'ArrowUp') {
        action.moveLeft = true;
    }
    if (k.code == 'KeyS' || k.code == 'ArrowDown') {
        action.moveLeft = true;
    }
    if (k.code == 'Space') {
        action.start = true;
    }
}

function keyUpHandler(k) {
    if (k.code == 'KeyD' || k.code == 'ArrowRight') {
        action.moveRight = false;
    }
    if (k.code == 'KeyA' || k.code == 'ArrowLeft') {
        action.moveLeft = false;
    }
    if (k.code == 'KeyW' || k.code == 'ArrowUp') {
        action.moveLeft = false;
    }
    if (k.code == 'KeyS' || k.code == 'ArrowDown') {
        action.moveLeft = false;
    }
    if (k.code == 'Space') {
        action.start = false;
    }
}


function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.fillStyle;
    ctx.strokeStyle = ball.strokeStyle;
    ctx.lineWidth = ball.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.fillStyle;
    ctx.strokeStyle = paddle.strokeStyle;
    ctx.lineWidth = paddle.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawBrick(brickInit) {
    for (let l = 0; l < brickInit.lineCount; l++) {
        for (let r = 0; r < brickInit.rowCount; r++) {
            if (brick[l][r].alive == true) {
                ctx.beginPath();
                ctx.rect(brick[l][r].x, brick[l][r].y, brickInit.width, brickInit.height);
                // console.log(brick[0][0].x, brick[0][0].y, brickInit.width, brickInit.height);
                ctx.fillStyle = brickInit.fillStyle;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawText(text, textStyle) {
    ctx.font = textStyle.font;
    ctx.fillStyle = textStyle.fillStyle;
    ctx.fillText(text, textStyle.x, textStyle.y, textStyle.maxWidth);
    // console.log({ctx});
}

/* function collisionDetection(ball, target) {
    let output = {
        direction: null,
        ball: {
            x: null,
            y: null
        },
        offset: {
            x: null,
            y: null,
            px: null,
            py: null
        }
    }

    function collisionOutput() {
        output.ball.x = ball.x,
        output.ball.y = ball.y,
        output.offset.x = Math.round((ball.x - (target.x * 2 + target.width) / 2) * 100) / 100;
        output.offset.y = Math.round((ball.y - (target.y * 2 + target.height) / 2) * 100) / 100;
        output.offset.px = Math.round(output.offset.x / (target.width / 2) * 100) / 100;
        output.offset.py = Math.round(output.offset.y / (target.height / 2) * 100) / 100;
    }

    if (
        ball.x >= target.x
        && ball.x <= target.x + target.width
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'up';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x
        && ball.x <= target.x + target.width
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
    ) {
        output.direction = 'down';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y
        && ball.y <= target.y + target.height
    ) {
        output.direction = 'left';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y
        && ball.y <= target.y + target.height
    ) {
        output.direction = 'right';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topright';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
        && Math.pow(Math.pow(ball.y - target.y - target.height, 2) + Math.pow(ball.x - target.x, 2), 0.5) < ball.r
    ) {
        output.direction = 'bottomleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
    ) {
        output.direction = 'bottomright';
        collisionOutput()
        return output;
    }
    return output;

} */

function collisionDetection(ball, target) {
    let output = {
        direction: null,
        ball: {
            x: null,
            y: null
        },
        offset: {
            x: null,
            y: null,
            px: null,
            py: null
        }
    }

    function collisionOutput() {
        output.ball.x = ball.x,
            output.ball.y = ball.y,
            output.offset.x = Math.round((ball.x - (target.x * 2 + target.width) / 2) * 100) / 100;
        output.offset.y = Math.round((ball.y - (target.y * 2 + target.height) / 2) * 100) / 100;
        output.offset.px = Math.round(output.offset.x / (target.width / 2) * 100) / 100;
        output.offset.py = Math.round(output.offset.y / (target.height / 2) * 100) / 100;
    }

    if (
        // ball.x >= target.x - ball.r
        // && ball.x <= target.x + target.width + ball.r
        ball.y >= target.y - ball.r
        && ball.y <= target.y
        && direction({ x: target.x, y: target.y }, ball) >= 225
        && direction({ x: target.x, y: target.y }, ball) < 360
        && direction({ x: target.x + target.width, y: target.y }, ball) <= 315
        && direction({ x: target.x + target.width, y: target.y }, ball) > 180
    ) {
        output.direction = 'up';
        collisionOutput()
        return output;
    }
    if (
        // ball.x >= target.x
        // && ball.x <= target.x + target.width
        ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
        && direction({ x: target.x, y: target.y + target.height }, ball) <= 135
        && direction({ x: target.x, y: target.y + target.height }, ball) > 0
        && direction({ x: target.x + target.width, y: target.y + target.height }, ball) >= 45
        && direction({ x: target.x + target.width, y: target.y + target.height }, ball) < 180
    ) {
        output.direction = 'down';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        // && ball.y >= target.y
        // && ball.y <= target.y + target.height
        && direction({ x: target.x, y: target.y }, ball) < 225
        && direction({ x: target.x, y: target.y }, ball) > 90
        && direction({ x: target.x, y: target.y + target.height }, ball) > 135
        && direction({ x: target.x, y: target.y + target.height }, ball) < 270
    ) {
        output.direction = 'left';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        // && ball.y >= target.y
        // && ball.y <= target.y + target.height
        && ((direction({ x: target.x + target.width, y: target.y }, ball) > 315
            && direction({ x: target.x + target.width, y: target.y }, ball) < 360)
            || (direction({ x: target.x + target.width, y: target.y }, ball) < 90
                && direction({ x: target.x + target.width, y: target.y }, ball) >= 0))
        && ((direction({ x: target.x + target.width, y: target.y + target.height }, ball) < 45
            && direction({ x: target.x + target.width, y: target.y + target.height }, ball) >= 0)
            || (direction({ x: target.x + target.width, y: target.y + target.height }, ball) > 270
                && direction({ x: target.x + target.width, y: target.y + target.height }, ball) < 360))
    ) {
        output.direction = 'right';
        collisionOutput()
        return output;
    }
    /* if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topright';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
        // && Math.pow(Math.pow(ball.y - target.y - target.height, 2) + Math.pow(ball.x - target.x, 2), 0.5) < ball.r
    ) {
        output.direction = 'bottomleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
    ) {
        output.direction = 'bottomright';
        collisionOutput()
        return output;
    } */
    return output;

}

/* function tragectoryCurve(ball, hitOffset, curveCoefficient) {
    ball.velocity = Math.pow(ball.vx * ball.vx + ball.vy * ball.vy, 0.5);
    ball.angle = Math.atan2(ball.vy, ball.vx) / Math.PI * 180;
    if (ball.angle < 0) {
        ball.angle = 360 + ball.angle;
    }
    ball.angle0 = ball.angle;
    ball.angle = ball.angle + hitOffset * curveCoefficient;
    console.log({
        ballvx0: ball.vx,
        ballvy0: ball.vy,
        ballvx: Math.round(Math.sin(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100,
        ballvy: Math.round(Math.cos(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100,
        angle0: ball.angle0,
        angle: ball.angle,
        hitOffset: hitOffset,
        velocity0: ball.velocity,
        angleOffset: hitOffset * curveCoefficient
    });
    return {
        vx: Math.round(Math.sin(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100,
        vy: Math.round(Math.cos(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100
    }
} */

function tragectoryCurve(ball, hitOffset, curveCoefficient) {
    ball.angle = motionInfo(ball).direction - hitOffset * curveCoefficient;
    ball.velocity = motionInfo(ball).velocity;
    return {
        // vx0: ball.vx,
        // vy0: ball.vy,
        // angle0: motionInfo(ball).direction,
        // angle: ball.angle,
        // velocity: ball.velocity,
        vy: Math.round(Math.sin(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100,
        vx: Math.round(Math.cos(ball.angle * Math.PI / 180) * ball.velocity * 100) / 100
    }
}

function direction(pointOfView, target) {
    let output = Math.round(Math.atan2(target.y - pointOfView.y, target.x - pointOfView.x) / Math.PI * 180 * 100) / 100;
    if (output < 0) {
        output = 360 + output;
    }
    return output;
}

/* function motionDirection(movingObject) {
    let output = Math.round(Math.atan2(movingObject.vy, movingObject.vx) / Math.PI * 180 * 100) / 100;
    if (output < 0) {
        output = 360 + output;
    }
    return output;
} */

/* function motionVelocity(movingObject) {
    return Math.round(Math.pow(movingObject.vx * movingObject.vx + movingObject.vy * movingObject.vy, 0.5) * 100) / 100;
} */

function motionInfo(movingObject) {
    let output = {
        direction: null,
        velocity: null
    }
    output.direction = Math.round(Math.atan2(movingObject.vy, movingObject.vx) / Math.PI * 180 * 100) / 100;
    if (output.direction < 0) {
        output.direction = 360 + output.direction;
    }
    output.velocity = Math.round(Math.pow(movingObject.vx * movingObject.vx + movingObject.vy * movingObject.vy, 0.5) * 100) / 100;
    return output;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }