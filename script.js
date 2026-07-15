/* ============================================
   BIRTHDAY PAGE GENERATOR — script.js
   ============================================ */

/* ── THEME DEFINITIONS ── */
const themes = {
  party: {
    bg: '#fff9f0',
    accent: '#ff6b6b',
    accent2: '#ffd93d',
    accent3: '#6bcb77',
    text: '#333333',
    muted: '#888888',
    cardBg: '#ffffff',
    cardBorder: '#ff6b6b',
    fontDisplay: 'Fredoka One',
    fontBody: 'Nunito',
    googleFont: "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap",
    bannerCSS: `background:repeating-linear-gradient(90deg,#ff6b6b 0,#ff6b6b 40px,#ffd93d 40px,#ffd93d 80px,#6bcb77 80px,#6bcb77 120px,#4d96ff 120px,#4d96ff 160px,#ff6bcd 160px,#ff6bcd 200px);height:12px;animation:slidebanner 2s linear infinite;background-size:200px 100%;`,
    titleCSS: `background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`,
    emojis: ['🎉', '🎊', '🎈', '🥳', '🎂'],
    isDark: false,
  },
  elegant: {
    bg: '#fdf8f4',
    accent: '#c9a96e',
    accent2: '#8b6f47',
    accent3: '#d4b896',
    text: '#2c1810',
    muted: '#8b7355',
    cardBg: '#fffdf9',
    cardBorder: '#c9a96e',
    fontDisplay: 'Playfair Display',
    fontBody: 'Lato',
    googleFont: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap",
    bannerCSS: `background:linear-gradient(90deg,#c9a96e,#8b6f47,#c9a96e);height:4px;`,
    titleCSS: `color:#8b6f47;`,
    emojis: ['🌹', '🥂', '🎂', '✨', '💫'],
    isDark: false,
  },
  hacker: {
    bg: '#050a0e',
    accent: '#00ff88',
    accent2: '#00c964',
    accent3: '#00ff88',
    text: '#e8f4f0',
    muted: '#6a9080',
    cardBg: '#0a1219',
    cardBorder: 'rgba(0,255,136,0.4)',
    fontDisplay: 'Space Mono',
    fontBody: 'Space Mono',
    googleFont: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
    bannerCSS: `background:#00ff88;height:2px;`,
    titleCSS: `color:#00ff88;font-family:'Space Mono',monospace;`,
    emojis: ['💻', '🔐', '🛡️', '⚡', '🚀'],
    isDark: true,
  },
  pastel: {
    bg: '#fef6fb',
    accent: '#f9a8d4',
    accent2: '#c084fc',
    accent3: '#86efac',
    text: '#4a3550',
    muted: '#a78baa',
    cardBg: '#ffffff',
    cardBorder: '#f9a8d4',
    fontDisplay: 'Nunito',
    fontBody: 'Nunito',
    googleFont: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap",
    bannerCSS: `background:linear-gradient(90deg,#f9a8d4,#c084fc,#86efac,#fde68a,#f9a8d4);background-size:300% 100%;animation:slidebanner 3s linear infinite;height:8px;`,
    titleCSS: `background:linear-gradient(135deg,#f9a8d4,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`,
    emojis: ['🌸', '🦋', '🌈', '💜', '🌷'],
    isDark: false,
  },
  galaxy: {
    bg: '#0d0d2b',
    accent: '#818cf8',
    accent2: '#c084fc',
    accent3: '#38bdf8',
    text: '#e0e7ff',
    muted: '#6366f1',
    cardBg: '#1a1a3e',
    cardBorder: 'rgba(129,140,248,0.5)',
    fontDisplay: 'Nunito',
    fontBody: 'Nunito',
    googleFont: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap",
    bannerCSS: `background:linear-gradient(90deg,#818cf8,#c084fc,#38bdf8,#818cf8);background-size:300% 100%;animation:slidebanner 4s linear infinite;height:6px;`,
    titleCSS: `background:linear-gradient(135deg,#818cf8,#c084fc,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`,
    emojis: ['🌌', '⭐', '🚀', '🌠', '💫'],
    isDark: true,
  },
};

/* ── STATE ── */
let selectedTheme = 'party';
let generatedHTML = '';

/* ── THEME SELECTOR ── */
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.remove('active');
      b.style.borderColor = '';
      b.style.background = '';
    });
    btn.classList.add('active');
    selectedTheme = btn.dataset.theme;
    const t = themes[selectedTheme];
    btn.style.borderColor = t.accent;
    btn.style.background = `rgba(0,0,0,0.04)`;
  });
});

/* ── PAGE BUILDER ── */
function buildPage(name, age, message, sender, themeKey) {
  const t = themes[themeKey];
  const ageStr = age ? `, turning ${age}` : '';
  const msgFormatted = message.replace(/\n/g, '<br>');
  const emojiHTML = t.emojis.map((e, i) =>
    `<span class="e" style="animation-delay:${i * 0.15}s">${e}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Happy Birthday ${name}!</title>
  <link href="${t.googleFont}" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    @keyframes slidebanner {
      from { background-position: 0 0; }
      to   { background-position: 300% 0; }
    }
    @keyframes bouncein {
      0%, 100% { transform: translateY(0); }
      45%      { transform: translateY(-14px); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.1); }
    }
    @keyframes fadein {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fall {
      0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0.85; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }

    body {
      background: ${t.bg};
      color: ${t.text};
      font-family: '${t.fontBody}', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .top-banner { ${t.bannerCSS} }

    .confetti-wrap {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .dot {
      position: absolute;
      border-radius: 50%;
      animation: fall linear infinite;
    }

    .hero {
      text-align: center;
      padding: 3.5rem 1.5rem 2rem;
      position: relative;
      z-index: 1;
    }

    .tag {
      display: inline-block;
      background: ${t.accent};
      color: ${t.isDark ? t.bg : 'white'};
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 7px 22px;
      border-radius: 30px;
      margin-bottom: 1.2rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .main-title {
      font-family: '${t.fontDisplay}', cursive, sans-serif;
      font-size: clamp(2.5rem, 9vw, 5rem);
      line-height: 1.1;
      margin-bottom: 0.5rem;
      ${t.titleCSS}
    }

    .subtitle {
      font-size: 1rem;
      color: ${t.muted};
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .emojis {
      display: flex;
      justify-content: center;
      gap: 1rem;
      font-size: 2.2rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    .e {
      display: inline-block;
      animation: bouncein 1.6s ease-in-out infinite;
    }

    .card-wrap {
      max-width: 640px;
      margin: 0 auto 2.5rem;
      padding: 0 1.2rem;
      position: relative;
      z-index: 1;
      animation: fadein 0.8s ease forwards;
    }

    .card {
      background: ${t.cardBg};
      border-radius: 24px;
      border: 2px solid ${t.cardBorder};
      padding: 2.5rem;
    }

    .card-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${t.accent};
      margin-bottom: 1rem;
    }

    .msg {
      font-size: 1.05rem;
      line-height: 1.9;
      color: ${t.text};
      font-weight: 600;
    }

    .sign {
      margin-top: 1.8rem;
      padding-top: 1.2rem;
      border-top: 1px dashed ${t.cardBorder};
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .sign-name {
      font-family: '${t.fontDisplay}', cursive, sans-serif;
      font-size: 1rem;
      color: ${t.muted};
    }

    .hearts {
      font-size: 1.3rem;
      letter-spacing: 4px;
      animation: pulse 1.8s ease-in-out infinite;
    }

    .footer {
      text-align: center;
      padding: 1.5rem 1rem 3rem;
      position: relative;
      z-index: 1;
    }

    .footer-text {
      font-family: '${t.fontDisplay}', cursive, sans-serif;
      font-size: 1.4rem;
      color: ${t.accent};
    }

    .bottom-banner { ${t.bannerCSS} }
  </style>
</head>
<body>

  <div class="top-banner"></div>
  <div class="confetti-wrap" id="confetti"></div>

  <div class="hero">
    <div class="tag">🎂 Happy Birthday${ageStr}!</div>
    <div class="main-title">Hey ${name}!</div>
    <div class="subtitle">Someone made this just for you 💌</div>
    <div class="emojis">${emojiHTML}</div>
  </div>

  <div class="card-wrap">
    <div class="card">
      <div class="card-label">💌 a message just for you</div>
      <div class="msg">${msgFormatted}</div>
      <div class="sign">
        <span class="sign-name">— ${sender || 'Your person'} 🎀</span>
        <span class="hearts">💖💛💚💙💜</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-text">🎉 Happy Birthday ${name}! 🎉</div>
  </div>

  <div class="bottom-banner"></div>

  <script>
    const colors = ['${t.accent}', '${t.accent2}', '${t.accent3}', '#ffd93d', '#ff6bcd'];
    const wrap = document.getElementById('confetti');
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.className = 'dot';
      const s = 5 + Math.random() * 9;
      el.style.cssText =
        'width:' + s + 'px;' +
        'height:' + s + 'px;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'left:' + Math.random() * 100 + '%;' +
        'top:-20px;' +
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '3px') + ';' +
        'animation-duration:' + (4 + Math.random() * 5) + 's;' +
        'animation-delay:' + Math.random() * 6 + 's;' +
        'opacity:0.75;';
      wrap.appendChild(el);
    }
  <\/script>

</body>
</html>`;
}

/* ── GENERATE ── */
document.getElementById('gen-btn').addEventListener('click', () => {
  const name    = document.getElementById('name').value.trim() || 'Friend';
  const age     = document.getElementById('age').value.trim();
  const sender  = document.getElementById('sender').value.trim() || 'Your person';
  const message = document.getElementById('message').value.trim() ||
    `Today is YOUR day and I just want you to know how incredibly special you are to me.\n\nHaving you in my life is one of the greatest gifts I could ever ask for. Wishing you all the happiness, love, and good vibes in the world — you deserve every single bit of it!\n\nHappy Birthday! 🎂`;

  generatedHTML = buildPage(name, age, message, sender, selectedTheme);

  const frame = document.getElementById('preview-frame');
  frame.srcdoc = generatedHTML;

  const actions = document.getElementById('actions');
  actions.classList.add('visible');

  actions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ── COPY HTML ── */
document.getElementById('copy-btn').addEventListener('click', () => {
  if (!generatedHTML) return;
  navigator.clipboard.writeText(generatedHTML).then(() => {
    const btn = document.getElementById('copy-btn');
    const original = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = original; }, 2000);
  });
});

/* ── DOWNLOAD ── */
document.getElementById('dl-btn').addEventListener('click', () => {
  if (!generatedHTML) return;
  const blob = new Blob([generatedHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'birthday-surprise.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
});
