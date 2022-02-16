import { Player, Particle } from './helpers/class.js'
import { spawnEnemies, spawnPowerUps, endAndStartTimer, deviceType } from './helpers/handlerFunc.js';
const backgroundMusicAudio = new Audio('../audio/rave digger.mp3')
backgroundMusicAudio.loop = true

const x = canvas.width / 2;
const y = canvas.height / 2;

// Function needed to restart game
function init() {
  isGameActive = true;
  player = new Player(x, y, 10, 'white');
  projectiles = [];
  enemies = [];
  powerUps = [];
  bosses = [];
  particles = [];
  abilities = [];
  weaponType = 'default';
  //for testing purpose value has been set to 50 from 10;
  specialMeter = +'50';
  score = 0;
  lives = 3;
  kills = 0;
  livesEl.innerHTML = lives;
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score
}



let id, id2;
function handleEndGame() {
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    isGameActive = false;
    modalEl.style.display = 'flex';
    bigScoreEl.innerHTML = score;
    healthBarContainer.style.display = 'none';
    healthBarEl.style.width = `100%`;
    clearInterval(id)
    clearInterval(id2)
  }, 1000)
}

let frame = 0
function animate() {
 animationId = requestAnimationFrame(animate)
 frame++;
  context.fillStyle = 'rgba(105, 105, 105, 0.3)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  
  if (weaponType === 'RapidFire' && mouse.down) {
    if (frame % 4 === 0) {
      player.shoot(mouse)
      console.log('auto fire')
    }
  }

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
    powerUp.update();
    const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y)
    const mobile_dist = Math.hypot(mouse.x - powerUp.x, mouse.y - powerUp.y)

    if(dist - player.radius - powerUp.width / 2 < 1) {
      if(powerUp.name === 'RapidFire') {
        weaponType = 'RapidFire';
      } else if(powerUp.name === 'Shotgun') {
        weaponType = 'Shotgun';
      }
      powerUps.splice(index, 1);
      endAndStartTimer();
      //powerUp lasts for 7 seconds // needs improvement
    } else if(mobile_dist - mouse.radius - powerUp.width / 2 < 1 && deviceType() === 'mobile') {
      if(powerUp.name === 'RapidFire') {
        weaponType = 'RapidFire';
      } else if(powerUp.name === 'Shotgun') {
        weaponType = 'Shotgun';
      }
      powerUps.splice(index, 1);
      endAndStartTimer();
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
          kills += 1;
          console.log(kills, 'kill counter')
          if(specialMeter !== 100) {
            specialMeter += +'10';
          };

          specialBarEl.style.width = `${specialMeter}%`
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
          kills += 1;
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
  // backgroundMusicAudio.play() 
  // muted for demo purposes
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  init()
})


