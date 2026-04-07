/**
 * Modals
 * Open/close with data-modal triggers.
 * Handles the catalogue download modal and the callback/quote modal,
 * including form submissions, overlay click, and Escape key dismissal.
 */
function initModals() {
  /* Open modal: any button with data-modal attribute */
  document.querySelectorAll('[data-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('modal-overlay--active');
        document.body.style.overflow = 'hidden';
        /* Focus first input */
        const firstInput = modal.querySelector('.modal__input');
        if (firstInput) setTimeout(() => firstInput.focus(), 300);
      }
    });
  });

  /* Close modal: close button */
  document.querySelectorAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  /* Close modal: click overlay background */
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  /* Close modal: Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* Form submissions */
  const catForm = document.getElementById('catalogueModalForm');
  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! The catalogue will be emailed to you shortly.');
      catForm.reset();
      closeAllModals();
    });
  }

  const cbForm = document.getElementById('callbackModalForm');
  if (cbForm) {
    cbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! We will call you back shortly.');
      cbForm.reset();
      closeAllModals();
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach((m) => {
    m.classList.remove('modal-overlay--active');
  });
  document.body.style.overflow = '';
}
