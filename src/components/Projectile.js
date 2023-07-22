export class Projectile {
  constructor(x, y, radius, color, velocity) {
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
    context.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class Shotgun {
  constructor(x, y, playerColor, mouse) {
    this.x = x;
    this.y = y;
    this.color = "red";
    this.mouse = mouse;
    this.angle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);
    this.velocities = [
      { x: Math.cos(this.angle) * 5, y: Math.sin(this.angle) * 5 },
      { x: Math.cos(this.angle - 0.1) * 5, y: Math.sin(this.angle - 0.1) * 5 },
      { x: Math.cos(this.angle + 0.1) * 5, y: Math.sin(this.angle + 0.1) * 5 },
      { x: Math.cos(this.angle - 0.2) * 5, y: Math.sin(this.angle - 0.2) * 5 },
      { x: Math.cos(this.angle + 0.2) * 5, y: Math.sin(this.angle + 0.2) * 5 },
    ];
    this.playerColor = playerColor;
  }

  shoot(projectiles) {
    this.velocities.forEach((velocity) => {
      projectiles.push(
        new Projectile(
          this.x,
          this.y,
          5,
          this.color,
          velocity,
          this.playerColor
        )
      );
    });
  }
}

export class RapidFire {
  constructor(x, y, playerColor, mouse) {
    this.x = x;
    this.y = y;
    this.color = "blue";
    this.mouse = mouse;
    this.angle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);
    this.velocity = {
      x: Math.cos(this.angle) * 10,
      y: Math.sin(this.angle) * 10,
    };
    this.playerColor = playerColor;
  }

  shoot(projectiles) {
    projectiles.push(
      new Projectile(
        this.x,
        this.y,
        5,
        this.color,
        this.velocity,
        this.playerColor
      )
    );
  }
}

// export class LaserBeam {
//   constructor(x, y, width, height, color, velocity) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     this.color = color;
//     this.velocity = velocity;
//     this.duration = 1000; // Duration of the laser beam in milliseconds
//   }

//   draw() {
//     // Calculate the end point of the laser beam based on its velocity and duration
//     const endPointX = this.x + this.velocity.x * this.duration;
//     const endPointY = this.y + this.velocity.y * this.duration;

//     // Create a gradient for the laser beam
//     const gradient = context.createLinearGradient(
//       this.x,
//       this.y,
//       endPointX,
//       endPointY
//     );
//     gradient.addColorStop(0, "transparent"); // Start with a transparent color
//     gradient.addColorStop(0.5, this.color); // Middle with the actual color
//     gradient.addColorStop(1, "transparent"); // End with a transparent color

//     // Draw the laser beam as a line with the gradient stroke style
//     context.strokeStyle = gradient;
//     context.lineWidth = 10; // Adjust the width of the laser beam
//     context.lineCap = "round"; // Add rounded line caps for a smoother appearance
//     context.beginPath();
//     context.moveTo(this.x, this.y);
//     context.lineTo(endPointX, endPointY);
//     context.stroke();
//   }

//   update(deltaTime) {
//     this.draw();
//     this.x = this.x + this.velocity.x;
//     this.y = this.y + this.velocity.y;
//     this.duration -= deltaTime;

//     if (this.duration <= 0) {
//       this.destroy();
//     }
//   }

//   destroy() {
//     // Remove the laser beam from the projectiles array
//     const index = projectiles.indexOf(this);
//     if (index !== -1) {
//       projectiles.splice(index, 1);
//     }
//   }
// }
