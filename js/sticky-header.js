/**
 * Sticky Header
 * Shows the secondary header when scrolling down past the hero section,
 * hides it when scrolling back up.
 */
function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  const heroSection = document.getElementById('heroSection');
  if (!stickyHeader || !heroSection) return;

  let lastScrollY = 0;
  let ticking = false;

  function update() {
    const currentScrollY = window.scrollY;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollingDown = currentScrollY > lastScrollY;

    /* Show sticky header only when:
       1. Scrolled past the first fold (hero section)
       2. Scrolling DOWN */
    if (currentScrollY > heroBottom && scrollingDown) {
      stickyHeader.classList.add('sticky-header--visible');
    } else if (!scrollingDown || currentScrollY <= heroBottom) {
      stickyHeader.classList.remove('sticky-header--visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}
