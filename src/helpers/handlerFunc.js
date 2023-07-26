// import { Projectile } from "./player.js";
import { PowerUp } from "../classes/PowerUps.js";
import { Boss, FireBoss, IceBoss } from "../classes/Bosses.js";
import { Enemy, GunnerEnemy } from "../classes/Enemies.js";

let id, id2;

export function spawnEnemies(gameData) {
  id = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
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

    if (window.kills >= gameData.kills && bosses.length === 0) {
      console.log("bosses time");
      let health = 100;
      enemies = [];
      if (gameData.name === "FireBoss") {
        bosses.push(
          new FireBoss(
            gameData.x,
            gameData.y,
            gameData.radius,
            gameData.color,
            gameData.velocity,
            gameData.health,
            gameData.player
          )
        );
      } else if (gameData.name === "IceBoss") {
        bosses.push(
          new IceBoss(
            gameData.x,
            gameData.y,
            gameData.radius,
            gameData.color,
            gameData.velocity,
            gameData.health,
            gameData.shieldHealth,
            gameData.player
          )
        );
      } else {
        bosses.push(
          new Boss(
            gameData.x,
            gameData.y,
            gameData.radius,
            gameData.color,
            gameData.velocity,
            gameData.health,
            gameData.player
          )
        );
      }

      clearInterval(id);
    } else {
      let enemyType = gameData.enemies;
      const enemy = enemyType[Math.floor(Math.random() * enemyType.length)];
      if (enemy === "Enemy") {
        enemies.push(new Enemy(x, y, radius, color, velocity));
      } else if (enemy === "GunnerEnemy") {
        enemies.push(new GunnerEnemy(x, y, radius, color, velocity, player));
      }
      if (enemy.name === "GunnerEnemy" && deviceType() === "mobile") {
        let mobileFriendlyEnemy = new Enemy(x, y, radius, color, velocity);
        enemies.push(mobileFriendlyEnemy);
      }
    }
  }, gameData.enemySpawnRate);
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
