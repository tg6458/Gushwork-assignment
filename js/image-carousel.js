/**
 * Product Image Carousel
 * Arrow navigation and thumbnail click handling for the product image gallery.
 */
function initImageCarousel() {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.carousel__thumb');
  const prevBtn = document.getElementById('imgPrevBtn');
  const nextBtn = document.getElementById('imgNextBtn');
  if (!mainImage || !thumbs.length) return;

  const imageSrc = 'assets/process-image.jpg';
  const images = [
    { src: imageSrc, alt: 'HDPE Pipe Installation' },
    { src: imageSrc, alt: 'HDPE Pipe Close-up' },
    { src: imageSrc, alt: 'HDPE Manufacturing' },
    { src: imageSrc, alt: 'HDPE Pipe Coils' },
    { src: imageSrc, alt: 'Infrastructure Project' }
  ];

  let current = 0;

  function goTo(index) {
    current = index;
    mainImage.src = images[index].src;
    mainImage.alt = images[index].alt;
    thumbs.forEach((t, i) => {
      t.classList.toggle('carousel__thumb--active', i === index);
      t.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  thumbs.forEach(t => t.addEventListener('click', () => goTo(parseInt(t.dataset.index, 10))));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + images.length) % images.length));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % images.length));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}
