import { Projectile, Shotgun, RapidFire, LaserBeam } from "./Projectile.js";

const shootAudio = new Howl({
  src: ["../audio/mixkit-short-laser-gun-shot-1670.mp3"],
});

const playerPng = new Image();
playerPng.src = "../images/f22SVG.png";

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.width = 50; // Adjust the width of the fighter jet image
    this.height = 50; // Adjust the height of the fighter jet image
    this.radius = radius;
    this.color = color;
    this.controls = [];
    this.weaponType = "default";
  }

  shoot(mouse) {
    shootAudio.play();

    if (this.weaponType === "default") {
      projectiles.push(
        new Projectile(
          this.x,
          this.y,
          5,
          "green",
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

  getVelocity(mouse) {
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    return {
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
    };
  }
}
