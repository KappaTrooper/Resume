/* ======================================
   Cursor-follow glow (unchanged)
====================================== */
(function(){
  const root = document.documentElement;
  let x = 50, y = 50, tx = 50, ty = 50;

  window.addEventListener('pointermove', (e) => {
    const px = (e.clientX / window.innerWidth) * 100;
    const py = (e.clientY / window.innerHeight) * 100;
    tx = px; ty = py;
  }, { passive: true });

  function tick(){
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    root.style.setProperty('--mx', x + '%');
    root.style.setProperty('--my', y + '%');
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ======================================
   Theme toggle with clear UX feedback
====================================== */
(function(){
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');

  // If the toggle button isn't present, bail
  if (!btn) return;

  // Live announcer + toast (created if not found in HTML)
  const announcer = document.getElementById('themeAnnouncer') || (() => {
    const d = document.createElement('div');
    d.id = 'themeAnnouncer';
    d.setAttribute('aria-live','polite');
    Object.assign(d.style, {
      position:'absolute', width:'1px', height:'1px', padding:'0', margin:'-1px',
      overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap', border:'0'
    });
    document.body.appendChild(d);
    return d;
  })();

  const toast = document.getElementById('themeToast') || (() => {
    const d = document.createElement('div');
    d.id = 'themeToast';
    d.setAttribute('role','status');
    Object.assign(d.style, {
      position:'fixed', left:'24px', bottom:'24px', padding:'10px 14px',
      borderRadius:'10px', border:'1px solid var(--border)',
      background:'linear-gradient(180deg, rgba(148,163,184,.10), rgba(148,163,184,.04))',
      color:'var(--heading)', boxShadow:'var(--shadow)',
      opacity:'0', transform:'translateY(6px)',
      transition:'opacity .18s ease, transform .18s ease',
      zIndex:'9999'
    });
    d.hidden = true;
    document.body.appendChild(d);
    return d;
  })();

  // Determine initial theme: localStorage > OS preference > default (dark)
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');
  applyTheme(initial);
  updateToggleUI(initial, /*skipToast=*/true);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || initial;
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    updateToggleUI(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(mode){
    root.setAttribute('data-theme', mode === 'light' ? 'light' : 'dark');
  }

  // Update button text/icon/ARIA. Label describes the ACTION the button will perform.
  function updateToggleUI(currentMode, skipToast){
    const icon  = btn.querySelector('i');
    const label = btn.querySelector('.mode-text') || btn.querySelector('span');

    const nextActionLabel = currentMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    if (label) label.textContent = nextActionLabel;
    btn.setAttribute('aria-label', nextActionLabel);
    btn.title = nextActionLabel;

    // Icon reflects the CURRENT mode (sun = light, moon = dark)
    if (icon){
      icon.classList.remove('fa-sun','fa-moon');
      icon.classList.add(currentMode === 'light' ? 'fa-sun' : 'fa-moon');
    }

    // aria-pressed indicates "dark mode is active"
    btn.setAttribute('aria-pressed', currentMode === 'dark' ? 'true' : 'false');

    // Feedback
    announce(currentMode === 'light' ? 'Light mode enabled' : 'Dark mode enabled');
    if (!skipToast) showToast(currentMode === 'light' ? 'Light mode on' : 'Dark mode on');
  }

  function announce(text){
    announcer.textContent = '';
    setTimeout(() => (announcer.textContent = text), 20);
  }

  function showToast(text){
    toast.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      setTimeout(() => { toast.hidden = true; toast.textContent = ''; }, 250);
    }, 3000);
  }

  // Respect OS changes if user hasn’t picked manually
  if(!stored && window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener?.('change', (e) => {
      const mode = e.matches ? 'light' : 'dark';
      applyTheme(mode);
      updateToggleUI(mode);
    });
  }
})();
