class SeethosDashboard {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.userBtn = document.getElementById('userBtn');
    this.userDropdown = document.getElementById('userDropdown');
    this.notificationBtn = document.getElementById('notificationBtn');
    this.notificationBadge = document.querySelector('.notification-badge');
    this.pageContent = document.getElementById('pageContent');
    this.overlay = document.getElementById('overlay');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.currentPage = null;
    this.isSidebarCollapsed = false;
    this.isMobile = window.innerWidth <= 768;
    this.notificationCount = 1;

    this.init();
  }

  init() {
    this.bindEvents();
    this.checkMobile();
    this.handleInitialRouting();
    this.updateNotificationBadge();
  }

  bindEvents() {
    this.sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
    this.mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());
    this.userBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleUserDropdown();
    });
    this.notificationBtn?.addEventListener('click', () => this.handleNotificationClick());
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(link.dataset.page);
      });
    });
    this.overlay?.addEventListener('click', () => this.closeMobileMenu());
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'dashboard';
      this.navigateToPage(page, false);
    });
  }

  toggleSidebar() {
    if (this.isMobile) return;
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebar.classList.toggle('collapsed', this.isSidebarCollapsed);
    localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed);
  }

  toggleMobileMenu() {
    if (!this.isMobile) return;
    this.sidebar.classList.toggle('mobile-show');
    this.overlay.classList.toggle('show');
    document.body.style.overflow = this.sidebar.classList.contains('mobile-show') ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.sidebar.classList.remove('mobile-show');
    this.overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  toggleUserDropdown() {
    this.userDropdown.classList.toggle('show');
  }

  handleNotificationClick() {
    if (this.notificationCount > 0) {
      this.notificationCount = 0;
      this.updateNotificationBadge();
      alert('Notifications panel would open here');
    }
  }

  updateNotificationBadge() {
    if (!this.notificationBadge) return;
    this.notificationBadge.textContent = this.notificationCount > 0 ? this.notificationCount : '';
    this.notificationBadge.style.display = this.notificationCount > 0 ? 'flex' : 'none';
  }

  navigateToPage(page, pushState = true) {
    if (this.currentPage === page && this.currentPage !== null) return;

    this.currentPage = page;
    this.updateActiveNavigation(page);
    this.loadPageAssets(`css/${page}.css`, `js/${page}.js`);

    if (this.isMobile) this.closeMobileMenu();
    if (pushState) history.pushState({ page }, '', `#${page}`);
  }

  updateActiveNavigation(page) {
    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  loadPageAssets(cssPath, jsPath) {
    this.showLoading();
    const pageHtml = `pages/${this.currentPage}.html`;

    // Remove previous dynamic assets
    document.querySelectorAll('.dynamic-loaded').forEach(el => el.remove());

    fetch(pageHtml)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${this.currentPage}.html`);
        return response.text();
      })
      .then(html => {
        this.renderPageContent(html);
        this.loadPageCSS(cssPath);
        this.loadPageJS(jsPath);
      })
      .catch(error => {
        this.showErrorPage(error);
        console.error('Page load error:', error);
      });
  }

  loadPageCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.classList.add('dynamic-loaded');
    document.head.appendChild(link);
  }

  loadPageJS(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.classList.add('dynamic-loaded');

    // ✅ Run init function after script loads
    script.onload = () => {
      const pageInitFunc = `init${this.currentPage.charAt(0).toUpperCase()}${this.currentPage.slice(1)}Page`;
      if (typeof window[pageInitFunc] === 'function') {
        window[pageInitFunc]();
      }
    };

    document.body.appendChild(script);
  }


  showLoading() {
    this.pageContent.innerHTML = `
      <div class="content-loading">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>`;
  }

  showErrorPage(error) {
    this.pageContent.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Error</h1>
        <p class="page-subtitle">${error.message}</p>
      </div>`;
  }

  renderPageContent(html) {
    this.pageContent.innerHTML = html;
    this.pageContent.classList.add('fade-in');
    setTimeout(() => this.pageContent.classList.remove('fade-in'), 300);
  }

  handleOutsideClick(e) {
    if (!e.target.closest('.user-menu') && this.userDropdown.classList.contains('show')) {
      this.userDropdown.classList.remove('show');
    }
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      this.checkMobile();
    }
  }

  checkMobile() {
    if (this.isMobile) {
      this.sidebar.classList.add('mobile-hidden');
      this.sidebar.classList.remove('collapsed');
    } else {
      this.sidebar.classList.remove('mobile-hidden', 'mobile-show');
      this.overlay.classList.remove('show');
      document.body.style.overflow = '';

      if (localStorage.getItem('sidebarCollapsed') === 'true') {
        this.isSidebarCollapsed = true;
        this.sidebar.classList.add('collapsed');
      }
    }
  }

  handleKeyboard(e) {
    if (e.key === 'Escape') {
      if (this.userDropdown.classList.contains('show')) {
        this.userDropdown.classList.remove('show');
      }

      if (this.isMobile && this.sidebar.classList.contains('mobile-show')) {
        this.closeMobileMenu();
      }
    }
  }

  handleInitialRouting() {
    const pageFromHash = window.location.hash.slice(1);
    this.navigateToPage(pageFromHash || 'dashboard', false);
  }
}

// Global init + transition styles
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .content-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 1rem;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #7986ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Start the app
  window.dashboard = new SeethosDashboard();
});
