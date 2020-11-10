const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const healthBarContainer = document.querySelector('.health-bar-container')

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;    
    this.controls = [];
  }
  
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
  }

  destroy() {
    // removes player from screen without having to redraw
    this.x = -100;
    this.y = -100; 
  }

  update() {
    this.draw();
    // Player movement
    if (this.controls && this.controls[87]) {this.y -= 5; }
    if (this.controls && this.controls[65]) {this.x -= 5; }
    if (this.controls && this.controls[83]) {this.y += 5; }
    if (this.controls && this.controls[68]) {this.x += 5; }
  }
}

export class Projectile {
  constructor (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class Enemy {
  constructor (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    
  }
  
  draw(player) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()

    //enemy tracking player
    let dx = player.x - this.x 
    let dy = player.y - this.y
    let theta = Math.atan2(dy, dx);
    // let nx = this.x + Math.cos(theta);
    // let ny = this.y + Math.sin(theta);
    this.x += 1 * Math.cos(theta);
    this.y += 1 * Math.sin(theta);

    // this.x += this.speed * Math.sin(this.angle);
    // this.y -= this.speed * Math.cos(this.angle);

  }

  update(player) {
    this.draw(player);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class Boss {
  constructor (x, y, radius, color, velocity, health) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.health = health
  }
  
  draw(player) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()

    //enemy tracking player
    let dx = player.x - this.x 
    let dy = player.y - this.y
    let theta = Math.atan2(dy, dx);
    this.x += .5 * Math.cos(theta);
    this.y += .5 * Math.sin(theta);
    healthBarContainer.style.top = `${this.y - 30}px`
    healthBarContainer.style.left = `${this.x}px`
    
  }

  update(player) {
    this.draw(player);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const frication = 0.99;
export class Particle {
  constructor (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  
  draw() {
    context.save()
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
    context.restore()
  }

  update() {
    this.draw();
    this.velocity.x *= frication;
    this.velocity.y *= frication;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01
  }
}

