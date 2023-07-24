// import { Projectile } from "./player.js";
import { PowerUp } from "../classes/PowerUps.js";
import { Boss, FireBoss, IceBoss } from "../classes/Bosses.js";
import { Enemy, GunnerEnemy } from "../classes/Enemies.js";

let id, id2;

export function spawnEnemies() {
  id = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    // console.log('radius', radius)
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    if (window.kills >= 2 && bosses.length === 0) {
      console.log("bosses time");
      let health = 100;
      enemies = [];
      bosses.push(new Boss(0, 0, 50, "red", { x: 0, y: 0 }, health));
      clearInterval(id);
    } else {
      let enemyType = [
        new Enemy(x, y, radius, color, velocity),
        new GunnerEnemy(x, y, radius, color, velocity, player),
      ];
      const enemy = enemyType[Math.floor(Math.random() * enemyType.length)];
      if (enemy.name === "gunner" && deviceType() === "mobile") {
        let mobileFriendlyEnemy = new Enemy(x, y, radius, color, velocity);
        enemies.push(mobileFriendlyEnemy);
      } else {
        enemies.push(enemy);
      }
    }
  }, 4000);
}

export function spawnPowerUps() {
  id2 = setInterval(() => {
    const color = `white`;
    const weapon = new PowerUp(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      10,
      color
    );
    powerUps.push(weapon);
  }, 5000);
}

var timer;
export function endAndStartTimer() {
  clearTimeout(timer);
  var waitTime = 5000;
  timer = setTimeout(function () {
    weaponType = "default";
  }, waitTime);
}

export const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};
