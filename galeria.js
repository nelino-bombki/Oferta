// PROSTA I BEZPIECZNA WERSJA: oczekuje id-prefixu + opcjonalnie przycisku (this)
function toggleImages(sectionId, btn) {
  // sectionId powinno być np. "figurki-rodzaj3"
  const hiddenSection = document.getElementById(`${sectionId}-hidden-grid`);
  if (!hiddenSection) {
    console.warn('toggleImages: nie znaleziono ukrytego gridu o id:', `${sectionId}-hidden-grid`);
    return;
  }

  // jeśli przekazano element przycisku (this) - użyj go; fallback: spróbuj znaleźć przycisk obok hiddenSection
  let button = btn || null;
  if (!button) {
    // spróbuj znaleźć toggle-button w następnym sibling / w obrębie tej sekcji
    button = document.querySelector(`#${sectionId} .toggle-button`) ||
             hiddenSection.nextElementSibling?.querySelector?.('.toggle-button') ||
             hiddenSection.parentElement?.querySelector?.('.toggle-button') ||
             document.querySelector('.toggle-button');
  }

  // toggle klasy i tekstu guzika
  const wasHidden = hiddenSection.classList.contains('hidden-images');
  hiddenSection.classList.toggle('hidden-images');
  if (button) button.textContent = wasHidden ? 'Pokaż mniej' : 'Pokaż więcej';
}


document.addEventListener('DOMContentLoaded', () => {
  // ---------------- Lightbox (overlay + zoom) ----------------
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
      // krótkie opóźnienie żeby overlay się pokazał zanim zaczniemy wczytywać zdjęcie (ładniejsze)
      setTimeout(() => {
        // używamy pełnej, względnej ścieżki (może być 'img/...')
        lightboxImg.src = link.getAttribute('href');
        resetZoom();
      }, 50);
    });
  }

  function close() {
    overlay.classList.remove('active');
    lightboxImg.src = '';
    resetZoom();
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Zoom i przesuwanie (dla lightboxImg)
  let scale = 1;
  let posX = 0, posY = 0;
  let isDragging = false, startX = 0, startY = 0;

  lightboxImg.addEventListener('wheel', e => {
    e.preventDefault();
    // delikatniejszy zoom
    scale += e.deltaY < 0 ? 0.15 : -0.15;
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

  // ---------------- uniwersalny loader galerii (robust) ----------------
  /**
   * options:
   *  - containerId: id widocznego kontenera (np. "figurki-grid")
   *  - hiddenId: id kontenera ukrytego (np. "figurki-hidden-grid")
   *  - prefix: "figurka" (dla plików typu figurka1.png)
   *  - folders: array of folder paths to try, e.g. ['img/figurki','img/figurka','.']
   *  - visibleCount, maxImages, ext
   */
  function loadGallery({ containerId, hiddenId, prefix, folders = ['.'], visibleCount = 12, maxImages = 150, ext = 'png' }) {
    const container = document.getElementById(containerId);
    const hidden = document.getElementById(hiddenId);
    if (!container || !hidden) {
      console.warn(`Galeria: brak kontenerów dla ${containerId} / ${hiddenId}`);
      return;
    }

    // upewnij się że folders to array
    if (!Array.isArray(folders)) folders = [folders];

    let index = 1;

    // rekurencyjna próba dla danego indexu i kolejnych folderów
    function tryLoad(currentIndex, folderIndex = 0) {
      if (currentIndex > maxImages) {
        console.log(`✔️ Sprawdziłem do ${prefix}${currentIndex - 1}.${ext}`);
        return;
      }

      // normalizacja folderu (usuń slashe na końcu/początku)
      let folder = (folders[folderIndex] || '.').toString().replace(/^\/|\/$/g, '');
      const src = folder === '.' ? `${prefix}${currentIndex}.${ext}` : `${folder}/${prefix}${currentIndex}.${ext}`;

      const img = new Image();
      img.onload = () => {
        // gotowe: utwórz elementy i dodaj do DOM
        const figure = document.createElement('figure');
        const link = document.createElement('a');
        // używamy a.href jako dokładnej ścieżki, żeby lightbox mógł wczytać
        link.href = src;
        link.classList.add('lightbox');

        img.alt = `${prefix} ${currentIndex}`;
        img.loading = 'lazy';

        const caption = document.createElement('figcaption');
        caption.textContent = `${prefix} ${currentIndex}`;

        link.appendChild(img);
        figure.appendChild(link);
        figure.appendChild(caption);

        if (currentIndex <= visibleCount) container.appendChild(figure);
        else hidden.appendChild(figure);

        // podłącz lightbox
        if (typeof setupLightbox === 'function') setupLightbox(link);

        // idziemy do następnego obrazka (zaczynając z powrotem od pierwszego folderu)
        tryLoad(currentIndex + 1, 0);
      };

      img.onerror = () => {
        // jeśli są jeszcze foldery do sprawdzenia dla tego numeru -> spróbuj następnego
        if (folderIndex + 1 < folders.length) {
          tryLoad(currentIndex, folderIndex + 1);
        } else {
          // nie znaleziono obrazka w żadnym folderze -> pomiń i idź dalej
          console.warn(`❌ Brak pliku: ${src} – pomijam`);
          tryLoad(currentIndex + 1, 0);
        }
      };

      // ustawienie src powoduje start ładowania
      img.src = src;
    }

    // start
    tryLoad(index, 0);
  }

  // ---------------- wywołania dla Twoich galerii (spróbuj różnych nazw folderów) ----------------
  // WAŻNE: dopasuj listę 'folders' do tego co masz w repo. Poniżej są typowe warianty (pl i ang).
  loadGallery({
    containerId: "figurki-rodzaj1-grid",
    hiddenId: "figurki-rodzaj1-hidden-grid",
    prefix: "figurka",
    folders: ["images/figurki/rodzaj1", "images/figurka/rodzaj1"], // spróbuje po kolei
    visibleCount: 12,
    maxImages: 150,
    ext: "png"
  });

  loadGallery({
    containerId: "figurki-rodzaj2-grid",
    hiddenId: "figurki-rodzaj2-hidden-grid",
    prefix: "figurka",
    folders: ["images/figurki/rodzaj2", "images/figurka/rodzaj2"], // spróbuje po kolei
    visibleCount: 12,
    maxImages: 150,
    ext: "png"
  });

  loadGallery({
    containerId: "figurki-rodzaj3-grid",
    hiddenId: "figurki-rodzaj3-hidden-grid",
    prefix: "figurka",
    folders: ["images/figurki/rodzaj3", "images/figurka/rodzaj3"], // spróbuje po kolei
    visibleCount: 12,
    maxImages: 150,
    ext: "png"
  });

  loadGallery({
    containerId: "figurki-rodzaj4-grid",
    hiddenId: "figurki-rodzaj4-hidden-grid",
    prefix: "figurka",
    folders: ["images/figurki/rodzaj4", "images/figurka/rodzaj4"], // spróbuje po kolei
    visibleCount: 12,
    maxImages: 150,
    ext: "png"
  });

  loadGallery({
    containerId: "bombki-grid",
    hiddenId: "bombki-hidden-grid",
    prefix: "bombka",
    folders: ["images/bombki", "images/bombka"],
    visibleCount: 12,
    maxImages: 50,
    ext: "png"
  });

  loadGallery({
    containerId: "lampiony-grid",
    hiddenId: "lampiony-hidden-grid",
    prefix: "lampion",
    folders: ["images/lampiony", "images/lampion"],
    visibleCount: 12,
    maxImages: 50,
    ext: "png"
  });

}); // koniec DOMContentLoaded
