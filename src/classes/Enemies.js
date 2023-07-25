import { Projectile } from "./Projectile.js";

export class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.name = "Enemy"; //TODO - Enemies should have something unqiue to identify them as a whole (this.familyType === enemy)
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
    context.fill();
    context.lineWidth = 3.5;
    context.strokeStyle = "black";
    context.stroke();

    // Enemy tracking player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const angle = Math.atan2(dy, dx);
    const speed = 1;

    // Calculate velocity towards the player
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    this.x += velocity.x;
    this.y += velocity.y;
  }

  update(player) {
    this.draw(player);
  }
}

export class GunnerEnemy extends Enemy {
  constructor(x, y, radius, color, velocity, player) {
    super(x, y, radius, color, velocity);
    this.projectiles = [];
    this.name = "GunnerEnemy";

    this.shootInterval = setInterval(() => {
      this.shoot(player);
    }, 1500);
  }

  shoot(player) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = 5;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    this.projectiles.push(
      new Projectile(this.x, this.y, 5, "yellow", velocity)
    );
  }

  update(player) {
    this.draw(player);

    this.projectiles.forEach((projectile) => {
      projectile.update();
    });
  }

  destroy() {
    clearInterval(this.shootInterval);
  }
}
