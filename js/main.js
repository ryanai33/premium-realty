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

// ── Concierge chat ─────────────────────────
function toggleChat() {
  const panel = document.getElementById('concierge-panel');
  const badge = document.getElementById('c-badge');
  panel.classList.toggle('open');
  if (badge) badge.style.display = 'none';
}

const replies = [
  "I'd be delighted to help. Our specialists can arrange a private viewing at your convenience — shall I connect you with Robert or Richard Milne directly?",
  "Wonderful choice of area. We have several exceptional residences on Auckland's North Shore right now. Would you like me to share current listings?",
  "Absolutely — I can arrange a complimentary appraisal with our leading specialists. What suburb are you considering?",
  "That's a great question. Premium has specialised in North Shore coastal and lifestyle properties since 1984. Our team knows these streets intimately — may I connect you with a specialist?",
  "We'd love to help with that. Private viewings are available seven days a week at times that suit you. What property or area interests you most?"
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

  // Typing indicator
  const typing = document.createElement('div');
  typing.innerHTML = `<div class="cp-msg-bubble" style="color:var(--ink-35);font-style:italic;">Typing…</div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    msgs.removeChild(typing);
    const reply = document.createElement('div');
    reply.innerHTML = `
      <div class="cp-msg-bubble">${replies[replyIndex % replies.length]}</div>
      <div class="cp-msg-time">Just now</div>
    `;
    replyIndex++;
    msgs.appendChild(reply);
    msgs.scrollTop = msgs.scrollHeight;
  }, 950);
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
