<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const getCurrentPageName = () => {
  const path = route.path
  if (path.includes('analytics')) return 'Analytics'
  if (path.includes('lookup')) return 'Student Lookup'
  return 'Overview'
}

const handleLogout = async () => {
  // Add your logout logic here (e.g., clear auth tokens, call logout API)
  try {
    // Clear any stored authentication data
    localStorage.removeItem('authToken')
    sessionStorage.clear()

    // Redirect to login page
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <section class="dashboard-root">
    <aside class="sidebar">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">🧠</div>
          <div class="logo-text">
            <h2 class="app-name">MindCare</h2>
            <p class="app-subtitle">Admin Panel</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-section-title">Navigation</h3>
          <router-link
            to="/dashboard/analytics"
            class="nav-item"
            :class="{ active: $route.path.includes('analytics') }"
          >
            <span class="nav-icon">📊</span>
            <span class="nav-text">Analytics</span>
          </router-link>

          <router-link
            to="/dashboard/lookup"
            class="nav-item"
            :class="{ active: $route.path.includes('lookup') }"
          >
            <span class="nav-icon">🔍</span>
            <span class="nav-text">Student Lookup</span>
          </router-link>
        </div>
      </nav>

      <!-- User Profile Section -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <span class="avatar-text">AD</span>
          </div>
          <div class="user-info">
            <p class="user-name">Admin User</p>
            <p class="user-role">System Administrator</p>
          </div>
          <button class="user-menu-btn" title="User Menu">⋮</button>
        </div>

        <div class="sidebar-actions">
          <button class="action-btn" title="Notifications">
            <span>🔔</span>
            <span class="notification-badge">3</span>
          </button>
          <button class="action-btn" title="Help & Support">
            <span>❓</span>
          </button>
          <button class="action-btn logout-btn" title="Logout" @click="handleLogout">
            <span>🚪</span>
          </button>
        </div>
      </div>
    </aside>

    <section class="main">
      <div class="main-header">
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item current">{{ getCurrentPageName() }}</span>
        </div>
        <div class="header-actions">
          <button class="header-btn">
            <span>🔄</span>
            Refresh
          </button>
          <button class="header-btn primary">
            <span>➕</span>
            New
          </button>
        </div>
      </div>

      <div class="main-content">
        <router-view />
      </div>
    </section>
  </section>
</template>

<style scoped>
.dashboard-root {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: #f8fafc;
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.logo-text {
  flex: 1;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.app-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

/* Navigation Styles */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin: 0 0 0.75rem 1.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  border: none;
  background: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-right: 3px solid #3b82f6;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #3b82f6;
}

.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu-btn {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #cbd5e1;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.action-btn.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1e293b;
}

/* Main Content Styles */
.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: #6b7280;
  font-weight: 500;
}

.breadcrumb-item.current {
  color: #1f2937;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.header-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-root {
    grid-template-columns: 240px 1fr;
  }

  .main-header {
    padding: 1rem 1.5rem;
  }

  .main-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-root {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none; /* You could implement a mobile drawer here */
  }

  .main-header {
    padding: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .header-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    display: none;
  }

  .header-actions {
    flex-wrap: wrap;
  }
}
</style>
