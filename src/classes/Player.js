import { Projectile, Shotgun, RapidFire, LaserBeam } from "./Projectile.js";

const shootAudio = new Howl({
  src: ["../audio/mixkit-short-laser-gun-shot-1670.mp3"],
});

const playerPng = new Image();
playerPng.src = "../images/starfighter.svg";

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.width = 50; // Adjust the width of the fighter jet image
    this.height = 50; // Adjust the height of the fighter jet image
    this.health = 100;
    this.radius = radius;
    this.color = color;
    this.controls = [];
    this.weaponType = "default";
    this.movementSpeed = 0.15;

    this.velocity = {
      x: 0,
      y: 0,
    };
    this.friction = 0.98; // Adjust the friction factor
  }

  shoot(mouse) {
    shootAudio.play();

    if (this.weaponType === "default") {
      projectiles.push(
        new Projectile(
          this.x,
          this.y,
          5,
          "black",
          this.getVelocity(mouse),
          this.color,
          mouse
        )
      );
    } else if (this.weaponType === "RapidFire") {
      const rapidFire = new RapidFire(this.x, this.y, this.color, mouse);
      rapidFire.shoot(projectiles);
    } else if (this.weaponType === "Shotgun") {
      const shotgun = new Shotgun(this.x, this.y, this.color, mouse);
      shotgun.shoot(projectiles);
    } else if (this.weaponType === "LaserBeam") {
      const laserBeam = new LaserBeam(
        this.x,
        this.y,
        10,
        10,
        "blue",
        this.getVelocity(mouse),
        10000
      );
      projectiles.push(laserBeam); // Add the laser beam instance to the projectiles array
    }
  }

  drawHealthBar() {
    const healthBarWidth = 50;
    const healthBarHeight = 5;
    const maxHealth = 100;

    const healthBarX = this.x - healthBarWidth / 2;
    const healthBarY = this.y + this.height / 2 + 10; // Adjust the Y position as needed

    context.beginPath();
    context.rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    context.fillStyle = "red"; // Color of the health bar
    context.fill();

    const currentHealthWidth = (this.health / maxHealth) * healthBarWidth;
    context.beginPath();
    context.rect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    context.fillStyle = "lightgreen"; // Color of the current health
    context.fill();
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
    this.drawHealthBar();
  }

  destroy() {
    this.x = -100;
    this.y = -100;
  }

  takeDamage(damageType) {
    // Enemy collides with player
    if (damageType.name === "Enemy" || damageType.name === "GunnerEnemy") {
      this.health -= 10;
      // Boss collides with player
    } else if (damageType.name === "Boss") {
      this.health -= this.health;
    } else {
      // Projectile collides with player
      this.health -= 5;
    }
  }

  update() {
    // Draw the playersa
    this.draw();

    if (this.controls) {
      if (this.controls[87]) {
        this.velocity.y -= this.movementSpeed;
      }
      if (this.controls[65]) {
        this.velocity.x -= this.movementSpeed;
      }
      if (this.controls[83]) {
        this.velocity.y += this.movementSpeed;
      }
      if (this.controls[68]) {
        this.velocity.x += this.movementSpeed;
      }
    }

    // Apply friction to slow down the player's movement
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Update the player's position based on velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Limit the player's movement within the canvas boundaries
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.velocity.x = 0.05;
    }

    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.velocity.x = 0.05;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.velocity.y = 0.05;
    }

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.velocity.y = 0.05;
    }
  }

  getVelocity(mouse) {
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    return {
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
    };
  }
}
