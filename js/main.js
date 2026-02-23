/* ══════════════════════════════════════════
   PREMIUM REAL ESTATE NZ · V6 · main.js
   ══════════════════════════════════════════ */

// ── Nav scroll shadow ──────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Scroll reveal (IntersectionObserver) ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated number counters ───────────────
// Triggers once when the about section enters view
function animateCounter(el) {
  const target = el.dataset.target;
  const isNum  = !isNaN(parseInt(target));
  if (!isNum) return; // "NZ#1", "Private" etc — skip
  const end    = parseInt(target);
  const suffix = target.replace(/[0-9]/g, '');
  const dur    = 1800;
  const start  = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * end) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


// ── Concierge chat ─────────────────────────
// Voice: Robert Milne — direct, warm, authoritative, NZ-inflected
// Never uses generic chatbot phrases like "How can I assist you?"
function toggleChat() {
  const panel = document.getElementById('concierge-panel');
  const badge = document.getElementById('c-badge');
  panel.classList.toggle('open');
  if (badge) badge.style.display = 'none';
}

// Robert Milne's voice — knows the market, measured confidence
const agentReplies = [
  "I'd be happy to arrange a private viewing for you — we keep our open homes exclusive. When would work best?",
  "That's a good question. Richard and I know the North Shore coastal market better than anyone — we've been the top sales team here for seven consecutive years. What are you looking for?",
  "We're currently working with a small number of qualified buyers. If you can tell me what you have in mind, I'll be direct with you about what's available and what's coming to market privately.",
  "Our most sought-after properties rarely reach the general market. If you're serious about finding something exceptional, a conversation with me directly is the best place to start.",
  "I appreciate your interest. We represent some genuinely rare properties on the North Shore — the sort that change hands quietly. What's your timeline looking like?"
];
let replyIndex = 0;

function sendMessage() {
  const input = document.getElementById('cp-in');
  const msgs  = document.getElementById('cp-msgs');
  const text  = input.value.trim();
  if (!text) return;

  // User bubble
  const userRow = document.createElement('div');
  userRow.className = 'cp-user-row';
  userRow.innerHTML = `<div class="cp-user-bubble">${text}</div>`;
  msgs.appendChild(userRow);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  // Typing indicator — measured, not instant
  const typing = document.createElement('div');
  typing.innerHTML = `<div class="cp-msg-bubble" style="color:var(--ink-35);font-style:italic;font-size:0.78rem;">Robert is typing&hellip;</div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  // Slightly longer delay — feels more human, less bot
  setTimeout(() => {
    msgs.removeChild(typing);
    const reply = document.createElement('div');
    reply.innerHTML = `
      <div class="cp-msg-bubble">${agentReplies[replyIndex % agentReplies.length]}</div>
      <div class="cp-msg-time">Robert Milne &nbsp;·&nbsp; Just now</div>
    `;
    replyIndex++;
    msgs.appendChild(reply);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1100 + Math.random() * 400); // 1.1–1.5s — natural variation
}

function sendChip(btn) {
  document.getElementById('cp-in').value = btn.textContent;
  sendMessage();
}

// Allow Enter key to send
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cp-in');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
});
