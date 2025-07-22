function toggleImages(sectionId) {
  const hiddenSection = document.querySelector(`#${sectionId} .${sectionId}-hidden`);
  const button = document.querySelector(`#${sectionId} .toggle-button`);

  if (!hiddenSection || !button) return;

  const isHidden = hiddenSection.classList.contains('hidden-images');
  hiddenSection.classList.toggle('hidden-images');
  button.textContent = isHidden ? 'Pokaż mniej' : 'Pokaż więcej';
}

document.addEventListener('DOMContentLoaded', () => {
  // LIGHTBOX
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

  function setupLightbox(link) {
    link.addEventListener('click', e => {
      e.preventDefault();
      img.src = '';
      overlay.classList.add('active');
      setTimeout(() => {
        img.src = link.getAttribute('href');
        resetZoom();
      }, 50);
    });
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    overlay.classList.remove('active');
    img.src = '';
    resetZoom();
  }

  // Zoom i przesuwanie
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

  // 🔽 Dynamiczne ładowanie figurek
  const figurkiContainer = document.getElementById("figurki-grid");
  const figurkiHiddenContainer = document.getElementById("figurki-hidden-grid");

  if (figurkiContainer && figurkiHiddenContainer) {
    let i = 1;
    const visibleCount = 12;

    function loadNextImage() {
      const img = new Image();
      img.src = `figurka${i}.png`;

      img.onload = () => {
        const figure = document.createElement("figure");

        const link = document.createElement("a");
        link.href = img.src;
        link.classList.add("lightbox");

        img.alt = `Figurka ${i}`;
        img.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = `Figurka ${i}`;

        link.appendChild(img);
        figure.appendChild(link);
        figure.appendChild(caption);

        if (i <= visibleCount) {
          figurkiContainer.appendChild(figure);
        } else {
          figurkiHiddenContainer.appendChild(figure);
        }

        setupLightbox(link);
        i++;
        loadNextImage();
      };

      img.onerror = () => {
        console.log(`✔️ Wczytano ${i - 1} zdjęć figurek.`);
      };
    }

    loadNextImage();
  }

  // 🔽 Dynamiczne ładowanie bombek
const bombkiContainer = document.getElementById("bombki-grid");
const bombkiHiddenContainer = document.getElementById("bombki-hidden-grid");

if (bombkiContainer && bombkiHiddenContainer) {
  let i = 1;
  const visibleCount = 12;

  function loadNextBombka() {
    const img = new Image();
    img.src = `bombka${i}.png`;

    img.onload = () => {
      const figure = document.createElement("figure");

      const link = document.createElement("a");
      link.href = img.src;
      link.classList.add("lightbox");

      img.alt = `Bombka ${i}`;
      img.loading = "lazy";

      const caption = document.createElement("figcaption");
      caption.textContent = `Bombka ${i}`;

      link.appendChild(img);
      figure.appendChild(link);
      figure.appendChild(caption);

      if (i <= visibleCount) {
        bombkiContainer.appendChild(figure);
      } else {
        bombkiHiddenContainer.appendChild(figure);
      }

      setupLightbox(link);
      i++;
      loadNextBombka();
    };

    img.onerror = () => {
      console.log(`✔️ Wczytano ${i - 1} zdjęć bombek.`);
    };
  }

  loadNextBombka();
}

// 🔽 Dynamiczne ładowanie lampionów
  // 🔽 Dynamiczne ładowanie bombek
const lampionContainer = document.getElementById("lampiony-grid");
const lampionHiddenContainer = document.getElementById("lampiony-hidden-grid");

if (lampionContainer && lampionHiddenContainer) {
  let i = 1;
  const visibleCount = 12;

  function loadNextLampion() {
    const img = new Image();
    img.src = `lampion${i}.png`;

    img.onload = () => {
      const figure = document.createElement("figure");

      const link = document.createElement("a");
      link.href = img.src;
      link.classList.add("lightbox");

      img.alt = `Świecznik ${i}`;
      img.loading = "lazy";

      const caption = document.createElement("figcaption");
      caption.textContent = `Świecznik ${i}`;

      link.appendChild(img);
      figure.appendChild(link);
      figure.appendChild(caption);

      if (i <= visibleCount) {
        lampionContainer.appendChild(figure);
      } else {
        lampionHiddenContainer.appendChild(figure);
      }

      setupLightbox(link);
      i++;
      loadNextLampion();
    };

    img.onerror = () => {
      console.log(`✔️ Wczytano ${i - 1} zdjęć bombek.`);
    };
  }

  loadNextLampion();
}

});
