// Cart functionality with localStorage persistence
const CART_KEY = 'suni_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(item) {
  const cart = getCart();
  // Check if item already exists
  const existing = cart.find(it => it.title === item.title && it.img === item.img);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  setCart(cart);
  updateAllCartBadges();
}

function updateAllCartBadges() {
  const cart = getCart();
  const totalQty = cart.reduce((n, it) => n + (it.qty || 1), 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = totalQty;
  });
}

// Toast notification function
function showCartNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector('.cart-toast-notification');
  if (existing) existing.remove();
  
  // Create notification element
  const toast = document.createElement('div');
  toast.className = 'cart-toast-notification';
  toast.innerHTML = `
    <i class="fas fa-check-circle me-2"></i>
    <span>${message}</span>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #2e7d32, #4caf50);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add animation keyframes if not already added
  if (!document.querySelector('#cartToastStyles')) {
    const style = document.createElement('style');
    style.id = 'cartToastStyles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const imgSrc = this.getAttribute('data-img');
    document.getElementById('modalImage').src = imgSrc;
  });
});

// ===== Like button toggle =====
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const icon = this.querySelector('i');
    icon.classList.toggle('text-danger');
    const pressed = this.getAttribute('aria-pressed') === 'true';
    this.setAttribute('aria-pressed', String(!pressed));
  });
});

// ===== Add to cart logic =====
document.querySelectorAll('.cart-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    
    // find the painting card containing this button
    const card = this.closest('.painting-card');
    const titleEl = card.querySelector('.title');
    const priceEl = card.querySelector('.price');
    const title = titleEl ? titleEl.textContent.trim() : (card.querySelector('img').alt || 'Painting');
    const priceText = priceEl ? priceEl.textContent.trim() : '₹0';
    
    // Extract numeric price value
    const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const imgSrc = card.querySelector('img').src;

    // Add to localStorage cart
    addToCart({
      title: title,
      price: priceText,
      priceValue: priceValue,
      img: imgSrc
    });

    // Show toast notification
    showCartNotification('Item is added into Cart');
    
    // Show success feedback on button
    const btnElement = this;
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fas fa-check"></i>';
    btnElement.style.background = 'linear-gradient(135deg, #2e7d32, #4caf50)';
    btnElement.style.color = 'white';
    setTimeout(() => {
      btnElement.innerHTML = originalContent;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 1500);
  });
});

// initialize cart badges on page load
updateAllCartBadges();