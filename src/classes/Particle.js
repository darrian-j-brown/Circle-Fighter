import { Projectile } from "./Projectile.js";

export class Particle extends Projectile {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity);
    this.alpha = 1;
    this.friction = 0.98;
  }

  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;

    if (this.alpha <= 0) {
      // Remove the particle from the array or perform cleanup
      particles.splice(particles.indexOf(this), 1);
    }
  }
}

export class ParticleExplosion extends Particle {
  constructor(x, y, color, particles) {
    super(x, y, 3, color, { x: 0, y: 0 });
    this.particles = particles;
    this.particleCount = 400; // Adjust the number of particles in the explosion
    this.duration = 3500; // Duration of the explosion in milliseconds
  }

  update(deltaTime) {
    this.duration -= deltaTime;
    if (this.duration <= 0) {
      this.particles = []; // Clear particles after the explosion duration
    }

    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }

  draw() {
    this.particles.forEach((particle) => {
      particle.draw();
    });
  }
}
