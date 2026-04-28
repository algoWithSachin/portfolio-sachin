
// ── Custom cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});
function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; cursor.style.marginLeft = '-4px'; cursor.style.marginTop = '-4px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; cursor.style.marginLeft = '0'; cursor.style.marginTop = '0'; });
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ── Typing animation for hero ──
const typed = document.getElementById('typedName');
const words = ['Name.', 'Developer.', 'Builder.', 'Engineer.'];
let wi = 0, ci = 0, deleting = false;
function typeLoop() {
    const word = words[wi];
    const cursor2 = typed.querySelector('.type-cursor');
    if (!deleting) {
        typed.childNodes[0] && (typed.childNodes[0].textContent = word.slice(0, ++ci));
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
        typed.childNodes[0] && (typed.childNodes[0].textContent = word.slice(0, --ci));
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(typeLoop, deleting ? 60 : 110);
}
// init text node before cursor span
const textNode = document.createTextNode('');
typed.insertBefore(textNode, typed.querySelector('.type-cursor'));
setTimeout(typeLoop, 1400);

// ── Particle canvas ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5 ? '232,255,71' : '71,255,184';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}
for (let i = 0; i < 60; i++) particles.push(new Particle());
function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // draw connections
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 80) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(232,255,71,${0.04 * (1 - d / 80)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animParticles);
}
animParticles();

// ── Ripple on buttons ──
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-resume').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const r = document.createElement('span');
        r.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        this.appendChild(r);
        setTimeout(() => r.remove(), 600);
    });
});

// ── Resume download ──
function openResume() {
  const btn = document.getElementById('resumeBtn');
  btn.classList.add('downloading');
  btn.querySelector('span:last-child').textContent = 'Opening...';

  setTimeout(() => {
    btn.classList.remove('downloading');
    btn.querySelector('span:last-child').textContent = 'Resume';
  }, 800);
}

// ── Reveal on scroll (staggered for cards) ──
const revealEls = document.querySelectorAll('.reveal');
const cards = document.querySelectorAll('.skill-card, .project-card');

const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// Staggered card animation
const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const siblings = [...e.target.parentElement.children];
            const idx = siblings.indexOf(e.target);
            setTimeout(() => {
                e.target.classList.add('visible');
                // animate skill bar if present
                const bar = e.target.querySelector('.skill-bar');
                if (bar) bar.style.width = bar.dataset.width + '%';
            }, idx * 100);
            cardObs.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
cards.forEach(c => cardObs.observe(c));
