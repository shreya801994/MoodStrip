// ===== THEMES CONFIG =====
const THEMES = {
  default: {
    name: 'Golden Hour',
    filter: (ctx, w, h) => {
      ctx.globalCompositeOperation = 'multiply';
      let g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,220,120,0.25)');
      g.addColorStop(1, 'rgba(180,120,60,0.25)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    },
    cssFilter: 'sepia(0.4) contrast(1.1) brightness(1.05) saturate(1.1)',
    stripBg: ['#1a1208', '#0d0b06'],
    borderColor: '#d4b478',
    textColor: '#d4b478',
    caption: 'Golden Hour · MoodStrip',
    font: 'Bebas Neue',
    vignette: 'rgba(0,0,0,0.55)',
    label: img => applySepia(img, 0.5, 1.1, 1.05),
  },
  hollywood: {
    name: 'Old Hollywood',
    filter: () => {},
    cssFilter: 'grayscale(1) contrast(1.3) brightness(1.1)',
    stripBg: ['#0a0a0a', '#1a1a1a'],
    borderColor: '#e0e0e0',
    textColor: '#ffffff',
    caption: 'Old Hollywood · MoodStrip',
    font: 'Playfair Display',
    vignette: 'rgba(0,0,0,0.7)',
    label: img => applyBW(img, 1.3, 1.1),
  },
  bollywood: {
    name: '90s Bollywood',
    filter: (ctx, w, h) => {
      ctx.globalCompositeOperation = 'screen';
      let g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/1.5);
      g.addColorStop(0, 'rgba(255,100,50,0.15)');
      g.addColorStop(1, 'rgba(255,200,0,0.08)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    },
    cssFilter: 'saturate(1.6) contrast(1.15) brightness(1.1) hue-rotate(8deg)',
    stripBg: ['#1a0a00', '#0d0600'],
    borderColor: '#f5a623',
    textColor: '#ffcc44',
    caption: '90s Bollywood · MoodStrip',
    font: 'Caveat',
    vignette: 'rgba(80,20,0,0.5)',
    label: img => applyWarm(img, 1.6, 1.15),
  },
  indie: {
    name: 'Indie Film',
    filter: (ctx, w, h) => {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(120,140,100,0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    },
    cssFilter: 'saturate(0.6) contrast(0.9) brightness(1.05) sepia(0.15)',
    stripBg: ['#0e1008', '#060805'],
    borderColor: '#9caf88',
    textColor: '#b8c9a8',
    caption: 'Indie Film · MoodStrip',
    font: 'Playfair Display',
    vignette: 'rgba(20,30,10,0.55)',
    label: img => applyMuted(img, 0.6, 0.9),
  }
};

// ===== THEME FUNCTIONS =====
function setTheme(name) {
  currentTheme = name;

  document.body.className = name !== 'default' ? `theme-${name}` : '';

  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === name);
  });

  updateFilterOverlay();
}

function updateFilterOverlay() {
  const video = document.getElementById('video');
  const theme = THEMES[currentTheme];
  video.style.filter = theme.cssFilter;
}