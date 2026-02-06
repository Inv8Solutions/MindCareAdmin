<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['login'])
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const submit = () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password.'
    return
  }
  // Placeholder: replace with real auth call
  console.log('login', { email: email.value })
  emit('login')
  router.push({ name: 'Dashboard' })
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
    <div>
      <label class="block text-sm font-medium text-green-800 mb-1">Email</label>
      <input
        type="email"
        v-model="email"
        placeholder="admin@example.com"
        class="w-full px-3 py-2 border border-green-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-green-800 mb-1">Password</label>
      <input
        type="password"
        v-model="password"
        placeholder="••••••••"
        class="w-full px-3 py-2 border border-green-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Sign in
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </form>
</template>
