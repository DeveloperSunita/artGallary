// Authentication and Page Protection System for Sunita Arts Gallery

(function () {
  const pagePath = window.location.pathname.toLowerCase();
  const isLoginPage = pagePath.endsWith('login.html');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // If user is not logged in and trying to access protected pages, redirect to login.html
  if (!isLoggedIn && !isLoginPage) {
    window.location.href = 'login.html';
    return;
  }

  // If user is already logged in and visits login.html, redirect to index.html
  if (isLoggedIn && isLoginPage) {
    window.location.href = 'index.html';
    return;
  }

  // Helper function to get current user
  window.getCurrentUser = function () {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    } catch (e) {
      return {};
    }
  };

  // Helper function to logout
  window.logoutUser = function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  };

  // Setup DOM elements after content loaded
  document.addEventListener('DOMContentLoaded', function () {
    setupAuthNavbar();
    setupImageFallbacks();
  });

  function setupAuthNavbar() {
    const dropdownMenu = document.querySelector('.navbar .dropdown-menu');
    const userDropdownToggle = document.querySelector('#navbarDropdown');

    if (isLoggedIn) {
      const user = window.getCurrentUser();
      const userName = user.name || (user.email ? user.email.split('@')[0] : 'Artist');

      if (userDropdownToggle) {
        // Render profile icon logo centered inside circular radius badge
        userDropdownToggle.innerHTML = `
          <div class="user-avatar-badge" title="Profile: ${userName}">
            <i class="fas fa-user user-profile-icon"></i>
          </div>
        `;
        userDropdownToggle.style.textDecoration = 'none';
        userDropdownToggle.style.border = 'none';
      }

      if (dropdownMenu) {
        // Show the user's name inside dropdown header when clicked
        dropdownMenu.innerHTML = `
          <li class="user-dropdown-header">
            <div class="user-avatar-circle">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-details">
              <span class="user-welcome">Logged in as</span>
              <strong class="user-name">${userName}</strong>
            </div>
          </li>
          <li><a class="dropdown-item" href="painting.html"><i class="fas fa-store"></i> Shop Gallery</a></li>
          <li><a class="dropdown-item" href="cart.html"><i class="fas fa-shopping-cart"></i> My Cart <span class="badge bg-primary" data-cart-count>0</span></a></li>
          <li class="dropdown-divider-custom"></li>
          <li><button class="dropdown-item text-danger" id="logoutBtn" type="button"><i class="fas fa-sign-out-alt"></i> Logout</button></li>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function () {
            window.logoutUser();
          });
        }
      }
    }
  }

  function setupImageFallbacks() {
    // Standard high quality art fallback image
    const fallbackImage = 'assets/images/WhatsApp Image 2026-01-05 at 23.55.14.jpeg';
    
    document.querySelectorAll('img').forEach(function (img) {
      // Add error event listener
      img.addEventListener('error', function () {
        if (this.src !== fallbackImage) {
          this.src = fallbackImage;
        }
      });

      // Check for empty or malformed double URLs
      if (!img.src || img.src.includes('jpghttps://') || img.src.includes('jpeghttps://') || img.src.includes('pnghttps://')) {
        img.src = fallbackImage;
      }
    });
  }
})();
