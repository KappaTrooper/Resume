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



  // Dark Mode Toggle


  (function(){
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');

    // Determine initial theme: localStorage > OS preference > default (dark)
    const stored = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored || (prefersLight ? 'light' : 'dark');
    applyTheme(initial);

    // Keep button UI in sync
    updateToggleUI(initial);

    btn.addEventListener('click', () => {
      const next = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
      applyTheme(next);
      updateToggleUI(next);
      localStorage.setItem('theme', next);
    });

    function applyTheme(mode){
      if(mode === 'light'){
        root.setAttribute('data-theme','light');
      }else{
        root.setAttribute('data-theme','dark');
      }
    }

    function updateToggleUI(mode){
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');

      if(mode === 'light'){
        btn.setAttribute('aria-pressed','true');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        label.textContent = 'Light';
      }else{
        btn.setAttribute('aria-pressed','false');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        label.textContent = 'Dark';
      }
    }

    // Optional: live-update if user changes OS theme (only when user hasn't chosen manually)
    if(!stored && window.matchMedia){
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      mq.addEventListener?.('change', (e) => {
        const mode = e.matches ? 'light' : 'dark';
        applyTheme(mode);
        updateToggleUI(mode);
      });
    }
  })();

