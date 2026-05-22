/* ============================================================
   MossionX — Scripts Principais
   ============================================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  const bar = document.getElementById('loaderBar');
  bar.style.width = '100%';
  setTimeout(() => { document.getElementById('loader').classList.add('done'); }, 2000);
});

/* ── CURSOR CUSTOMIZADO ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * .14;
  ry += (my - ry) * .14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform  = 'translate(-50%,-50%) scale(1.9)';
    ring.style.borderColor = 'rgba(201,168,76,.85)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = 'rgba(201,168,76,.45)';
  });
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HERO CANVAS (partículas) ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 1.8 + .2;
      this.vx    = (Math.random() - .5) * .28;
      this.vy    = (Math.random() - .5) * .28;
      this.alpha = Math.random() * .45 + .08;
      this.gold  = Math.random() > .65;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(201,168,76,${this.alpha})`
        : `rgba(255,255,255,${this.alpha * .35})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 200; i++) particles.push(new P());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const grd = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .7);
    grd.addColorStop(0, 'rgba(201,168,76,0.03)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 110) * .07})`;
          ctx.lineWidth   = .3;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── CTA CANVAS (anéis pulsantes) ── */
(function () {
  const canvas = document.getElementById('cta-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += .007;
    for (let i = 0; i < 6; i++) {
      const r   = 180 + i * 90 + Math.sin(t + i * 1.3) * (40 + i * 12);
      const grd = ctx.createRadialGradient(W / 2, H / 2, r * .25, W / 2, H / 2, r);
      grd.addColorStop(0,   'transparent');
      grd.addColorStop(.75, 'transparent');
      grd.addColorStop(.88, `rgba(201,168,76,${0.04 - i * .005})`);
      grd.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal, .reveal-left, .manifesto-line');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
reveals.forEach(el => obs.observe(el));

/* ── CONTADOR DE STATS ── */
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const inc    = target / 70;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 22);

    statObs.unobserve(el);
    el.closest('.stat-item').classList.add('visible');
  });
}, { threshold: .5 });
statNums.forEach(el => statObs.observe(el));
