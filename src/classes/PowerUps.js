import { Projectile } from "./Projectile.js";

export class Shockwave extends Projectile {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity);
    this.name = "Shockwave";
  }

  draw() {
    context.save();
    context.lineWidth = 5;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = this.color;
    context.stroke();
    context.restore();
  }

  update() {
    this.draw();
  }
}

export class Shield {
  constructor(radius, color, opacity, player) {
    this.name = "Shield";
    this.radius = radius;
    this.color = color;
    this.opacity = opacity;
    this.player = player;
  }

  attach(player) {
    this.player = player;
  }

  draw() {
    if (!this.player) return;

    const { x, y } = this.player;

    context.save();
    context.globalAlpha = this.opacity;
    context.beginPath();
    context.arc(x, y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  update() {
    this.draw();
  }
}

// Give Bosses an Id;
const names = ["RapidFire", "Shotgun"];
const powerUpImg = new Image();
powerUpImg.src = "./images/lightning.png";

// function showNotification(powerUpName) {
//   const notification = document.createElement("div");
//   notification.textContent = "You got a power-up: " + powerUpName;
//   notification.classList.add("power-up-notification");
//   document.body.appendChild(notification);

//   setTimeout(() => {
//     notification.remove();
//   }, 3000);
// }

export class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 35;
    this.radians = 0;
    this.name = names[Math.floor(Math.random() * names.length)];
  }

  draw() {
    context.save();
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.radians);
    context.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    context.drawImage(powerUpImg, this.x, this.y, 35, 35);
    context.restore();
  }

  update() {
    this.radians += 0.05;
    this.draw();
  }

  pickedUp() {
    showNotification(this.name);
  }
}
