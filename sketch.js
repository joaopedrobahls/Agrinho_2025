let groundY;
let netX;

let player1 = {
  x: 100,
  y: 0,
  width: 50,
  height: 80,
  speed: 5,
  isJumping: false,
  jumpSpeed: 0,
  color: [255, 150, 150],
};

let player2 = {
  x: 450,
  y: 0,
  width: 50,
  height: 80,
  speed: 5,
  isJumping: false,
  jumpSpeed: 0,
  color: [150, 150, 255],
};

let ball = {
  x: 300,
  y: 200,
  radius: 20,
  speedX: 4,
  speedY: -6,
};

let gravity = 0.8;

let leftScore = 0;
let rightScore = 0;

function setup() {
  createCanvas(600, 400);
  groundY = height - 50;
  netX = width / 2;

  player1.y = groundY - player1.height;
  player2.y = groundY - player2.height;

  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(200, 230, 255);

  // chão
  fill(100, 200, 100);
  rect(0, groundY, width, height - groundY);

  // rede
  stroke(150);
  strokeWeight(8);
  line(netX, groundY - 120, netX, groundY);
  noStroke();

  // desenha jogadores
  drawPlayer(player1);
  drawPlayer(player2);

  // desenha bola
  fill(255, 255, 100);
  ellipse(ball.x, ball.y, ball.radius * 2);

  // movimenta jogadores
  movePlayer(player1, 'A', 'D', 'W', 0, netX - player1.width);
  movePlayer(player2, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, netX, width - player2.width);

  // movimenta bola
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  ball.speedY += gravity * 0.4;

  // colisão bola com chão e pontuação
  if (ball.y + ball.radius > groundY) {
    ball.y = groundY - ball.radius;
    if (ball.x < netX) {
      rightScore++;
    } else {
      leftScore++;
    }
    resetBall();
  }

  // colisão bola com paredes
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.speedX *= -1;
  }

  // colisão bola com rede
  if (
    ball.x + ball.radius > netX - 5 &&
    ball.x - ball.radius < netX + 5 &&
    ball.y + ball.radius > groundY - 120
  ) {
    ball.speedX *= -1;
    if (ball.x < netX) {
      ball.x = netX - ball.radius - 5;
    } else {
      ball.x = netX + ball.radius + 5;
    }
  }

  // colisão bola com jogadores
  checkCollisionWithPlayer(player1);
  checkCollisionWithPlayer(player2);

  // pontuação
  fill(0);
  text(`${leftScore}`, width / 4, 30);
  text(`${rightScore}`, (width / 4) * 3, 30);
}

function drawPlayer(p) {
  fill(p.color);
  rect(p.x, p.y, p.width, p.height, 20);
}

function movePlayer(p, leftKey, rightKey, jumpKey, leftLimit, rightLimit) {
  if (keyIsDown(typeof leftKey === 'number' ? leftKey : leftKey.charCodeAt(0))) {
    p.x -= p.speed;
    p.x = max(p.x, leftLimit);
  }
  if (keyIsDown(typeof rightKey === 'number' ? rightKey : rightKey.charCodeAt(0))) {
    p.x += p.speed;
    p.x = min(p.x, rightLimit);
  }

  if (p.isJumping) {
    p.y += p.jumpSpeed;
    p.jumpSpeed += gravity;
    if (p.y >= groundY - p.height) {
      p.y = groundY - p.height;
      p.isJumping = false;
      p.jumpSpeed = 0;
    }
  }
}

function keyPressed() {
  if (key === 'W' || key === 'w') {
    if (!player1.isJumping) {
      player1.isJumping = true;
      player1.jumpSpeed = -15;
    }
  }
  if (keyCode === UP_ARROW) {
    if (!player2.isJumping) {
      player2.isJumping = true;
      player2.jumpSpeed = -15;
    }
  }
}

function resetBall() {
  ball.x = width / 2;
  ball.y = groundY - ball.radius - 100;
  ball.speedX = random([-4, 4]);
  ball.speedY = -6;
}

function checkCollisionWithPlayer(p) {
  if (
    ball.x + ball.radius > p.x &&
    ball.x - ball.radius < p.x + p.width &&
    ball.y + ball.radius > p.y &&
    ball.y - ball.radius < p.y + p.height
  ) {
    ball.speedY = -abs(ball.speedY);
  }
}