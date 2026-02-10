<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { getDocs, collection } from 'firebase/firestore'

// Types
interface AdminUser {
  email: string
  role?: string
  permissions?: string[]
  active?: boolean
  lastLogin?: { seconds: number }
  [key: string]: unknown
}

const emit = defineEmits(['login'])
const router = useRouter()

const email = ref('')
const password = ref('') // currently unused when authenticating via Firestore
const error = ref('')
const loading = ref(false)

const submit = async () => {
  if (loading.value) return

  error.value = ''
  loading.value = true

  try {
    if (!email.value) {
      error.value = 'Please enter an email.'
      return
    }

    const adminsSnap = await getDocs(collection(db, 'admins'))
    let foundData: AdminUser | null = null

    adminsSnap.forEach((d: { data: () => unknown }) => {
      const data = d.data() as AdminUser
      if (data?.email && String(data.email).toLowerCase() === email.value.toLowerCase()) {
        foundData = data
      }
    })

    if (!foundData) {
      error.value = 'Access denied. You are not authorized as an administrator.'
      return
    }
    if (foundData && (foundData as AdminUser).active === false) {
      error.value = 'Your administrator account has been deactivated. Please contact support.'
      return
    }

    // Simple local session (replace with secure flow in production)
    try {
      const session = {
        email: (foundData as AdminUser).email,
        role: (foundData as AdminUser).role ?? 'admin',
      }
      localStorage.setItem('adminSession', JSON.stringify(session))
    } catch (e) {
      console.warn('Failed to persist admin session locally:', e)
    }

    emit('login')
    await router.push({ name: 'Dashboard' })
  } catch (err) {
    console.error('Login error while querying admins collection:', err)
    error.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const now = new Date()
const hour = now.getHours()
const greeting = computed(() =>
  hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening',
)
const motd = ref('All systems operational — no incidents reported.')
</script>

<template>
  <form
    class="space-y-4 max-w-md mx-auto p-6 bg-green-50 border border-green-100 rounded-lg shadow-sm"
    @submit.prevent="submit"
  >
    <div class="text-center mb-2">
      <h1 class="text-2xl font-semibold text-green-800">MindCare Admin</h1>
      <p class="text-sm text-green-700 mt-1">
        {{ greeting }}, <span class="font-medium">Administrator</span>
      </p>
      <p class="text-xs text-green-600 mt-2">{{ motd }}</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <span class="text-red-400">⚠️</span>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-green-800 mb-1">Email</label>
      <input
        type="email"
        v-model="email"
        placeholder="admin@example.com"
        :disabled="loading"
        autocomplete="email"
        class="w-full px-3 py-2 border border-green-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-green-800 mb-1">Password</label>
      <input
        type="password"
        v-model="password"
        placeholder="••••••••"
        :disabled="loading"
        autocomplete="current-password"
        class="w-full px-3 py-2 border border-green-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <svg
          v-if="loading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>

    <!-- Additional Security Info -->
    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <span class="text-blue-400">🛡️</span>
        </div>
        <div class="ml-3">
          <p class="text-xs text-blue-600">
            Access requires administrative privileges. Only authorized personnel may proceed.
          </p>
        </div>
      </div>
    </div>
  </form>
</template>
