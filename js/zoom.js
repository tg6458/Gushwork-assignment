/**
 * Zoom on Hover
 * Uses background-image on the preview panel for reliable zoom positioning
 * when the user hovers over the main product image.
 */
function initZoom() {
  const carouselMain = document.getElementById('carouselMain');
  const mainImage = document.getElementById('mainImage');
  const lens = document.getElementById('zoomLens');
  const preview = document.getElementById('zoomPreview');
  if (!carouselMain || !mainImage || !lens || !preview) return;

  const ZOOM = 2.5;
  const LENS_SIZE = 120;

  carouselMain.addEventListener('mouseenter', () => {
    /* Set the preview to use background-image for reliable zoom */
    preview.style.backgroundImage = 'url(' + mainImage.src + ')';
    const rect = carouselMain.getBoundingClientRect();
    preview.style.backgroundSize = (rect.width * ZOOM) + 'px ' + (rect.height * ZOOM) + 'px';
    preview.classList.add('carousel__zoom-preview--visible');
  });

  carouselMain.addEventListener('mouseleave', () => {
    preview.classList.remove('carousel__zoom-preview--visible');
  });

  carouselMain.addEventListener('mousemove', (e) => {
    const rect = carouselMain.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    /* Position lens (clamped to bounds) */
    const lx = Math.max(0, Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE));
    const ly = Math.max(0, Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE));
    lens.style.left = lx + 'px';
    lens.style.top = ly + 'px';

    /* Calculate percentage position */
    const percX = x / rect.width;
    const percY = y / rect.height;

    /* Move background in preview, clamped to avoid black edges */
    const zoomW = rect.width * ZOOM;
    const zoomH = rect.height * ZOOM;
    const previewRect = preview.getBoundingClientRect();

    let bgX = (percX * zoomW) - (previewRect.width / 2);
    let bgY = (percY * zoomH) - (previewRect.height / 2);

    /* Clamp so background never goes past image edges */
    bgX = Math.max(0, Math.min(bgX, zoomW - previewRect.width));
    bgY = Math.max(0, Math.min(bgY, zoomH - previewRect.height));

    preview.style.backgroundPosition = '-' + bgX + 'px -' + bgY + 'px';
  });
}
