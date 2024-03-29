import { Projectile } from "./Projectile.js";
import { Particle } from "./Particle.js";

export class Boss {
  constructor(x, y, radius, color, velocity, health) {
    this.name = "Boss";
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.health = health;
    this.maxHealth = health;
    this.speed = 0.3;
    this.damage = 1;
    this.shootInterval = null;
    this.healthBarWidth = 100; // Width of the health bar (you can adjust this value)
    this.healthBarHeight = 10; // Height of the health bar (you can adjust this value)
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

  drawHealthBar() {
    const remainingHealthPercentage = this.health / this.maxHealth;
    const healthBarWidth = 100; // Width of the health bar (you can adjust this value)
    const healthBarHeight = 10; // Height of the health bar (you can adjust this value)

    // Calculate health bar position above the boss
    const healthBarX = this.x - healthBarWidth / 2;
    const healthBarY = this.y - this.radius - 20; // Adjust this value for desired spacing

    // Draw the background of the health bar
    context.beginPath();
    context.rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    context.fillStyle = "red";
    context.fill();
    context.closePath();

    // Draw the remaining health
    context.beginPath();
    context.rect(
      healthBarX,
      healthBarY,
      healthBarWidth * remainingHealthPercentage,
      healthBarHeight
    );
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
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
    const speed = 0.1;

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
    this.drawHealthBar();

    // Adjust boss difficulty based on remaining health
    const remainingHealthPercentage = this.health / this.maxHealth;

    if (remainingHealthPercentage < 0.5) {
      // Increase boss speed gradually
      this.speed = 0.5;
      this.damage = 1;

      if (!this.shootInterval) {
        this.shootInterval = setInterval(() => {
          // this.shoot(player);
        }, 1500);
      }
    }

    if (remainingHealthPercentage < 0.3) {
      // Further increase boss speed gradually
      this.speed = 2;
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

    // Check if boss is defeated
    if (this.health <= 0) {
      this.destroy();
    }
  }

  takeDamage() {
    this.health -= this.damage;
  }

  destroy() {
    // Stop shooting interval when the boss is destroyed
    if (this.shootInterval) {
      clearInterval(this.shootInterval);
    }
    // Add any additional actions when the boss is destroyed
    // For example, spawn particles or trigger a victory event.
  }
}

export class IceBoss extends Boss {
  constructor(x, y, radius, color, velocity, health, shieldHealth, player) {
    super(x, y, radius, color, velocity, health);
    this.player = player;
    this.name = "IceBoss";
    this.projectiles = [];
    this.colors = ["#ffffff", "#b9e8ea", "#86d6d8", "#20c3d0", "#3fd0d4"];
    this.shieldHealth = shieldHealth;
    this.isShieldActive = true;
  }

  takeDamage() {
    let damage = 1;
    if (this.isShieldActive) {
      this.shieldHealth -= damage;
      if (this.shieldHealth <= 0) {
        this.isShieldActive = false; // Shield breaks
        this.shieldHealth = 0;
      }
    } else {
      // If the shield is broken, boss takes direct damage to its health
      this.health -= damage;
    }
  }

  applyFrostbite(radius) {
    const playerDistToBoss = Math.hypot(player.x - this.x, player.y - this.y);
    const playerInAuraRadius = playerDistToBoss <= radius;
    if (playerInAuraRadius) {
      player.movementSpeed = 0.05;
    } else {
      player.movementSpeed = 0.15;
    }
  }

  draw(player) {
    // Boss movement
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const theta = Math.atan2(dy, dx);
    this.x += 0.5 * Math.cos(theta);
    this.y += 0.5 * Math.sin(theta);

    // Draw the boss
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();

    // Draw the boss aura (frostbite aura)
    // Set the transparency level for the aura
    const auraAlpha = 0.03; // Adjust the transparency level (0.0 - fully transparent, 1.0 - fully opaque)
    const auraRadius = this.radius + 100; // Adjust the size of the aura as needed
    context.globalAlpha = auraAlpha;

    context.beginPath();
    context.arc(this.x, this.y, auraRadius, 0, Math.PI * 2, false);
    context.fillStyle = "lightblue"; // Color of the aura
    context.fill();
    context.globalAlpha = 1.0;

    // Draw the boss shield
    if (this.isShieldActive && this.shieldHealth > 0) {
      const shieldRadius = this.radius + 10; // Adjust the size of the shield as needed

      // Create a radial gradient for the shield
      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        shieldRadius * 0.5, // Inner circle radius for the gradient
        this.x,
        this.y,
        shieldRadius // Outer circle radius for the gradient
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)"); // Inner color (more opaque)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)"); // Outer color (more transparent)

      context.beginPath();
      context.arc(this.x, this.y, shieldRadius, 0, Math.PI * 2, false);
      context.strokeStyle = gradient; // Use the gradient as the fill style
      context.lineWidth = 10;
      context.stroke();
    }

    // Boss health bar
    this.drawHealthBar();

    // Apple frostbite to player
    this.applyFrostbite(auraRadius);
  }
}

export class FireBoss extends IceBoss {
  constructor(x, y, radius, color, velocity, health, player) {
    super(x, y, radius, color, velocity, health);
    this.name = "FireBoss";
    this.colors = ["#800909", "#f07f13", "#f27d0c", "#757676", "#fdcf58"];
    this.blazingEffectActive = false;
    this.blazingEffectInterval = 500;
    this.damage = 2;
  }

  takeDamage() {
    this.health -= this.damage;
  }

  applyBlazingEffect(auraRadius) {
    const playerDistToBoss = Math.hypot(player.x - this.x, player.y - this.y);
    const playerInAuraRadius = playerDistToBoss <= auraRadius;

    if (playerInAuraRadius && !this.blazingEffectActive) {
      this.blazingEffectActive = true;

      // Player takes damage within the boss's aura, but with a throttled interval
      setTimeout(() => {
        player.takeDamage({ name: "Enemy" });
        this.blazingEffectActive = false; // Reset the flag to allow damage again after the interval
      }, this.blazingEffectInterval);
    }
  }

  draw(player) {
    // Boss movement
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const theta = Math.atan2(dy, dx);
    this.x += 0.5 * Math.cos(theta);
    this.y += 0.5 * Math.sin(theta);

    // Draw the boss
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();

    // Draw the boss aura (frostbite aura)
    // Set the transparency level for the aura
    const auraAlpha = 0.03; // Adjust the transparency level (0.0 - fully transparent, 1.0 - fully opaque)
    const auraRadius = this.radius + 100; // Adjust the size of the aura as needed
    context.globalAlpha = auraAlpha;

    context.beginPath();
    context.arc(this.x, this.y, auraRadius, 0, Math.PI * 2, false);
    context.fillStyle = "orange"; // Color of the aura
    context.fill();
    context.globalAlpha = 1.0;

    // Draw the boss shield
    if (this.isShieldActive && this.shieldHealth > 0) {
      const shieldRadius = this.radius + 10; // Adjust the size of the shield as needed

      // Create a radial gradient for the shield
      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        shieldRadius * 0.5, // Inner circle radius for the gradient
        this.x,
        this.y,
        shieldRadius // Outer circle radius for the gradient
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)"); // Inner color (more opaque)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)"); // Outer color (more transparent)

      context.beginPath();
      context.arc(this.x, this.y, shieldRadius, 0, Math.PI * 2, false);
      context.strokeStyle = gradient; // Use the gradient as the fill style
      context.lineWidth = 10;
      context.stroke();
    }

    // Boss health bar
    this.drawHealthBar();

    // Apple frostbite to player
    this.applyBlazingEffect(auraRadius);
  }
}

// export class BlackHoleBoss extends Boss {
//   constructor(x, y, radius, color) {
//     super(x, y, radius, color);
//     this.health = 1; // Boss's health
//     this.projectileAttractionRadius = 300; // Radius within which projectiles are attracted
//     this.playerAttractionRadius = 400; // Radius within which player is attracted
//     this.damageAuraRadius = 50; // Radius of the damaging aura around the boss
//     this.damageAuraDamage = 1; // Amount of damage caused by the damaging aura
//   }

//   attractProjectiles(projectiles) {
//     projectiles.forEach((projectile, index) => {
//       const distance = Math.hypot(projectile.x - this.x, projectile.y - this.y);

//       if (distance < this.projectileAttractionRadius) {
//         const angle = Math.atan2(this.y - projectile.y, this.x - projectile.x);
//         projectile.velocity.x += Math.cos(angle) * 1.5;
//         projectile.velocity.y += Math.sin(angle) * 1.5;
//       }

//       if (distance < this.radius + projectile.radius) {
//         projectiles.splice(index, 1);
//       }
//     });
//   }

//   attractPlayer(player) {
//     const distance = Math.hypot(player.x - this.x, player.y - this.y);

//     if (distance < this.playerAttractionRadius) {
//       const angle = Math.atan2(this.y - player.y, this.x - player.x);
//       player.x += Math.cos(angle) * 0.2;
//       player.y += Math.sin(angle) * 0.2;
//     }
//   }

//   damageAura(player) {
//     const distance = Math.hypot(player.x - this.x, player.y - this.y);

//     if (distance < this.damageAuraRadius) {
//       player.takeDamage(this.damageAuraDamage);
//     }
//   }

//   takeDamage(damage, particles) {
//     this.health -= damage;

//     // Add visual effect when boss takes damage (e.g., flash effect)
//     const flashColor = "red"; // Color to use for the flash effect
//     const originalColor = this.color; // Store the original color

//     // Set the boss's color to the flash color
//     this.color = flashColor;

//     // After a short delay, revert the boss's color back to the original color
//     setTimeout(() => {
//       this.color = originalColor;
//     }, 100);

//     // Add other visual effects here if needed

//     if (this.health <= 0) {
//       // Add explosion animation when boss has no health
//       const explosionColor = "orange"; // Color for the explosion particles
//       const explosion = new ParticleExplosion(this.x, this.y, explosionColor);
//       console.log(particles, "particles");
//       particles.push(explosion);

//       // Remove the boss from the game after a brief period (e.g., 2 seconds)
//       setTimeout(() => {
//         // Remove the boss from the boss array (replace 'bosses' with your actual boss array)
//         const index = bosses.indexOf(this);
//         if (index !== -1) {
//           bosses.splice(index, 1);
//         }
//       }, 2000);
//     }
//   }

//   update(player, projectiles, particles) {
//     this.attractProjectiles(projectiles);
//     this.drawHealthBar();
//     this.attractPlayer(player);
//     this.damageAura(player, particles);
//     // Other boss update logic (e.g., movement, attacking, etc.)
//   }
// }
