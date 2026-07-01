// ─── DEV OM Group CRM — Sidebar Navigation Component ─────────────────────────
// Renders the vertical sidebar with navigation, branding, and user profile.
// Supports mobile hamburger toggle and responsive behavior.

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>`
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`
  },
  {
    id: 'sources',
    label: 'Sources',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></svg>`
  }
];

/**
 * Returns the current active route id from the URL hash.
 * Defaults to 'dashboard' if no hash is set.
 */
function getActiveRoute() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'dashboard';
}

/**
 * Builds the complete sidebar HTML string.
 */
function buildSidebarHTML() {
  const activeRoute = getActiveRoute();

  const navItemsHTML = navItems.map(item => {
    const isActive = item.id === activeRoute;
    return `
      <div class="sidebar-nav-item ${isActive ? 'active' : ''}" data-route="${item.id}" role="button" tabindex="0" aria-label="Navigate to ${item.label}">
        <span class="sidebar-nav-icon">${item.icon}</span>
        <span class="sidebar-nav-label">${item.label}</span>
        ${isActive ? '<span class="sidebar-active-indicator"></span>' : ''}
      </div>
    `;
  }).join('');

  return `
    <!-- Mobile Hamburger Toggle -->
    <button class="sidebar-hamburger" id="sidebar-hamburger" aria-label="Toggle navigation menu">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Logo / Branding Section -->
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
            <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#logoGrad)" opacity="0.15"/>
            <path d="M12 28V14l8-4 8 4v14l-8 4-8-4z" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 14l8 4 8-4" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="20" y1="18" x2="20" y2="32" stroke="#C5A059" stroke-width="1.5"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#C5A059"/>
                <stop offset="100%" stop-color="#D4B068"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="sidebar-brand-text">
          <h1 class="sidebar-brand-name">DEV OM Group</h1>
          <p class="sidebar-brand-tagline">Premium Real Estate CRM</p>
        </div>
      </div>
    </div>

    <!-- Navigation Items -->
    <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">
      ${navItemsHTML}
    </nav>

    <!-- User Profile Section -->
    <div class="sidebar-user-section">
      <div class="sidebar-user-profile">
        <div class="sidebar-user-avatar">NR</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">Naveen Rathee</span>
          <span class="sidebar-user-role">Admin</span>
        </div>
      </div>
      <button class="sidebar-logout-btn" id="sidebar-logout-btn" aria-label="Logout">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Renders the sidebar into the #sidebar element.
 */
export function renderSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;
  sidebarEl.innerHTML = buildSidebarHTML();
}

/**
 * Updates the active state of nav items without a full re-render.
 */
function updateActiveState() {
  const activeRoute = getActiveRoute();
  const navItemEls = document.querySelectorAll('.sidebar-nav-item');

  navItemEls.forEach(item => {
    const route = item.getAttribute('data-route');
    const isActive = route === activeRoute;

    if (isActive) {
      item.classList.add('active');
      // Add indicator if not already present
      if (!item.querySelector('.sidebar-active-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'sidebar-active-indicator';
        item.appendChild(indicator);
      }
    } else {
      item.classList.remove('active');
      const indicator = item.querySelector('.sidebar-active-indicator');
      if (indicator) indicator.remove();
    }
  });
}

/**
 * Closes the sidebar on mobile by removing the 'open' class.
 */
function closeSidebarMobile() {
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) {
    sidebarEl.classList.remove('open');
  }
}

/**
 * Initializes sidebar event listeners:
 * - Nav item click/keyboard handlers
 * - Mobile hamburger toggle
 * - Click-outside-to-close on mobile
 * - Hash change listener
 * - Logout button
 */
export function initSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  // ── Navigation item click delegation ──
  sidebarEl.addEventListener('click', (e) => {
    const navItem = e.target.closest('.sidebar-nav-item');
    if (navItem) {
      const route = navItem.getAttribute('data-route');
      if (route) {
        window.location.hash = `#${route}`;
        updateActiveState();
        closeSidebarMobile();
      }
      return;
    }
  });

  // ── Keyboard support for nav items (Enter / Space) ──
  sidebarEl.addEventListener('keydown', (e) => {
    const navItem = e.target.closest('.sidebar-nav-item');
    if (navItem && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const route = navItem.getAttribute('data-route');
      if (route) {
        window.location.hash = `#${route}`;
        updateActiveState();
        closeSidebarMobile();
      }
    }
  });

  // ── Mobile hamburger toggle ──
  const hamburgerBtn = document.getElementById('sidebar-hamburger');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebarEl.classList.toggle('open');
    });
  }

  // ── Click outside sidebar on mobile to close ──
  document.addEventListener('click', (e) => {
    const isMobileView = window.innerWidth <= 768;
    if (!isMobileView) return;

    const isOpen = sidebarEl.classList.contains('open');
    if (!isOpen) return;

    const clickedInsideSidebar = sidebarEl.contains(e.target);
    const clickedHamburger = hamburgerBtn && hamburgerBtn.contains(e.target);

    if (!clickedInsideSidebar && !clickedHamburger) {
      closeSidebarMobile();
    }
  });

  // ── Listen for hash changes to update active state ──
  window.addEventListener('hashchange', () => {
    updateActiveState();
  });

  // ── Logout button ──
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // In a real app, this would clear session and redirect.
      // For the CRM demo, we show a confirmation and reset to dashboard.
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        window.location.hash = '#dashboard';
        updateActiveState();
      }
    });
  }

  // ── Close sidebar when window resizes above mobile breakpoint ──
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebarEl.classList.remove('open');
    }
  });
}
