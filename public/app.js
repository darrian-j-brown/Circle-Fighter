import { Player, Projectile, Enemy, Boss, FireBoss, Particle, Shield, RapidFire, Shotgun, Shockwave, GunnerEnemy } from '../class.js'
import globalVal from '../globalVar.js';
import { spawnEnemies, spawnPowerUps } from '../handlerFunc.js';

let { canvas, player, projectiles, enemies, particles, bosses, powerUps, abilities, score, lives, specialBarEl, animationId, weaponType } = globalVal;

// const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const livesEl = document.querySelector('#lives');
const healthBarEl = document.querySelector('#bossHp')
// const specialBarEl = document.querySelector('#special')
const healthBarContainer = document.querySelector('#BossContainer');

const context = canvas.getContext('2d');

const x = canvas.width / 2;
const y = canvas.height / 2;

window.specialMeter = +'10';
window.weaponType = 0;
window.kills = 0;


// Function needed to restart game
function init() {
  // player = new Player(x, y, 10, 'white');
  // projectiles = [];
  // enemies = [];
  // powerUps = [];
  // bosses = [];
  // particles = [];
  // abilities = [];
  // specialMeter = +'10';
  // score = 0;
  // lives = 3;
  // kills = 0;
  livesEl.innerHTML = lives;
  scoreEl.innerHTML = score
  // bigScoreEl.innerHTML = score
}
let id, id2;
function handleEndGame() {
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    modalEl.style.display = 'flex';
    bigScoreEl.innerHTML = score;
    // window.removeEventListener('mousedown', () => {});
    healthBarContainer.style.display = 'none';
    healthBarEl.style.width = `100%`;
    clearInterval(id)
    clearInterval(id2)
  }, 1000)
}

function animate() {
 animationId = requestAnimationFrame(animate)
  context.fillStyle = 'rgba(105, 105, 105, 0.3)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    particle.alpha <= 0 ? particles.splice(index, 1) : particle.update();
  })
  projectiles.forEach((projectile, index) => {
    projectile.update();

    //remove from edges of screen
    if(
      projectile.x - projectile.radius < 0 || 
      projectile.x - projectile.radius > canvas.width || 
      projectile.y + projectile.radius < 0 || 
      projectile.y - projectile.radius > canvas.height
      ) {
      setTimeout(() => projectiles.splice(index, 1), 0)
    }
  })

  

  bosses.forEach((boss, index) => {
    boss.update(player);
    const bossDist = Math.hypot(player.x - boss.x, player.y - boss.y)
    if(bossDist - boss.radius - player.radius < 1) {
      lives -= lives;
      livesEl.innerHTML = lives;
      
      //end game
      if(lives === 0) {
        
        for(let i = 0; i < 60 * 2; i++) {
          particles.push(new Particle(player.x, player.y, Math.random() * 2, player.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6), 
          }))
        }
        player.destroy();
        handleEndGame();
      }
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const bossDist = Math.hypot(projectile.x - boss.x, projectile.y - boss.y)

      //when projectile touch boss
      if(bossDist - boss.radius - projectile.radius < 1) {
        //create explosions
        for(let i = 0; i < 10 * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, boss.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6), 
          }))
        }
  
        if(boss.health - 1 > 1) {
          //increase our score 
          boss.health -= 1;
          healthBarEl.style.width = `${boss.health}%`
          score += 100;
          scoreEl.innerHTML = score;
  
          gsap.to(boss, {
            radius: boss.radius - .5
          })
          
          setTimeout(() => projectiles.splice(projectileIndex, 1), 0);
        } else {
          setTimeout(() => {
            bosses.splice(index, 1);
            healthBarEl.style.width = `${100}%`
            projectiles.splice(projectileIndex, 1);
          }, 0)
          handleEndGame();
        }
      }
    })
  })

  powerUps.forEach((powerUp, index) => {
    powerUp.draw(player)
    const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y)

    if(dist - powerUp.radius - player.radius < 1) {
      console.log(window.weaponType, 'og')
      if(powerUp.name === 'Rapid Fire') {
        window.weaponType = 2;
      } else if(powerUp.name === 'Shotgun') {
        window.weaponType = 3;
      }
      powerUps.splice(index, 1);
      let t = setTimeout(() => {
        window.weaponType = 0;
        // console.log('false')
        return () => {
          clearTimeout(t)
        }
      }, 10000)
    }
  })
  
  // TODO - refactor boss code
  
  enemies.forEach((enemy, index) => {
    enemy.update(player);

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    // checks for enemy and player touch
    if(dist - enemy.radius - player.radius < 1) {
      // removes life from player
      lives -= 1;
      livesEl.innerHTML = lives;
      
      //end game
      if(lives === 0) {
        
        for(let i = 0; i < 60 * 2; i++) {
          particles.push(new Particle(player.x, player.y, Math.random() * 2, player.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6), 
          }))
        }
        player.destroy();
        handleEndGame();
      }

      //Enemy blowup when touching player 
      enemies.splice(index, 1);
      for(let i = 0; i < enemy.radius * 2; i++) {
        particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
          x: (Math.random() - 0.5) * (Math.random() * 6),
          y: (Math.random() - 0.5) * (Math.random() * 6), 
        }))
      }
    }
    if(enemy.projectiles) {
      enemy.projectiles.forEach((enemyProjectile, enemyProjectileIndex) => {
        const dist = Math.hypot(enemyProjectile.x - player.x, enemyProjectile.y - player.y)
        if(dist - player.radius - enemyProjectile.radius < 1) {
  
          for(let i = 0; i < player.radius * 2; i++) {
            particles.push(new Particle(enemyProjectile.x, enemyProjectile.y, Math.random() * 2, player.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6), 
            }))
          }
          setTimeout(() => enemy.projectiles.splice(enemyProjectileIndex, 1), 0);
  
          lives -= 1;
          livesEl.innerHTML = lives;
  
          if(lives === 0) {
          
            for(let i = 0; i < 60 * 2; i++) {
              particles.push(new Particle(player.x, player.y, Math.random() * 2, player.color, {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6), 
              }))
            }
            player.destroy();
            handleEndGame();
          }
        }
      })
    }
    

    projectiles.forEach((projectile, projectileIndex) => {
      
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
      
      //when projectile touch enemy
      if(dist - enemy.radius - projectile.radius < 1) {

        //create explosions
        for(let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6), 
          }))
        }

        if(enemy.radius - 10 > 5) {
          //increase our score 
          score += 100;
          scoreEl.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => projectiles.splice(projectileIndex, 1), 0);
        } else {
          // remove from scene altogether
          window.kills += 1;
          if(window.specialMeter !== 100) {
            window.specialMeter += +'10';
          };

          specialBarEl.style.width = `${window.specialMeter}%`
          // console.log(specialMeter)
          score += 100;
          scoreEl.innerHTML = score;

          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0)
        }
      }
    })
  })
  abilities.forEach((ability, abilityIndex) => {
    ability.update();
    gsap.to(ability, {
      radius: ability.radius + 175
    })
    if(ability.radius >= canvas.width && ability.radius >= canvas.height) {
      // console.log(ability.radius)
      abilities.splice(abilityIndex, 1);
    }

    enemies.forEach((enemy, index) => {
      const Abilitydist = Math.hypot(ability.x - enemy.x, ability.y - enemy.y);
      if(Abilitydist - enemy.radius - ability.radius < 1) {
          window.kills += 1;
          score += 500;
          scoreEl.innerHTML = score;

          setTimeout(() => {
            enemies.splice(index, 1);
          }, 0)
          for(let i = 0; i < enemy.radius; i++) {
            particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6), 
            }))
          }
        }
     })
  })

    if (player.controls && player.controls[87]) {player.y -= 5; }
    if (player.controls && player.controls[65]) {player.x -= 5; }
    if (player.controls && player.controls[83]) {player.y += 5; }
    if (player.controls && player.controls[68]) {player.x += 5; }
}

startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  modalEl.style.display = 'none';
})



