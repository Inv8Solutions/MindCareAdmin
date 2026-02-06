import { createRouter, createWebHistory } from 'vue-router'
import AdminLogin from '@/components/AdminLogin.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import StudentLookup from '@/components/StudentLookup.vue'
import AnalyticsPanel from '@/components/AnalyticsPanel.vue'
import StudentDetails from '@/components/StudentDetails.vue'

const routes = [
  { path: '/', name: 'Login', component: AdminLogin },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: AdminDashboard,
    children: [
      { path: '', redirect: 'analytics' },
      { path: 'analytics', name: 'Analytics', component: AnalyticsPanel },
      { path: 'lookup', name: 'Lookup', component: StudentLookup },
      { path: 'student/:id', name: 'StudentDetails', component: StudentDetails, props: true },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
