import { Player } from './class.js';

const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const x = canvas.width / 2;
const y = canvas.height / 2;

// window.specialMeter = +'10';
// window.weaponType = 0;
// window.kills = 0;
// window.projectiles = [];
// window.enemies = [];
// window.particles = [];
// window.bosses = [];
// window.powerUps = [];
// window.abilities = [];
// window.animationId = 0;
// window.score = 0;
// window.ives = 1;

export default {
    player: new Player(x, y, 10, 'white'),
    canvas: document.querySelector('canvas'),
    projectiles: [],
    enemies: [],
    particles: [],
    bosses: [],
    powerUps: [],
    abilities: [],
    animationId: 0,
    score: 0,
    lives: 1,
    kills: 0,
    // isDefault: true,
    // isRapidFire: false,
    // isShotgun: false,
    // specialMeter: +'10',
    specialBarEl: document.querySelector('#special'),
    modalEl: document.querySelector('#modalEl'),
    bigScoreEl: document.querySelector('#bigScoreEl'),
    livesEl: document.querySelector('#lives'),
    healthBarEl: document.querySelector('#bossHp'),
    healthBarContainer: document.querySelector('#BossContainer'),
    
};
