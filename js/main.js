/**
 * main.js — $SOR Strategic Oil Reserve
 * Handles: navbar, mobile menu, copy-CA, tokenomics chart, scroll-reveal
 */

/* ================================================================
   TODO: Replace with your real contract address when deployed
   ================================================================ */
const CONTRACT_ADDRESS = 'EXo5MY6yVK5PnSS5PFCUZWWoxpz3sL9H9XtrAmjAGQ2j';

/* ================================================================
   Tokenomics — edit percentages and labels here
   ================================================================ */
const TOKENOMICS = [
  { label: 'Transaction Reserve Fund', pct: 60, color: '#c0392b' },
  { label: 'Liquidity Pool',           pct: 25, color: '#e74c3c' },
  { label: 'Development & Operations',  pct: 15, color: '#4b4b4b' },
];
/* ================================================================ */


document.addEventListener('DOMContentLoaded', () => {

  // ── Sync all CA address elements ───────────────────────────────
  document.querySelectorAll('.ca-address').forEach(el => {
    el.textContent = CONTRACT_ADDRESS;
  });


  // ── Copy-CA buttons ────────────────────────────────────────────
  function setupCopyBtn(btnId, feedbackId) {
    const btn = document.getElementById(btnId);
    const feedback = feedbackId ? document.getElementById(feedbackId) : null;
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = CONTRACT_ADDRESS;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.textContent = 'Copied';
      if (feedback) {
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2200);
      }
      setTimeout(() => { btn.textContent = 'Copy'; }, 2200);
    });
  }

  setupCopyBtn('caCopy',  'caCopied');
  setupCopyBtn('caCopy2', null);
  setupCopyBtn('caCopy3', null);


  // ── Navbar scroll + active link ────────────────────────────────
  const navbar   = document.getElementById('navbar');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ── Mobile hamburger ───────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ── Tokenomics chart ───────────────────────────────────────────
  const chartCanvas = document.getElementById('tokenomicsChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels:   TOKENOMICS.map(t => t.label),
        datasets: [{
          data:             TOKENOMICS.map(t => t.pct),
          backgroundColor:  TOKENOMICS.map(t => t.color),
          borderColor:      '#040404',
          borderWidth:      4,
        }],
      },
      options: {
        cutout:    '72%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
            bodyFont:    { family: "'Inter', sans-serif", size: 13 },
            titleFont:   { family: "'Bebas Neue', sans-serif", size: 14 },
            backgroundColor: '#0e0e0e',
            borderColor:     '#1e1e1e',
            borderWidth:     1,
            padding:         14,
          },
        },
        animation: { animateRotate: true, duration: 1200 },
      },
    });
  }

  // Legend
  const legendEl = document.getElementById('tokenLegend');
  if (legendEl) {
    TOKENOMICS.forEach(t => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <span class="legend-dot" style="background:${t.color}"></span>
        <span class="legend-label">${t.label}</span>
        <span class="legend-pct">${t.pct}%</span>
      `;
      legendEl.appendChild(item);
    });
  }


  // ── Scroll-reveal ──────────────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.card, .step-card, .timeline-item, .social-card, ' +
    '.section-title, .section-sub, .stats-row, .stat-item, .tokenomics-wrap'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    entries => entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        io.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );
  revealTargets.forEach(el => io.observe(el));

});
