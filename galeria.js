document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const img = document.createElement('img');
  content.appendChild(img);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.textContent = '×';
  content.appendChild(closeBtn);

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Otwarcie lightbox
  document.querySelectorAll('a.lightbox').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      img.src = ''; // Resetuj src najpierw
      overlay.classList.add('active');

      // Opóźnij ładowanie dużego obrazka
      setTimeout(() => {
        img.src = link.getAttribute('href');
        resetZoom();
      }, 50);
    });
  });

  // Zamknięcie
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    overlay.classList.remove('active');
    img.src = '';
    resetZoom();
  }

  // Zoom & Pan
  let scale = 1;
  let posX = 0, posY = 0;
  let isDragging = false, startX = 0, startY = 0;

  img.addEventListener('wheel', e => {
    e.preventDefault();
    scale += e.deltaY < 0 ? 0.2 : -0.2;
    scale = Math.max(1, Math.min(3, scale));
    if (scale === 1) resetPosition();
    applyTransform();
  });

  img.addEventListener('mousedown', e => {
    if (scale === 1) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    img.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyTransform();
  });

  function applyTransform() {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  function resetPosition() {
    posX = 0;
    posY = 0;
  }

  function resetZoom() {
    scale = 1;
    resetPosition();
    applyTransform();
    img.style.cursor = 'default';
  }
});
