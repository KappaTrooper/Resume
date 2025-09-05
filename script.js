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

