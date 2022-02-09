import globalVal from '../globalVar.js';
import { Projectile, Enemy, GunnerEnemy, Shotgun, RapidFire, Boss, IceBoss } from '../class.js'


let { canvas, player, projectiles, enemies, powerUps, bosses } = globalVal; 
let id, id2;

export function shoot(angle, angle2, angle3, angle4, angle5) {
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
      new Projectile(player.x, player.y, 5, 'white', velocity), 
      new Projectile(player.x, player.y, 5, 'white', velocity2), 
      new Projectile(player.x, player.y, 5, 'white', velocity3),
      new Projectile(player.x, player.y, 5, 'white', velocity4),
      new Projectile(player.x, player.y, 5, 'white', velocity5),
      );
  }

  export function shoot2(angle) {
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity))
  }

  // export function handleEndGame() {
  //   console.log(animationId,'log')
  //   setTimeout(() => {
  //     cancelAnimationFrame(animationId);
  //     modalEl.style.display = 'flex';
  //     bigScoreEl.innerHTML = score;
  //     // window.removeEventListener('mousedown', () => {});
  //     healthBarContainer.style.display = 'none';
  //     healthBarEl.style.width = `100%`;
  //     clearInterval(id)
  //     clearInterval(id2)
  //   }, 1000)
  // }
  
  export function spawnEnemies() {
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
  
      if(window.kills >= 1 && bosses.length === 0) {
        console.log('bosses time')
        let health = 100
        enemies = [];
        bosses.push(new Boss(0, 0, 50, 'red', {x: 0, y: 0}, health));
        clearInterval(id) 
      } else {
        let enemyType = [new Enemy(x, y, radius, color, velocity), new GunnerEnemy(x, y, radius, color, velocity, player)];
        const enemy = enemyType[Math.floor(Math.random() * enemyType.length)];
        enemies.push(enemy);
      }
    }, 100000000);
    }
  
    export function spawnPowerUps() {
      id2 = setInterval(() => {
        const color = `white`;
        const weaponType = [new Shotgun(Math.random() * canvas.width, Math.random() * canvas.height, 10, color), new RapidFire(Math.random() * canvas.width, Math.random() * canvas.height, 10, color)]
        const weapon = weaponType[Math.floor(Math.random() * weaponType.length)];
          powerUps.push(weapon);      
      }, 1000);
      }