import { Player, Projectile, Enemy, Boss, Particle, Shield, RapidFire, Shotgun, Shockwave } from '../class.js'
const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const livesEl = document.querySelector('#lives');
const healthBarEl = document.querySelector('#bossHp')
const specialBarEl = document.querySelector('#special')
const healthBarContainer = document.querySelector('#BossContainer');

const context = canvas.getContext('2d');

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];
let bosses = [];
let powerUps = []
let abilities = []
let kills = 0;
let specialMeter = +'10';
let mouse = {x: 0 , y: 0}
let isDefault = true;
let isRapidFire = false;
let isShotgun = false;

function init() {
  player = new Player(x, y, 10, 'white');
  projectiles = [];
  enemies = [];
  powerUps = [];
  bosses = [];
  particles = [];
  abilities = [];
  specialMeter = +'10';
  score = 0;
  lives = 3;
  kills = 0;
  livesEl.innerHTML = lives;
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score
}

function handleEndGame() {
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    modalEl.style.display = 'flex';
    bigScoreEl.innerHTML = score;
    // window.removeEventListener('mousedown', () => {});
    clearInterval(id)
    clearInterval(id2)
  }, 1000)
}

  let id, id2;
function spawnEnemies() {
  id = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    // console.log('radius', radius)
    let x;
    let y;

    if(Math.random() < 0.5) {
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
      y: Math.sin(angle)
    }

    if(kills >= 30 && bosses.length === 0) {
      let health = 100
      enemies = [];
      bosses.push(new Boss(0, 0, 50, 'red', {x: 0, y: 0}, health));
      clearInterval(id)
      // console.log('cleared')   
    } else {
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }
  }, 1000);
  }

  function spawnPowerUps() {
    id2 = setInterval(() => {
      const color = `white`;
      const weaponType = [new Shotgun(Math.random() * canvas.width, Math.random() * canvas.height, 10, color), new RapidFire(Math.random() * canvas.width, Math.random() * canvas.height, 10, color)]
      const weapon = weaponType[Math.floor(Math.random() * weaponType.length)];
        powerUps.push(weapon);      
    }, 10000);
    }
  
let animationId;
let score = 0;
let lives;
function animate() {
 animationId = requestAnimationFrame(animate)
  context.fillStyle = 'rgba(0, 0, 0, 0.3)';
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
      if(powerUp.name === 'Rapid Fire') {
        isRapidFire = true;
        isDefault = false;
        isShotgun = false;
      } else if(powerUp.name === 'Shotgun') {
        isShotgun = true;
        isDefault = false;
        isRapidFire = false;
      }
      powerUps.splice(index, 1);
      let t = setTimeout(() => {
        isRapidFire = false;
        isShotgun = false;
        isDefault = true;
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
}



function shoot(angle, angle2, angle3, angle4, angle5) {
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  const velocity2 = {
    x: Math.cos(angle2) * 5,
    y: Math.sin(angle2) * 5
  }
  const velocity3 = {
    x: Math.cos(angle3) * 5,
    y: Math.sin(angle3) * 5
  }
  const velocity4 = {
    x: Math.cos(angle4) * 5,
    y: Math.sin(angle4) * 5
  }
  const velocity5 = {
    x: Math.cos(angle5) * 5,
    y: Math.sin(angle5) * 5
  }
  projectiles.push(
    new Projectile(player.x, player.y, 5, 'white', velocity2), 
    new Projectile(player.x, player.y, 5, 'white', velocity), 
    new Projectile(player.x, player.y, 5, 'white', velocity3),
    new Projectile(player.x, player.y, 5, 'white', velocity4),
    new Projectile(player.x, player.y, 5, 'white', velocity5),
    );
}

// addEventListener('click', (event) => {
//   const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
//   const angle2 = Math.atan2(event.clientY - player.y - 25, event.clientX - player.x - 25);
//   const angle3 = Math.atan2(event.clientY - player.y + 25, event.clientX - player.x + 25);
//     shoot(angle, angle2, angle3)
// });

let i, i2, i3;
addEventListener('mousedown', () => {
    i = setInterval(() => {
      if(isDefault) {
        const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        shoot(angle)
        // console.log(specialMeter);
      }
    }, 200);
});

addEventListener('mousedown', () => {
  i2 = setInterval(() => {
    if(isRapidFire) {
      const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
      shoot(angle)
    }
  }, 75);
});

addEventListener('mousedown', () => {
  i3 = setInterval(() => {
    if(isShotgun) {
      const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
      const angle2 = Math.atan2(mouse.y - player.y - 25, mouse.x - player.x - 25);
      const angle3 = Math.atan2(mouse.y - player.y + 25, mouse.x - player.x + 25);
      const angle4 = Math.atan2(mouse.y - player.y - 50, mouse.x - player.x - 50);
      const angle5 = Math.atan2(mouse.y - player.y + 50, mouse.x - player.x + 50);

      shoot(angle, angle2, angle3, angle4, angle5)
    }
  }, 700);
});

addEventListener('mousemove', (event) => [mouse.x, mouse.y] = [event.clientX, event.clientY])

addEventListener('mouseup', () => clearInterval(i));
addEventListener('mouseup', () => clearInterval(i2));
addEventListener('mouseup', () => clearInterval(i3));

startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  modalEl.style.display = 'none';
})

addEventListener('keydown', function (e) {
  player.controls = (player.controls || []);
  player.controls[e.keyCode] = true;
  if(e.keyCode === 82 && specialMeter === 100) {
    abilities.push(new Shockwave(player.x, player.y, 10, 'white'));
    specialMeter = +'0';
    specialBarEl.style.width = `${specialMeter}%`
    // console.log(specialMeter);
  }
  player.update();
})

addEventListener('keyup', function (e) {
  player.controls[e.keyCode] = false;
  player.update();
})


