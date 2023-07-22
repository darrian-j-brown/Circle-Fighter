import { Player } from "../components/player.js";

window.weaponType = "default";
window.canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const x = canvas.width / 2;
const y = canvas.height / 2;
window.context = canvas.getContext("2d");
//for testing purpose value has been set to 50 from 10;
window.specialMeter = +"50";
window.player = new Player(x, y, 10, "white");
window.projectiles = [];
window.enemies = [];
window.particles = [];
window.bosses = [];
window.powerUps = [];
window.abilities = [];
window.kills = 0;
window.lives = 1;
window.score = 0;
window.animationId = 0;
window.isGameActive = false;
window.mouse = { x: 0, y: 0, down: false, radius: 10 };
window.specialBarEl = document.querySelector("#special");
window.modalEl = document.querySelector("#modalEl");
window.bigScoreEl = document.querySelector("#bigScoreEl");
window.healthBarContainer = document.querySelector("#BossContainer");
window.healthBarEl = document.querySelector("#bossHp");
window.livesEl = document.querySelector("#lives");
window.killsEL = document.querySelector("#kills");
