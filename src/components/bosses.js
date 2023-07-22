import { Enemy } from "./enemies.js";
import { Projectile } from "./player.js";
import { Particle } from "./particle.js";
const healthBarContainer = document.querySelector(".health-bar-container");

export class Boss extends Enemy {
  constructor(x, y, radius, color, velocity, health) {
    super(x, y, radius, color, velocity);
    this.health = health;
    this.maxHealth = health;
    this.speed = 0.5;
    this.damage = 1;
    this.shootInterval = null;
  }

  shoot(player) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = 5;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    projectiles.push(new Projectile(this.x, this.y, 5, "yellow", velocity));
  }

  update(player) {
    this.draw(player);

    // Adjust boss difficulty based on remaining health
    const remainingHealthPercentage = this.health / this.maxHealth;

    if (remainingHealthPercentage < 0.5) {
      // Increase boss speed gradually
      this.speed = 0.8;
      this.damage = 2;

      if (!this.shootInterval) {
        this.shootInterval = setInterval(() => {
          this.shoot(player);
        }, 1500);
      }
    }

    if (remainingHealthPercentage < 0.3) {
      // Further increase boss speed gradually
      this.speed = 5;
      // this.damage = 3;
    }

    // Enemy tracking player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const angle = Math.atan2(dy, dx);

    // Calculate velocity towards the player with the updated speed
    const velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed,
    };

    // Update boss position
    this.x += velocity.x;
    this.y += velocity.y;
  }

  destroy() {
    // Stop shooting interval when the boss is destroyed
    if (this.shootInterval) {
      clearInterval(this.shootInterval);
    }
  }
}

export class IceBoss extends Boss {
  constructor(x, y, radius, color, velocity, health) {
    super(x, y, radius, color, velocity, health);
    this.particles = [];
    this.colors = ["#ffffff", "#b9e8ea", "#86d6d8", "#20c3d0", "#3fd0d4"];
  }

  draw(player) {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();

    // Enemy tracking player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const theta = Math.atan2(dy, dx);
    this.x += 0.5 * Math.cos(theta);
    this.y += 0.5 * Math.sin(theta);
    healthBarContainer.style.top = `${this.y - 30}px`;
    healthBarContainer.style.left = `${this.x}px`;

    for (let i = 0; i < 2.5; i++) {
      const particleColor =
        this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(
        new Particle(this.x, this.y, Math.random() * 2, particleColor, {
          x: (Math.random() - 0.5) * (Math.random() * 6),
          y: (Math.random() - 0.5) * (Math.random() * 6),
        })
      );
    }

    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }
}

export class FireBoss extends IceBoss {
  constructor(x, y, radius, color, velocity, health) {
    super(x, y, radius, color, velocity, health);
    this.colors = ["#800909", "#f07f13", "#f27d0c", "#757676", "#fdcf58"];
  }
}
