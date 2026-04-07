/**
 * FAQ Accordion
 * Toggle open/close with smooth animation.
 * Only one item open at a time.
 */
function initFaqAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq__question');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('faq__item--active');

      /* Close all items first */
      items.forEach((i) => {
        i.classList.remove('faq__item--active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      /* If clicked item wasn't active, open it */
      if (!isActive) {
        item.classList.add('faq__item--active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
