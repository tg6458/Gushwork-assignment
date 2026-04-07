/**
 * Mobile Navigation
 * Hamburger menu toggle with click-outside and Escape key dismissal.
 */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const stickyHamburger = document.getElementById('stickyHamburger');
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  function toggleNav(btn) {
    btn.classList.toggle('active');
    navLinks.classList.toggle('active');
  }

  function closeNav() {
    if (hamburger) hamburger.classList.remove('active');
    if (stickyHamburger) stickyHamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleNav(hamburger));
  }

  if (stickyHamburger) {
    stickyHamburger.addEventListener('click', () => toggleNav(stickyHamburger));
  }

  document.addEventListener('click', (e) => {
    const clickedHamburger = (hamburger && hamburger.contains(e.target)) ||
                             (stickyHamburger && stickyHamburger.contains(e.target));
    if (!clickedHamburger && !navLinks.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
}
