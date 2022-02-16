import { Projectile, Enemy, GunnerEnemy, Boss, IceBoss, PowerUp } from './class.js'

let id, id2;

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
  
      if(window.kills >= 10 && bosses.length === 0) {
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
    }, 3000000);
    }
  
  export function spawnPowerUps() {
    id2 = setInterval(() => {
      const color = `white`;
      const weapon = new PowerUp(Math.random() * canvas.width, Math.random() * canvas.height, 10, color)
        powerUps.push(weapon);      
    }, 3000);
    }
    
  var timer;
  export function endAndStartTimer() {
  window.clearTimeout(timer);
  var waitTime = 3000; 
  timer = window.setTimeout(function() {
    weaponType = "default";
  }, waitTime); 
}