const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const healthBarContainer = document.querySelector('.health-bar-container')

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;    
    this.controls = [];
  }
  
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
  }

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

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

export class Enemy extends Projectile{
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

export class Boss extends Enemy {
  constructor (x, y, radius, color, velocity, health) {
    super(x, y, radius, color, velocity)
    this.health = health;
  }
  
  draw(player) {
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

export class RapidFire extends Projectile {
  constructor (x, y, radius, color) {
    super(x, y, radius, color)
    this.name = 'Rapid Fire';
  }
  
  draw(player) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = this.color;
    context.stroke();
    context.font = "17px Arial";
    context.fillStyle = "white";
    context.textAlign = 'center';
    context.fillText(this.name, this.x, this.y);
  }

  update(player) {
    this.draw(player);
    this.x = this.x;
    this.y = this.y;
  }

}

  export class Shotgun extends RapidFire {
    constructor(x, y, radius, color) {
      super(x, y, radius, color)
      this.name = 'Shotgun';
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