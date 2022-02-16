
const shootAudio = new Howl({ src: ['../audio/mixkit-short-laser-gun-shot-1670.mp3']})
const healthBarContainer = document.querySelector('.health-bar-container')



const playerPng = new Image()
playerPng.src = '../images/Jet.png';

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.width = 35
    this.height = 35
    this.radius = radius;
    this.color = color;    
    this.controls = [];
  }

  shoot(mouse) {
    shootAudio.play();
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    const angle2 = Math.atan2(mouse.y - this.y - 25, mouse.x - this.x - 25);
    const angle3 = Math.atan2(mouse.y - this.y + 25, mouse.x - this.x + 25);
    const angle4 = Math.atan2(mouse.y - this.y - 50, mouse.x - this.x - 50);
    const angle5 = Math.atan2(mouse.y - this.y + 50, mouse.x - this.x + 50);

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

    if(weaponType === 'default') {
      projectiles.push(new Projectile(this.x, this.y, 5, 'white', velocity))
    }
    if(weaponType === 'RapidFire') {
      projectiles.push(new Projectile(this.x, this.y, 5, 'blue', velocity))
    }
    if(weaponType === 'Shotgun') {
      projectiles.push(new Projectile(this.x, this.y, 5, 'red', velocity))
      projectiles.push(new Projectile(this.x, this.y, 5, 'red', velocity2))
      projectiles.push(new Projectile(this.x, this.y, 5, 'red', velocity3))
      projectiles.push(new Projectile(this.x, this.y, 5, 'red', velocity4))
      projectiles.push(new Projectile(this.x, this.y, 5, 'red', velocity5))
    }

  }
  
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()

    //<-----------code to render player as fighter jet-------->
    // context.save()
    // context.drawImage(playerPng, this.x, this.y, 50, 50)
    // context.restore()
  }
//<-----------code to rotate player image to follow cursor -------->
  // rotate(angle) {
  //   context.clearRect(canvas.width, canvas.height, this.x, this.y);
  //   context.save();
  //   context.translate(0, 0);
  //   context.rotate(-Math.PI / 2);   // correction for image starting position
  //   context.rotate(angle);
  //   context.drawImage(playerPng, this.x, this.y, 50, 50);
  //   context.restore();
  // }

  destroy() {
    // removes player from screen without having to redraw
    this.x = -100;
    this.y = -100; 
  }

  update() {
    this.draw();
  }
}

export class Projectile extends Player {
  constructor (x, y, radius, color, velocity) {
    super(x, y, radius, color)
    this.velocity = velocity;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class Enemy extends Projectile {
  constructor (x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity)
  }
  
  draw(player) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
    context.strokeStyle = 'black';
    context.stroke();

    //enemy tracking player
    let dx = player.x - this.x 
    let dy = player.y - this.y
    let theta = Math.atan2(dy, dx);
    // let nx = this.x + Math.cos(theta);
    // let ny = this.y + Math.sin(theta);
    this.x += 1 * Math.cos(theta);
    this.y += 1 * Math.sin(theta);

    // this.x += this.speed * Math.sin(this.angle);
    // this.y -= this.speed * Math.cos(this.angle);

  }

  update(player) {
    this.draw(player);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class GunnerEnemy extends Enemy {
  constructor (x, y, radius, color, velocity, player) {
    super(x, y, radius, color, velocity)
    this.projectiles = [];
    
    setInterval(() => {
      this.shoot(player);
    }, 2000) 
  }
  

  shoot(player) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    }
    this.projectiles.push(new Projectile(this.x, this.y, 5, 'yellow', velocity))
  }

  update(player) {
    this.draw(player);
    this.projectiles.forEach((projectile) => {
      projectile.update();
    })
  }
}

export class Boss extends Enemy {
  constructor (x, y, radius, color, velocity, health) {
    super(x, y, radius, color, velocity)
    this.health = health;
  }
  
  draw(player) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();

    //enemy tracking player
    let dx = player.x - this.x 
    let dy = player.y - this.y
    let theta = Math.atan2(dy, dx);
    this.x += .5 * Math.cos(theta);
    this.y += .5 * Math.sin(theta);
    healthBarContainer.style.top = `${this.y - 30}px`
    healthBarContainer.style.left = `${this.x}px`
    // console.log(this.health)
    
    //TODO - This should be 0

    if(this.health < 3) {
      healthBarContainer.style.display = 'none';
    } else {
      healthBarContainer.style.display = 'flex';
    }
    
  }
}

const frication = 0.99;
export class Particle extends Projectile{
  constructor (x, y, radius, color, velocity) {
    super(x, y, radius, color, velocity )
    this.alpha = 1;
  }
  
  draw() {
    context.save()
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
    context.restore()
  }

  update() {
    this.draw();
    this.velocity.x *= frication;
    this.velocity.y *= frication;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01
  }
}

export class Shield {
  constructor (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    
  }
  
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
  }

  update(player) {
    this.draw();
    this.x = player.x;
    this.y = player.y;
  }
}

  export class Shockwave extends Projectile {
    constructor(x, y, radius, color, velocity) {
      super(x, y, radius, color, velocity)
      this.name = 'shockwave';
    }
    draw(player) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.strokeStyle = this.color;
      context.stroke();
    }
    update(player) {
      this.draw(player);
      this.x = this.x; 
      this.y = this.y;
    }
  }

  export class IceBoss extends Boss {
    constructor (x, y, radius, color, velocity, health) {
      super(x, y, radius, color, velocity, health)
      this.particles = [];
      this.colors = ['#ffffff', '#b9e8ea', '#86d6d8', '#20c3d0', '#3fd0d4'];
    }
    
    draw(player) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill()
  
      //enemy tracking player
      let dx = player.x - this.x 
      let dy = player.y - this.y
      let theta = Math.atan2(dy, dx);
      this.x += .5 * Math.cos(theta);
      this.y += .5 * Math.sin(theta);
      healthBarContainer.style.top = `${this.y - 30}px`
      healthBarContainer.style.left = `${this.x}px`
      // console.log(color)


      for(let i = 0; i < 2.5; i++) {
        this.particles.push(new Particle(this.x, this.y, Math.random() * 2, color, {
          x: (Math.random() - 0.5) * (Math.random() * 6),
          y: (Math.random() - 0.5) * (Math.random() * 6), 
        }))
      }

      this.particles.forEach((particle, index) => {
        particle.alpha <= 0 ? this.particles.splice(index, 1) : particle.update();
      })
      // console.log(this.particles);
      
    }
  }

  export class FireBoss extends IceBoss {
    constructor (x, y, radius, color, velocity, health) {
      super(x, y, radius, color, velocity, health)
      this.colors = ['#800909', '#f07f13', '#f27d0c', '#757676', '#fdcf58'];
    }
  }


  // Give Bosses an Id;
const names = ['RapidFire', 'Shotgun'];
const powerUpImg = new Image()
powerUpImg.src = './images/lightning.png';

export class PowerUp {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 35
    this.height = 35
    this.radians = 0;
    this.name = names[Math.floor(Math.random() * names.length)]
  }

  draw() {
    context.save()
    context.translate(this.x + this.width / 2, this.y + this.height / 2)
    context.rotate(this.radians)
    context.translate(-this.x - this.width / 2, -this.y - this.height / 2)
    context.drawImage(powerUpImg, this.x, this.y, 35, 35)
    context.restore()
  }

  update() {
    this.radians += 0.05
    this.draw()
  }
}