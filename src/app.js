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
const items = { ...localStorage };
console.log(items, "items");
// localStorage.clear();

const devicePixelRatio = window.devicePixelRatio || 1;

if (!localStorage.getItem("level2")) {
  localStorage.setItem("level", 0);
  localStorage.setItem("level2", "locked");
  localStorage.setItem("level3", "locked");
}

// Function to unlock the next level and update button states
const unlockNextLevel = (nextLevel) => {
  localStorage.setItem(`level${nextLevel}`, "unlocked");
  updateButtonStates();
};

// Function to update the button states based on the current level
const updateButtonStates = () => {
  const buttons = document.querySelectorAll(".shaped-box");
  buttons.forEach((button) => {
    const buttonLevel = parseInt(button.dataset.level, 10);
    const buttonState = localStorage.getItem(`level${buttonLevel}`);
    if (buttonState === "unlocked") {
      button.classList.remove("locked");
      const lockIcon = button.querySelector(".lock-icon");
      if (lockIcon) {
        lockIcon.style.display = "none";
      }
    } else {
      button.classList.add("locked");
      const lockIcon = button.querySelector(".lock-icon");
      if (lockIcon) {
        lockIcon.style.display = "inline-block";
      }
    }
  });
};

canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;

const x = canvas.width / 2;
const y = canvas.height / 2;

const checkIfPlayerWon = () => {
  let checkGameData = localStorage.getItem("level");

  // Parse the checkGameData to an integer to compare with the levelData
  checkGameData = parseInt(checkGameData, 10);

  if (player.health > 0) {
    // Check if the current level data exists in the levelData object
    if (levelData[checkGameData]) {
      // Increment the current level if the player won the level
      const currentLevelData = levelData[checkGameData];
      const requiredKills = currentLevelData.kills;

      if (kills >= requiredKills) {
        // Unlock the next level
        const nextLevel = checkGameData + 1;
        localStorage.setItem("level", nextLevel.toString());

        // Show a message indicating that the level is finished and unlocked
        console.log(`level ${checkGameData} finished.`);
        unlockNextLevel(nextLevel); // Unlock the next level after completing the current level
      }
    } else {
      console.log("Invalid level data for the current level.");
    }
  }
};

const levelData = {
  1: {
    level: 1,
    name: "Boss",
    x: 0,
    y: 0,
    radius: 100,
    color: "red",
    velocity: { x: 0, y: 0 },
    health: 100,
    player: player,
    enemies: ["Enemy"],
    kills: 1,
    enemySpawnRate: 4000,
  },
  2: {
    level: 2,
    name: "FireBoss",
    x: 0,
    y: 0,
    radius: 100,
    color: "#800909",
    velocity: { x: 0, y: 0 },
    health: 100,
    player: player,
    enemies: ["Enemy"],
    kills: 2,
    enemySpawnRate: 3000,
  },
  3: {
    level: 3,
    name: "IceBoss",
    x: 0,
    y: 0,
    radius: 100,
    color: "#ffffff",
    velocity: { x: 0, y: 0 },
    health: 100,
    shieldHealth: 100,
    player: player,
    enemies: ["Enemy", "GunnerEnemy"],
    kills: 3,
    enemySpawnRate: 2500,
  },
  LevelSecret: {
    Boss: {
      x: 0,
      y: 0,
      radius: 50,
      color: "#800909",
      velocity: { x: 0, y: 0 },
      health: 100,
      player: player,
    },
  },
};

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
  specialMeter = 90;
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

  if (player.health <= 0) {
    // check if player is destroyed by effects
    handleEndGame();
  }

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
        boss.takeDamage();
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
          checkIfPlayerWon();
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
            specialMeter += 10;
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

const level1Button = document.getElementById("level1Button");
const level2Button = document.getElementById("level2Button");
const level3Button = document.getElementById("level3Button");

level1Button.addEventListener("click", () => {
  localStorage.setItem("level", 1);
  init(levelData[1]);
  animate();
  spawnEnemies(levelData[1]);
  spawnPowerUps();
  modalEl.style.display = "none";
});

level2Button.addEventListener("click", () => {
  // Complete level 1
  localStorage.setItem("level", 2);
  let checkPreviousLevel = localStorage.getItem("level2");
  if (checkPreviousLevel === "unlocked") {
    init(levelData[2]);
    animate();
    spawnEnemies(levelData[2]);
    spawnPowerUps();
    modalEl.style.display = "none";
  } else {
    alert("Finish level 1");
  }
});

level3Button.addEventListener("click", () => {
  // Complete level 2
  let checkPreviousLevel = localStorage.getItem("level3");
  if (checkPreviousLevel === "unlocked") {
    init(levelData[3]);
    animate();
    spawnEnemies(levelData[3]);
    spawnPowerUps();
    modalEl.style.display = "none";
  } else {
    alert("Finish level 2");
  }
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
  updateButtonStates();
});

// Call the updateButtonStates function to set the initial button states
updateButtonStates();
