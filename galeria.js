function toggleImages(sectionId) {
  const hiddenSection = document.querySelector(`#${sectionId} .${sectionId}-hidden`);
  const button = document.querySelector(`#${sectionId} .toggle-button`);

  if (!hiddenSection || !button) return;

  const isHidden = hiddenSection.classList.contains('hidden-images');
  hiddenSection.classList.toggle('hidden-images');
  button.textContent = isHidden ? 'Pokaż mniej' : 'Pokaż więcej';
}

document.addEventListener('DOMContentLoaded', () => {
  // LIGHTBOX (używamy lightboxImg zamiast img)
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const lightboxImg = document.createElement('img');
  content.appendChild(lightboxImg);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.textContent = '×';
  content.appendChild(closeBtn);

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function setupLightbox(link) {
    link.addEventListener('click', e => {
      e.preventDefault();
      lightboxImg.src = '';
      overlay.classList.add('active');
      setTimeout(() => {
        lightboxImg.src = link.getAttribute('href');
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
    lightboxImg.src = '';
    resetZoom();
  }

  // Zoom i przesuwanie (dla lightboxImg)
  let scale = 1;
  let posX = 0, posY = 0;
  let isDragging = false, startX = 0, startY = 0;

  lightboxImg.addEventListener('wheel', e => {
    e.preventDefault();
    scale += e.deltaY < 0 ? 0.2 : -0.2;
    scale = Math.max(1, Math.min(3, scale));
    if (scale === 1) resetPosition();
    applyTransform();
  });

  lightboxImg.addEventListener('mousedown', e => {
    if (scale === 1) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    lightboxImg.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    lightboxImg.style.cursor = scale > 1 ? 'grab' : 'default';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyTransform();
  });

  function applyTransform() {
    lightboxImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  function resetPosition() {
    posX = 0;
    posY = 0;
  }

  function resetZoom() {
    scale = 1;
    resetPosition();
    applyTransform();
    lightboxImg.style.cursor = 'default';
  }

  // 🔽 Dynamiczne ładowanie figurek
  const figurkiContainer = document.getElementById("figurki-grid");
  const figurkiHiddenContainer = document.getElementById("figurki-hidden-grid");

  if (figurkiContainer && figurkiHiddenContainer) {
    let i = 1;
    const visibleCount = 12;
    const maxImages = 50; // zmień jeśli masz więcej niż 50 plików

    function loadNextImage() {
      if (i > maxImages) {
        console.log(`✔️ Sprawdziłem do figurka${i - 1}.png`);
        return;
      }

      const loader = new Image();
      const src = `figurka${i}.png`;

      loader.onload = () => {
        const figure = document.createElement("figure");
        const link = document.createElement("a");
        link.href = src;
        link.classList.add("lightbox");

        loader.alt = `Figurka ${i}`;
        loader.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = `Figurka ${i}`;

        link.appendChild(loader);
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

      loader.onerror = () => {
        console.warn(`❌ Brak pliku: ${src} – pomijam`);
        i++;
        loadNextImage(); // kontynuujemy mimo błędu
      };

      loader.src = src;
    }

    loadNextImage();
  }

  // 🔽 Dynamiczne ładowanie bombek
  const bombkiContainer = document.getElementById("bombki-grid");
  const bombkiHiddenContainer = document.getElementById("bombki-hidden-grid");

  if (bombkiContainer && bombkiHiddenContainer) {
    let i = 1;
    const visibleCount = 12;
    const maxImages = 50;

    function loadNextBombka() {
      if (i > maxImages) {
        console.log(`✔️ Sprawdziłem do bombka${i - 1}.png`);
        return;
      }

      const loader = new Image();
      const src = `bombka${i}.png`;

      loader.onload = () => {
        const figure = document.createElement("figure");
        const link = document.createElement("a");
        link.href = src;
        link.classList.add("lightbox");

        loader.alt = `Bombka ${i}`;
        loader.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = `Bombka ${i}`;

        link.appendChild(loader);
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

      loader.onerror = () => {
        console.warn(`❌ Brak pliku: ${src} – pomijam`);
        i++;
        loadNextBombka();
      };

      loader.src = src;
    }

    loadNextBombka();
  }

  // 🔽 Dynamiczne ładowanie lampionów
  const lampionContainer = document.getElementById("lampiony-grid");
  const lampionHiddenContainer = document.getElementById("lampiony-hidden-grid");

  if (lampionContainer && lampionHiddenContainer) {
    let i = 1;
    const visibleCount = 12;
    const maxImages = 50;

    function loadNextLampion() {
      if (i > maxImages) {
        console.log(`✔️ Sprawdziłem do lampion${i - 1}.png`);
        return;
      }

      const loader = new Image();
      const src = `lampion${i}.png`;

      loader.onload = () => {
        const figure = document.createElement("figure");
        const link = document.createElement("a");
        link.href = src;
        link.classList.add("lightbox");

        loader.alt = `Świecznik ${i}`;
        loader.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = `Świecznik ${i}`;

        link.appendChild(loader);
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

      loader.onerror = () => {
        console.warn(`❌ Brak pliku: ${src} – pomijam`);
        i++;
        loadNextLampion();
      };

      loader.src = src;
    }

    loadNextLampion();
  }

}); // koniec DOMContentLoaded
