<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isChildRoute = computed(() => {
  const p = route.path
  return p.includes('lookup') || p.includes('student')
})

const kpis = [
  { label: 'Low Risk', value: 1078, percent: 25, color: 'bg-emerald-400' },
  { label: 'Medium', value: 527, percent: 2, color: 'bg-amber-400' },
  { label: 'High', value: 291, percent: 151.23, color: 'bg-red-400' },
  { label: 'Learners with Special Needs', value: 127, percent: 0, color: 'bg-violet-500' },
]

const departments = [
  { code: 'CITCS', total: 325, low: 218, mid: 98, high: 43 },
  { code: 'BFE', total: 366, low: 218, mid: 86, high: 67 },
  { code: 'BBA', total: 586, low: 63, mid: 88, high: 55 },
  { code: 'CON', total: 161, low: 60, mid: 88, high: 26 },
  { code: 'CEA', total: 0, low: 0, mid: 0, high: 0 },
]

const handleLogout = async () => {
  try {
    localStorage.removeItem('authToken')
    sessionStorage.clear()
    await router.push('/login')
  } catch (err) {
    // swallow, log

    console.error(err)
  }
}
</script>

<template>
  <section class="dashboard-root">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">🧠</div>
          <div class="logo-text">
            <h2 class="app-name">MindCare</h2>
            <p class="app-subtitle">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-section-title">Navigation</h3>
          <router-link
            to="/dashboard"
            class="nav-item"
            :class="{
              active: !$route.path.includes('lookup'),
            }"
          >
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Overview</span>
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

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar"><span class="avatar-text">AD</span></div>
          <div class="user-info">
            <p class="user-name">Admin User</p>
            <p class="user-role">System Administrator</p>
          </div>
        </div>

        <div class="sidebar-actions">
          <button class="action-btn" title="Notifications">🔔</button>
          <button class="action-btn logout-btn" title="Logout" @click="handleLogout">🚪</button>
        </div>
      </div>
    </aside>

    <section class="main">
      <div class="main-header">
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item current">Overview</span>
        </div>
        <div class="header-actions">
          <button class="header-btn">🔄 Refresh</button>
          <button class="header-btn primary">➕ New</button>
        </div>
      </div>

      <div class="main-content">
        <div v-if="isChildRoute">
          <router-view></router-view>
        </div>

        <div v-else>
          <!-- KPI row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              v-for="k in kpis"
              :key="k.label"
              class="bg-white p-4 rounded shadow flex items-center justify-between"
            >
              <div>
                <div class="text-sm text-gray-500">{{ k.label }}</div>
                <div class="text-2xl font-bold text-gray-800">{{ k.value.toLocaleString() }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ k.percent }}%</div>
              </div>
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="k.color"
              ></div>
            </div>
          </div>

          <!-- Department table -->
          <div class="bg-white rounded shadow p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Assessment Participation by Department</h3>
              <select class="border rounded px-2 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-xs text-gray-500 uppercase">
                    <th class="py-2">Department</th>
                    <th class="py-2">Total Students</th>
                    <th class="py-2">Low Risk</th>
                    <th class="py-2">Mid Risk</th>
                    <th class="py-2">High Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in departments" :key="d.code" class="border-t">
                    <td class="py-3 font-medium">{{ d.code }}</td>
                    <td class="py-3">{{ d.total }}</td>
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-40 bg-gray-100 rounded h-3 overflow-hidden">
                          <div
                            class="h-3 bg-emerald-400"
                            :style="{ width: (d.low / (d.total || 1)) * 100 + '%' }"
                          ></div>
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ d.low }} ({{ Math.round((d.low / (d.total || 1)) * 100) }}%)
                        </div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-40 bg-gray-100 rounded h-3 overflow-hidden">
                          <div
                            class="h-3 bg-amber-400"
                            :style="{ width: (d.mid / (d.total || 1)) * 100 + '%' }"
                          ></div>
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ d.mid }} ({{ Math.round((d.mid / (d.total || 1)) * 100) }}%)
                        </div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-40 bg-gray-100 rounded h-3 overflow-hidden">
                          <div
                            class="h-3 bg-red-400"
                            :style="{ width: (d.high / (d.total || 1)) * 100 + '%' }"
                          ></div>
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ d.high }} ({{ Math.round((d.high / (d.total || 1)) * 100) }}%)
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bottom row: pie, donut, bars -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="bg-white rounded shadow p-6">
              <h4 class="font-semibold mb-4">Overall Risk Distribution</h4>
              <div class="flex items-center gap-6">
                <svg width="120" height="120" viewBox="0 0 36 36" class="rounded-full">
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831A15.9155 15.9155 0 1 0 18 2.0845"
                    fill="#10b981"
                  ></path>
                </svg>
                <div>
                  <div class="text-2xl font-bold">50%</div>
                  <div class="text-sm text-gray-500">Low Risk Distribution</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded shadow p-6 flex flex-col items-center justify-center">
              <h4 class="font-semibold mb-2">Survey Assessment Status</h4>
              <div
                class="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-100 to-blue-300 flex items-center justify-center text-2xl font-bold"
              >
                82%
              </div>
              <div class="text-sm text-gray-500 mt-3">Students who took assessment</div>
            </div>

            <div class="bg-white rounded shadow p-6">
              <h4 class="font-semibold mb-4">Detailed Engagement Report</h4>
              <div class="flex items-end gap-6">
                <div class="text-center">
                  <div class="h-36 w-16 bg-blue-500 rounded-t"></div>
                  <div class="text-sm mt-2">1,420</div>
                  <div class="text-xs text-gray-500">Signed In</div>
                </div>
                <div class="text-center">
                  <div class="h-28 w-16 bg-blue-300 rounded-t"></div>
                  <div class="text-sm mt-2">1,210</div>
                  <div class="text-xs text-gray-500">Took Assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}
.nav-text {
  flex: 1;
}
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
.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
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
}
.main {
  display: flex;
  flex-direction: column;
}
.main-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.breadcrumb {
  display: flex;
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
}
.header-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
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
    display: none;
  }
  .main-header {
    padding: 1rem;
  }
  .main-content {
    padding: 1rem;
  }
}
</style>
