import { Player, Projectile, Enemy, Boss, Particle } from './class.js'
const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const livesEl = document.querySelector('#lives');
const healthBarEl = document.querySelector('#test')

const context = canvas.getContext('2d');

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];
let bosses = [];
let kills = 0;
let mouse = {x: 0 , y: 0}

function init() {
  player = new Player(x, y, 10, 'white');
  projectiles = [];
  enemies = [];
  bosses = [];
  particles = [];
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
  }, 1000)
}

  let id;
function spawnEnemies() {
  id = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
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

    if(kills === 1) {
      let health = 100
      enemies = [];
      bosses.push(new Boss(0, 0, 100, 'red', {x: 0, y: 0}, health));
      clearInterval(id)   
    } else {
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }
  }, 1000);
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
          boss.health -= 10;
          healthBarEl.style.width = `${boss.health}%`
          console.log(healthBarEl.style.width);
          score += 100;
          scoreEl.innerHTML = score;
  
          gsap.to(boss, {
            radius: boss.radius - 10
          })
          
          setTimeout(() => projectiles.splice(projectileIndex, 1), 0);
        } else {
          setTimeout(() => {
            bosses.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0)
          handleEndGame();
        }
      }
    })
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
}

function shoot(angle) {
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
}

addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    shoot(angle)
});

let i;
addEventListener('mousedown', () => {
  i = setInterval(() => {
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    shoot(angle)
  }, 100);
});

addEventListener('mousemove', (event) => [mouse.x, mouse.y] = [event.clientX, event.clientY])

addEventListener('mouseup', () => clearInterval(i));

startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = 'none';
})

addEventListener('keydown', function (e) {
  player.controls = (player.controls || []);
  player.controls[e.keyCode] = true;
  player.update();
})
addEventListener('keyup', function (e) {
  player.controls[e.keyCode] = false;
  player.update();
})


