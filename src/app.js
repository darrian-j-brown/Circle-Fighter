import { Player } from "./classes/Player.js";
import { Particle } from "./classes/Particle.js";
import {
  spawnEnemies,
  spawnPowerUps,
  endAndStartTimer,
  deviceType,
} from "./helpers/handlerFunc.js";

const backgroundMusicAudio = new Audio("../audio/rave digger.mp3");
backgroundMusicAudio.loop = true;

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;

const x = canvas.width / 2;
const y = canvas.height / 2;

function init() {
  isGameActive = true;
  player = new Player(x, y, 25, `hsl(${360 * Math.random()}, 100%, 50%)`);
  projectiles = [];
  enemies = [];
  powerUps = [];
  bosses = [];
  particles = [];
  abilities = [];
  weaponType = "default";
  specialMeter = +"90";
  score = 0;
  kills = 0;
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
}

let animationId;
let id, id2;
function handleEndGame() {
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    isGameActive = false;
    modalEl.style.display = "flex";
    bigScoreEl.innerHTML = score;
    clearInterval(id);
    clearInterval(id2);
  }, 1000);
}

let frame = 0;
let isLaserFiring = false;
let lastTime = 0;
let currentTime = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  frame++;
  context.fillStyle = "gray";
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (player.weaponType === "RapidFire" && mouse.down && frame % 4 === 0) {
    player.shoot(mouse);
    console.log("auto fire");
  }

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update(deltaTime, projectiles);

    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  });

  bosses.forEach((boss, index) => {
    boss.draw(player);
    boss.update(player, projectiles);

    const bossDist = Math.hypot(player.x - boss.x, player.y - boss.y);
    if (bossDist - boss.radius - player.radius < 1) {
      player.takeDamage(boss);

      if (player.health <= 0) {
        for (let i = 0; i < 60 * 2; i++) {
          particles.push(
            new Particle(player.x, player.y, Math.random() * 2, player.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }
        player.destroy();
        handleEndGame();
      }
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const bossDist = Math.hypot(projectile.x - boss.x, projectile.y - boss.y);
      projectile.update();

      if (bossDist - boss.radius - projectile.radius < 1) {
        for (let i = 0; i < 10 * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              boss.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }

        if (boss.health - 1 > 1) {
          boss.takeDamage();
          score += 100;
          scoreEl.innerHTML = score;

          gsap.to(boss, {
            radius: boss.radius - 0.5,
          });

          projectiles.splice(projectileIndex, 1);
        } else {
          setTimeout(() => {
            bosses.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
          handleEndGame();
        }
      }
    });
  });

  powerUps.forEach((powerUp, index) => {
    powerUp.update();

    const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);
    const mobileDist = Math.hypot(mouse.x - powerUp.x, mouse.y - powerUp.y);

    if (dist - player.radius - powerUp.width / 2 < 1) {
      if (powerUp.name === "RapidFire") {
        player.weaponType = "RapidFire";
      } else if (powerUp.name === "Shotgun") {
        player.weaponType = "Shotgun";
      }
      // powerUp.pickedUp();
      powerUps.splice(index, 1);
      endAndStartTimer();
    } else if (
      deviceType() === "mobile" &&
      mobileDist - mouse.radius - powerUp.width / 2 < 1
    ) {
      if (powerUp.name === "RapidFire") {
        player.weaponType = "RapidFire";
      } else if (powerUp.name === "Shotgun") {
        player.weaponType = "Shotgun";
      }

      powerUps.splice(index, 1);
      endAndStartTimer();
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update(player);

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.radius - player.radius < 1) {
      player.takeDamage(enemy);

      if (player.health <= 0) {
        for (let i = 0; i < 60 * 2; i++) {
          particles.push(
            new Particle(player.x, player.y, Math.random() * 2, player.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }
        player.destroy();
        handleEndGame();
      }

      enemies.splice(index, 1);
      for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(
          new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6),
          })
        );
      }
    }

    if (enemy.projectiles) {
      enemy.projectiles.forEach((enemyProjectile, enemyProjectileIndex) => {
        const dist = Math.hypot(
          enemyProjectile.x - player.x,
          enemyProjectile.y - player.y
        );

        if (dist - player.radius - enemyProjectile.radius < 1) {
          for (let i = 0; i < player.radius * 2; i++) {
            particles.push(
              new Particle(
                enemyProjectile.x,
                enemyProjectile.y,
                Math.random() * 2,
                player.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 6),
                  y: (Math.random() - 0.5) * (Math.random() * 6),
                }
              )
            );
          }

          setTimeout(() => {
            enemy.projectiles.splice(enemyProjectileIndex, 1);
          }, 0);

          player.takeDamage(enemyProjectileIndex);

          if (player.health <= 0) {
            for (let i = 0; i < 60 * 2; i++) {
              particles.push(
                new Particle(
                  player.x,
                  player.y,
                  Math.random() * 2,
                  player.color,
                  {
                    x: (Math.random() - 0.5) * (Math.random() * 6),
                    y: (Math.random() - 0.5) * (Math.random() * 6),
                  }
                )
              );
            }
            player.destroy();
            handleEndGame();
          }
        }
      });
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }

        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreEl.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          projectiles.splice(projectileIndex, 1);
        } else {
          kills += 1;
          if (specialMeter !== 100) {
            specialMeter += +"10";
          }

          specialBarEl.style.width = `${specialMeter}%`;

          score += 100;
          scoreEl.innerHTML = score;

          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });

  abilities.forEach((ability, abilityIndex) => {
    ability.update();

    gsap.to(ability, {
      radius: ability.radius + 175,
    });

    if (ability.radius >= canvas.width && ability.radius >= canvas.height) {
      abilities.splice(abilityIndex, 1);
    }

    enemies.forEach((enemy, index) => {
      const abilityDist = Math.hypot(ability.x - enemy.x, ability.y - enemy.y);

      if (abilityDist - enemy.radius - ability.radius < 1) {
        kills += 1;
        score += 500;
        scoreEl.innerHTML = score;

        setTimeout(() => {
          enemies.splice(index, 1);
        }, 0);

        for (let i = 0; i < enemy.radius; i++) {
          particles.push(
            new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }
      }
    });
  });
}

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  modalEl.style.display = "none";
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
