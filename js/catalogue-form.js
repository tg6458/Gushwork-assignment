/**
 * Catalogue Form
 * Handles the inline catalogue download form submission.
 */
function initCatalogueForm() {
  const form = document.getElementById('catalogueForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('.catalogue-cta__input').value;
    if (email) {
      alert('Thank you! The catalogue will be sent to ' + email);
      form.reset();
    }
  });
}
