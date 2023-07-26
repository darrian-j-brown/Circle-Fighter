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
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
      const index = particles.indexOf(this);
      if (index !== -1) {
        particles.splice(index, 1);
      }
    }
  }
}
