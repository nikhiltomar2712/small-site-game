// Simple Click the Circle game
const playArea = document.getElementById('play-area');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const highEl = document.getElementById('highscore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let score = 0;
let timeLeft = 30;
let timer = null;
let spawnInterval = null;
let running = false;

const HIGH_KEY = 'click-circle-highscore-v1';

function readHigh() {
  const v = localStorage.getItem(HIGH_KEY);
  return v ? Number(v) : 0;
}

function writeHigh(v) {
  try { localStorage.setItem(HIGH_KEY, String(v)); } catch (e) { /* ignore */ }
}

function updateHUD() {
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  highEl.textContent = readHigh();
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function spawnCircle() {
  const rect = playArea.getBoundingClientRect();
  const size = rand(36, 72);
  const x = rand(0, Math.max(0, rect.width - size));
  const y = rand(0, Math.max(0, rect.height - size));
  const el = document.createElement('button');
  el.className = 'circle';
  el.style.width = el.style.height = size + 'px';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.setAttribute('aria-label', 'circle');
  el.textContent = '+' + Math.floor(size/10);
  el.addEventListener('click', () => {
    // small pop animation
    el.style.transform = 'scale(0.88)';
    setTimeout(() => el.remove(), 120);
    score += Math.floor(size/10);
    updateHUD();
  });
  // remove after a short time to keep play area clean
  setTimeout(() => el.remove(), 1800);
  playArea.appendChild(el);
}

function tick() {
  timeLeft -= 1;
  updateHUD();
  if (timeLeft <= 0) {
    stopGame();
  }
}

function startGame() {
  if (running) return;
  running = true;
  score = 0;
  timeLeft = 30;
  updateHUD();
  // spawn faster as time goes
  spawnInterval = setInterval(() => {
    spawnCircle();
    // small chance to spawn extra
    if (Math.random() < 0.25) spawnCircle();
  }, 700);
  timer = setInterval(tick, 1000);
}

function stopGame() {
  running = false;
  clearInterval(timer);
  clearInterval(spawnInterval);
  timer = spawnInterval = null;
  const high = readHigh();
  if (score > high) {
    writeHigh(score);
    updateHUD();
    alert('New high score! ' + score);
  } else {
    alert('Time up! Score: ' + score);
  }
  // clear circles
  playArea.querySelectorAll('.circle').forEach(n => n.remove());
}

startBtn.addEventListener('click', () => startGame());
resetBtn.addEventListener('click', () => {
  writeHigh(0);
  updateHUD();
});

// initialize hud
updateHUD();

// basic keyboard accessibility: space to start
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !running) {
    startGame();
    e.preventDefault();
  }
});
