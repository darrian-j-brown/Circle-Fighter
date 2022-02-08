import { shoot } from '../handlerFunc.js';
import { Shockwave } from '../class.js';
import globalVal from '../globalVar.js';

let { player, specialBarEl, abilities } = globalVal; 
let mouse = {x: 0 , y: 0}

let i, i2, i3;


addEventListener('mousedown', () => {
    i = setInterval(() => {
      if(window.weaponType === 0) {
        const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        shoot(angle)
      }
    }, 200);
});

addEventListener('mousedown', () => {
  i2 = setInterval(() => {
    if(window.weaponType === 2) {
      const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
      shoot(angle)
    }
  }, 75);
});

addEventListener('mousedown', () => {
  i3 = setInterval(() => {
    if(window.weaponType === 3) {
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

addEventListener('keydown', function (e) {
    e.preventDefault();
    player.controls = (player.controls || []);
    player.controls[e.keyCode] = true;
    if(e.keyCode === 82 && window.specialMeter === 100) {
      abilities.push(new Shockwave(player.x, player.y, 10, 'white'));
      window.specialMeter = +'0';
      specialBarEl.style.width = `${window.specialMeter}%`
      // console.log(window.specialMeter);
    }
  })
  
  addEventListener('keyup', function (e) {
    e.preventDefault();
    player.controls[e.keyCode] = false;
  })
