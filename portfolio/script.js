/* ════════════════════════════════════════════
   MANTHAN GUJAR PORTFOLIO — script.js
   ════════════════════════════════════════════ */

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('out'), 2000);
});

/* ── Cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function loopCursor() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(loopCursor);
})();
document.querySelectorAll('a,button,.cert-card,.work-row,.work-featured,.about-tag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});

/* ── Header scroll ── */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  // active nav
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

/* ── Burger ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* ── Film grain canvas ── */
(function grain() {
  const c = document.getElementById('grain-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;
  const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  let t = 0;
  (function draw() {
    const img = ctx.createImageData(W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 * 0.12;
      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    t++;
    requestAnimationFrame(draw);
  })();
})();

/* ── Scroll reveal ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('in'), +delay);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

const revSelectors = [
  '.section-heading', '.about-photo-wrap', '.about-tags-col', '.about-body',
  '.about-stats-row', '.about-links-row', '.work-featured', '.work-row',
  '.skills-tags', '.edu-row', '.cert-card', '.contact-left', '.contact-right',
  '.skills-intro', '.tier-label', '.edu-block'
];
revSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.setAttribute('data-rev', '');
    el.setAttribute('data-delay', i * 50);
    revObs.observe(el);
  });
});

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 68, behavior: 'smooth' });
  });
});

/* ── Copy email ── */
const copyEmail = document.getElementById('copyEmail');
const toast     = document.getElementById('copy-toast');
if (copyEmail) {
  copyEmail.addEventListener('click', () => {
    navigator.clipboard.writeText('manthangujarofficial10@gmail.com').catch(() => {});
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  });
}

/* ── Lightbox ── */
function openLightbox(src, title) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').src = src;
  document.getElementById('lbTitle').textContent = title || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Contact form ── */
const form = document.getElementById('contactForm');
const note = document.getElementById('cfNote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const msg   = form.querySelector('#cf-msg').value.trim();
    if (!name || !email || !msg) {
      note.style.color = '#c94c4c'; note.textContent = '// FILL ALL FIELDS'; return;
    }
    note.style.color = '#4caf50';
    note.textContent = `// MESSAGE RECEIVED, ${name.toUpperCase()}. TALK SOON.`;
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  });
}

/* ── Work row tilt ── */
document.querySelectorAll('.work-row, .cert-card').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 4;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 4;
    el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ════════════════════════════════════════════
   ABOUT TEXT — WORD-BY-WORD REVEAL
   ════════════════════════════════════════════ */
(function initWordReveal() {

  function wrapWords(paragraph) {
    // Walk child nodes to preserve <strong> tags
    const nodes = Array.from(paragraph.childNodes);
    paragraph.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split plain text by spaces
        const words = node.textContent.split(/(\s+)/);
        words.forEach(chunk => {
          if (/^\s+$/.test(chunk) || chunk === '') {
            // It's whitespace — just append as text
            paragraph.appendChild(document.createTextNode(' '));
          } else {
            const wrap  = document.createElement('span');
            const inner = document.createElement('span');
            wrap.className  = 'word-wrap';
            inner.className = 'word-inner';
            inner.textContent = chunk;
            wrap.appendChild(inner);
            paragraph.appendChild(wrap);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // It's a <strong> or similar — wrap the whole thing
        const words = node.textContent.split(/(\s+)/);
        words.forEach(chunk => {
          if (/^\s+$/.test(chunk) || chunk === '') {
            paragraph.appendChild(document.createTextNode(' '));
          } else {
            const wrap   = document.createElement('span');
            const inner  = document.createElement('span');
            const strong = document.createElement(node.tagName);
            wrap.className  = 'word-wrap';
            inner.className = 'word-inner';
            strong.textContent = chunk;
            inner.appendChild(strong);
            wrap.appendChild(inner);
            paragraph.appendChild(wrap);
          }
        });
      }
    });
  }

  // Process all word-reveal paragraphs
  document.querySelectorAll('p.word-reveal').forEach(p => wrapWords(p));

  // Observe each paragraph — trigger words with stagger
  const paragraphObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const inners = entry.target.querySelectorAll('.word-inner');
      inners.forEach((word, i) => {
        setTimeout(() => {
          word.classList.add('visible');
        }, i * 35); // 35ms stagger per word = smooth wave
      });

      paragraphObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('p.word-reveal').forEach(p => paragraphObs.observe(p));

})();

/* ── Achievement counters ── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.ach-count').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 35);
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

const achCounters = document.querySelector('.ach-counters');
if (achCounters) counterObs.observe(achCounters);

/* ── Milestones counters ── */
const msObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.ms-num').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 35);
    });
    msObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const msSection = document.querySelector('.milestones-section');
if (msSection) msObs.observe(msSection);

/* ── Cert section counters ── */
const ccObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.cc-num').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 35);
    });
    ccObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const ccSection = document.querySelector('.cert-counters');
if (ccSection) ccObs.observe(ccSection);
