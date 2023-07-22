const shootAudio = new Howl({
  src: ["../audio/mixkit-short-laser-gun-shot-1670.mp3"],
});
const healthBarContainer = document.querySelector(".health-bar-container");

const playerPng = new Image();
playerPng.src = "../images/Jet.png";

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.width = 50; // Adjust the width of the fighter jet image
    this.height = 50; // Adjust the height of the fighter jet image
    this.radius = radius;
    this.color = color;
    this.controls = [];
  }

  shoot(mouse) {
    shootAudio.play();
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    const velocity = {
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
    };

    if (weaponType === "default") {
      projectiles.push(new Projectile(this.x, this.y, 5, "green", velocity));
    } else if (weaponType === "RapidFire") {
      projectiles.push(new Projectile(this.x, this.y, 5, "blue", velocity));
    } else if (weaponType === "Shotgun") {
      const velocities = [
        { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 },
        { x: Math.cos(angle - 0.1) * 5, y: Math.sin(angle - 0.1) * 5 },
        { x: Math.cos(angle + 0.1) * 5, y: Math.sin(angle + 0.1) * 5 },
        { x: Math.cos(angle - 0.2) * 5, y: Math.sin(angle - 0.2) * 5 },
        { x: Math.cos(angle + 0.2) * 5, y: Math.sin(angle + 0.2) * 5 },
      ];

      velocities.forEach((velocity) => {
        projectiles.push(new Projectile(this.x, this.y, 5, "red", velocity));
      });
    }
  }

  draw() {
    // Code to render player as a fighter jet
    context.save();
    context.translate(this.x, this.y);
    context.rotate(Math.atan2(mouse.y - this.y, mouse.x - this.x));
    context.drawImage(
      playerPng,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.restore();
  }

  destroy() {
    this.x = -100;
    this.y = -100;
  }

  update() {
    this.draw();
  }
}

export class Projectile extends Player {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class LaserBeam extends Projectile {
  constructor(x, y, width, height, color, velocity) {
    super(x, y, width, height, color, velocity);
    this.duration = 1000; // Duration of the laser beam in milliseconds
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.move();
    this.duration -= deltaTime;

    if (this.duration <= 0) {
      this.destroy();
    }
  }

  destroy() {
    // Remove the laser beam from the projectiles array
    const index = projectiles.indexOf(this);
    if (index !== -1) {
      projectiles.splice(index, 1);
    }
  }
}
