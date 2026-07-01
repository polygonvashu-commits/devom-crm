import { renderDashboard } from './components/dashboard.js';
import { renderLeadsTable } from './components/leadTable.js';
import { renderKanbanBoard } from './components/kanban.js';
import { renderAgentPanel } from './components/agentPanel.js';
import { renderSourcesPanel } from './components/sources.js';
import { initScrollAnimations } from './utils/animations.js';

// Authentication State
let isAuthenticated = false;

// Router mappings
const routes = {
  dashboard: { title: "Executive Dashboard", render: renderDashboard },
  leads: { title: "Lead Management Hub", render: renderLeadsTable },
  pipeline: { title: "Sales Pipeline Kanban", render: renderKanbanBoard },
  agents: { title: "Agent Assignment & Performance", render: renderAgentPanel },
  sources: { title: "Omni-Channel Lead Sources", render: renderSourcesPanel }
};

function navigate() {
  if (!isAuthenticated) {
    renderLogin();
    return;
  }

  const hash = window.location.hash.replace('#', '') || 'dashboard';
  
  if (hash === 'logout') {
    isAuthenticated = false;
    sessionStorage.removeItem('devom_current_user');
    window.location.hash = '';
    renderLogin();
    return;
  }

  // RBAC Access Restriction
  const currentUser = JSON.parse(sessionStorage.getItem('devom_current_user') || '{}');
  const container = document.getElementById('view-container');
  const viewTitle = document.getElementById('view-title');

  if (hash === 'agents' && !currentUser.isSudo) {
    if (viewTitle) viewTitle.textContent = "Access Denied";
    if (container) {
      container.innerHTML = `
        <div class="card" style="padding: 40px; text-align: center;">
          <div style="font-size: 48px; color: var(--status-lost); margin-bottom: 20px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <h3 style="font-family: var(--font-headline); font-size: 24px; color: var(--text-light); margin-bottom: 12px;">Restricted View</h3>
          <p style="color: var(--text-muted); font-size: 14px; max-width: 400px; margin: 0 auto; line-height: 1.6;">
            The Agent Engine performance console and manual reassignment overrides are restricted to Owner/Sudo Administrators only.
          </p>
        </div>
      `;
    }
    return;
  }

  const route = routes[hash];
  if (!container) return;

  if (route) {
    // 1. Update Title Header
    if (viewTitle) viewTitle.textContent = route.title;

    // 2. Render Component
    route.render(container);

    // 3. Highlight Sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
      if (item.dataset.page === hash) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 4. Trigger Entry animations
    initScrollAnimations();
  } else {
    container.innerHTML = `<div class="card"><h3 style="font-family: var(--font-headline);">404 — Page Not Found</h3><p>The requested route does not exist.</p></div>`;
  }
}

function renderLogin() {
  const loginRoot = document.getElementById('login-root');
  const appRoot = document.getElementById('app-root');
  if (!loginRoot || !appRoot) return;

  loginRoot.style.display = 'flex';
  appRoot.style.display = 'none';

  loginRoot.innerHTML = `
    <div style="width: 100vw; height: 100vh; background: radial-gradient(circle at 50% 50%, #0F2942 0%, #091B2E 100%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      
      <!-- Abstract Premium Gold Lines background decoration -->
      <div style="position: absolute; width: 100%; height: 100%; opacity: 0.04; pointer-events: none; background-image: radial-gradient(circle at 100% 0%, var(--accent-color) 1px, transparent 1px), radial-gradient(circle at 0% 100%, var(--accent-color) 1px, transparent 1px); background-size: 40px 40px;"></div>

      <!-- Glassmorphic Login Card -->
      <div class="card" style="width: 420px; padding: 40px; background: rgba(15, 41, 66, 0.85); border: 1px solid var(--glass-border); box-shadow: 0 20px 50px rgba(9, 27, 46, 0.6); display: flex; flex-direction: column; align-items: center; animation: loginCardIn 0.8s var(--ease-expo) forwards; transform: translateZ(0);">
        
        <h1 style="font-family: var(--font-headline); font-size: 28px; color: var(--accent-color); text-align: center; margin-bottom: 4px; font-weight: 700; letter-spacing: 1px;">DEV OM Group</h1>
        <span style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 3px; margin-bottom: 24px;">LUXURY REAL ESTATE CRM</span>
        
        <form id="login-form" style="width: 100%; display: flex; flex-direction: column; gap: 16px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label for="login-email">Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="name@devomgroup.in" required style="width: 100%;">
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required style="width: 100%;">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-top: 4px;">
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--text-muted);">
              <input type="checkbox" checked style="accent-color: var(--accent-color); cursor: pointer;"> Remember Me
            </label>
            <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color='var(--text-muted)'">Forgot Password?</a>
          </div>

          <div id="login-error-msg" style="display: none; color: var(--status-lost); font-size: 12px; text-align: center; font-weight: 500; margin-top: 4px;">
            <i class="fa-solid fa-circle-exclamation"></i> Invalid Email or Password.
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 10px; padding: 12px;">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Dashboard
          </button>
        </form>
        
        <div style="margin-top: 24px; border-top: 1px solid rgba(240,244,248,0.08); padding-top: 16px; width: 100%; text-align: center;">
          <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Demo Credentials</span>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px; text-align: left; background: rgba(0,0,0,0.15); padding: 10px; border-radius: 6px; border: 1px solid rgba(240,244,248,0.05);">
            <div><strong>Sudo Admin:</strong> <span style="color: var(--accent-color);">naveen.rathee@devomgroup.in</span> / admin123</div>
            <div><strong>Agent:</strong> <span style="color: var(--status-new);">priya.sharma@devomgroup.in</span> / agent123</div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Add card animation
  const style = document.createElement('style');
  style.id = 'login-styles';
  style.innerHTML = `
    @keyframes loginCardIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');

    let currentUser = null;

    if (email === 'naveen.rathee@devomgroup.in' && password === 'admin123') {
      currentUser = {
        name: "Naveen Rathee",
        role: "Super Administrator",
        avatar: "NR",
        email: "naveen.rathee@devomgroup.in",
        isSudo: true
      };
    } else if (email === 'priya.sharma@devomgroup.in' && password === 'agent123') {
      currentUser = {
        name: "Priya Sharma",
        role: "Sales Agent",
        avatar: "PS",
        email: "priya.sharma@devomgroup.in",
        isSudo: false
      };
    }

    if (!currentUser) {
      if (errorMsg) errorMsg.style.display = 'block';
      return;
    }

    // Save in session
    sessionStorage.setItem('devom_current_user', JSON.stringify(currentUser));

    // Update Layout Profile Info
    document.getElementById('current-user-avatar').textContent = currentUser.avatar;
    document.getElementById('current-user-name').textContent = currentUser.name;
    document.querySelector('.sidebar-profile p').textContent = currentUser.role;

    // Set Sidebar Agent link visibility
    const agentLink = document.querySelector('.sidebar-item[data-page="agents"]');
    if (agentLink) {
      agentLink.style.display = currentUser.isSudo ? 'block' : 'none';
    }

    // Animate transition out
    const card = loginRoot.querySelector('.card');
    card.style.animation = 'loginCardOut 0.5s var(--ease-expo) forwards';
    
    const outStyle = document.createElement('style');
    outStyle.innerHTML = `
      @keyframes loginCardOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(-30px) scale(0.95); }
      }
    `;
    document.head.appendChild(outStyle);

    setTimeout(() => {
      isAuthenticated = true;
      loginRoot.style.display = 'none';
      appRoot.style.display = 'flex';
      style.remove();
      outStyle.remove();
      navigate(); // trigger router navigation
    }, 500);
  });
}

// Bind router events
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  // If session is already open, auto-login
  const sessionUserStr = sessionStorage.getItem('devom_current_user');
  if (sessionUserStr) {
    const user = JSON.parse(sessionUserStr);
    isAuthenticated = true;
    
    document.getElementById('current-user-avatar').textContent = user.avatar;
    document.getElementById('current-user-name').textContent = user.name;
    document.querySelector('.sidebar-profile p').textContent = user.role;

    const agentLink = document.querySelector('.sidebar-item[data-page="agents"]');
    if (agentLink) {
      agentLink.style.display = user.isSudo ? 'block' : 'none';
    }
  }

  navigate();

  // Bind close drawer listener
  const drawer = document.getElementById('detail-drawer');
  const closeBtn = document.getElementById('close-drawer');
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  // Bind logout click
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isAuthenticated = false;
      sessionStorage.removeItem('devom_current_user');
      window.location.hash = '';
      renderLogin();
    });
  }

  // Bind sidebar toggle on mobile
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking main content
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
      }
    });

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
      });
    });
  }
});
