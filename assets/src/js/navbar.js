// Navbar Helper & Cart Badge Sync
document.addEventListener('DOMContentLoaded', function () {
  // Sync cart badges across pages if function exists
  if (typeof updateAllCartBadges === 'function') {
    updateAllCartBadges();
  } else {
    try {
      const cart = JSON.parse(localStorage.getItem('suni_cart') || '[]');
      const totalQty = cart.reduce((n, it) => n + (it.qty || 1), 0);
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = totalQty;
      });
    } catch (e) {}
  }
});
