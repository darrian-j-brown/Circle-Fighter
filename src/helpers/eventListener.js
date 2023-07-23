import { Shockwave, Shield } from "../classes/PowerUps.js";
const shootAudio = new Howl({
  src: ["../audio/mixkit-space-plasma-shot-3002.mp3"],
});

let i, i2, i3;

addEventListener("click", () => {
  if (weaponType !== 100 && isGameActive) {
    player.shoot(mouse, "default");
  }
});

addEventListener("touchstart", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
  player.shoot(mouse);
  mouse.down = true;
});

addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

addEventListener("touchend", () => {
  mouse.down = false;
});

addEventListener("mousedown", () => {
  mouse.down = true;
});

addEventListener("mouseup", () => {
  mouse.down = false;
});

// addEventListener('mousemove', (event) => [mouse.x, mouse.y] = [event.clientX, event.clientY])
addEventListener("mousemove", (event) => {
  [mouse.x, mouse.y] = [event.clientX, event.clientY];

  // var theta = Math.atan2(mouse.y, mouse.x);
  // player.rotate(theta);
});

addEventListener("mouseup", () => clearInterval(i));
addEventListener("mouseup", () => clearInterval(i2));
addEventListener("mouseup", () => clearInterval(i3));

addEventListener("keydown", function (e) {
  e.preventDefault();
  player.controls = player.controls || [];
  player.controls[e.keyCode] = true;
  if (e.keyCode === 82 && specialMeter === 100) {
    abilities.push(new Shockwave(player.x, player.y, 10, "white"));
    shootAudio.play();
    specialMeter = +"0";
    specialBarEl.style.width = `${specialMeter}%`;
  }
});

addEventListener("keyup", function (e) {
  e.preventDefault();
  player.controls[e.keyCode] = false;
});

//prevents right click
addEventListener("contextmenu", (event) => event.preventDefault());
