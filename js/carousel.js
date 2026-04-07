/**
 * Horizontal Scrolling Carousel
 * Arrow navigation with touch/drag support for mobile.
 * Cards peek from edges for visual depth.
 */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || !prevBtn || !nextBtn) return;

  /* Calculate scroll amount based on one card width + gap */
  function getScrollAmount() {
    const card = track.querySelector('.carousel-card');
    if (!card) return 300;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  /* Start carousel in the middle so user can scroll both left and right */
  function scrollToMiddle() {
    const totalScroll = track.scrollWidth - track.clientWidth;
    track.scrollLeft = totalScroll / 2;
  }

  /* Wait for images to load before centering */
  const images = track.querySelectorAll('img');
  let loaded = 0;
  if (images.length === 0) {
    scrollToMiddle();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) scrollToMiddle();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === images.length) scrollToMiddle();
        });
      }
    });
    /* Fallback: center after short delay in case images are cached */
    setTimeout(scrollToMiddle, 100);
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  /* Touch/drag support for mobile */
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}
