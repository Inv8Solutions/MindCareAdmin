<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'

const route = useRoute()
const id = String(route.params.id ?? '')

const loading = ref(true)
const error = ref('')
const student = ref<Record<string, any> | null>(null)
const surveys = ref<Array<Record<string, any>>>([])
const surveysLoading = ref(false)
const surveysExpanded = ref(false)

const knownOrder = [
  'fullName',
  'name',
  'email',
  'phone',
  'schoolId',
  'academicProgram',
  'program',
  'dob',
  'status',
]

const personalFields = ['fullName', 'name', 'email', 'phone', 'dob']
const academicFields = ['schoolId', 'academicProgram', 'program', 'status']

const displayFields = () => {
  if (!student.value) return { personal: [], academic: [], other: [] }

  const personal: Array<{ label: string; value: any }> = []
  const academic: Array<{ label: string; value: any }> = []
  const other: Array<{ label: string; value: any }> = []
  const used = new Set<string>()

  // Process personal fields
  for (const key of personalFields) {
    if (student.value[key] !== undefined) {
      const label =
        key === 'fullName'
          ? 'Full Name'
          : key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
      personal.push({ label, value: student.value[key] })
      used.add(key)
    }
  }

  // Process academic fields
  for (const key of academicFields) {
    if (student.value[key] !== undefined) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
      academic.push({ label, value: student.value[key] })
      used.add(key)
    }
  }

  // Process remaining fields
  for (const [k, v] of Object.entries(student.value)) {
    if (used.has(k)) continue
    other.push({
      label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: v,
    })
  }

  return { personal, academic, other }
}

const fetchSurveys = async () => {
  if (!id) return

  surveysLoading.value = true
  try {
    const surveysRef = collection(db, 'users', id, 'initialProfileSurveys')
    const surveysSnap = await getDocs(surveysRef)
    surveys.value = surveysSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('Failed to load surveys:', err)
  } finally {
    surveysLoading.value = false
  }
}

const toggleSurveys = () => {
  surveysExpanded.value = !surveysExpanded.value
  if (surveysExpanded.value && surveys.value.length === 0) {
    fetchSurveys()
  }
}

const formatSurveyValue = (value: any): string => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object') {
    // Handle nested objects by showing key-value pairs
    const entries = Object.entries(value)
    if (entries.length === 0) return '—'
    return entries.map(([k, v]) => `${k}: ${v}`).join(', ')
  }
  return String(value)
}

const flattenSurveyData = (survey: Record<string, any>) => {
  const flattened: Array<{ label: string; value: any }> = []

  const processValue = (key: string, value: any, prefix = '') => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const label = fullKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/\./g, ' - ')

    if (value === null || value === undefined) {
      flattened.push({ label, value: '—' })
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      flattened.push({ label, value: String(value) })
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        flattened.push({ label, value: '—' })
      } else {
        flattened.push({ label, value: value.join(', ') })
      }
    } else if (typeof value === 'object') {
      // Recursively process nested objects
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        processValue(nestedKey, nestedValue, fullKey)
      }
    } else {
      flattened.push({ label, value: String(value) })
    }
  }

  for (const [key, value] of Object.entries(survey)) {
    if (key !== 'id' && key !== 'timestamp') {
      processValue(key, value)
    }
  }

  return flattened
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    if (!id) throw new Error('No student id')
    const dref = doc(db, 'users', id)
    const snap = await getDoc(dref)
    if (!snap.exists()) {
      throw new Error('Student not found')
    }
    student.value = snap.data()
  } catch (err: any) {
    error.value = err?.message ?? 'Failed to load student'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div v-if="loading" class="text-center py-8">
      <div class="text-lg text-gray-500">Loading student profile...</div>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <div class="text-lg text-red-600">{{ error }}</div>
    </div>
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-green-600">
              {{ (student?.fullName ?? student?.name ?? 'U').charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ student?.fullName ?? student?.name ?? 'Unnamed Student' }}
            </h1>
            <p class="text-gray-600">{{ student?.schoolId ?? 'No ID' }}</p>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 p-4 border-b">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div v-for="field in displayFields().personal" :key="field.label" class="space-y-1">
            <div class="text-sm font-medium text-gray-500">{{ field.label }}</div>
            <div class="text-base text-gray-900">{{ field.value ?? '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Academic Information -->
      <div class="bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 p-4 border-b">Academic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div v-for="field in displayFields().academic" :key="field.label" class="space-y-1">
            <div class="text-sm font-medium text-gray-500">{{ field.label }}</div>
            <div class="text-base text-gray-900">{{ field.value ?? '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Other Information -->
      <div v-if="displayFields().other.length > 0" class="bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 p-4 border-b">Additional Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div v-for="field in displayFields().other" :key="field.label" class="space-y-1">
            <div class="text-sm font-medium text-gray-500">{{ field.label }}</div>
            <div class="text-base text-gray-900">{{ field.value ?? '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Initial Profile Surveys -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-4 border-b">
          <button @click="toggleSurveys" class="flex items-center justify-between w-full text-left">
            <h3 class="text-lg font-semibold text-gray-900">Initial Profile Surveys</h3>
            <svg
              :class="{ 'transform rotate-180': surveysExpanded }"
              class="w-5 h-5 text-gray-500 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div v-if="surveysExpanded" class="p-4">
          <div v-if="surveysLoading" class="text-center py-4">
            <div class="text-gray-500">Loading surveys...</div>
          </div>
          <div v-else-if="surveys.length === 0" class="text-center py-4">
            <div class="text-gray-500">No surveys found</div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(survey, index) in surveys"
              :key="survey.id"
              class="p-4 bg-gray-50 rounded-lg border"
            >
              <h4 class="font-medium text-gray-900 mb-3">
                Survey {{ index + 1 }}
                <span v-if="survey.timestamp" class="text-sm text-gray-500 font-normal">
                  ({{ new Date(survey.timestamp.seconds * 1000).toLocaleDateString() }})
                </span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="field in flattenSurveyData(survey)"
                  :key="field.label"
                  class="space-y-1"
                >
                  <div class="text-sm font-medium text-gray-600">{{ field.label }}</div>
                  <div class="text-sm text-gray-800">{{ field.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styling handled by Tailwind CSS */
</style>
