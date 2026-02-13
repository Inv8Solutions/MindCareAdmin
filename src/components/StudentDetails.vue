<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

// Type definitions
interface Student {
  fullName?: string
  name?: string
  email?: string
  phone?: string
  schoolId?: string
  academicProgram?: string
  program?: string
  dob?: string
  status?: string
  [key: string]: unknown
}

interface Survey {
  id: string
  timestamp?: {
    seconds: number
  }
  [key: string]: unknown
}

interface DisplayField {
  label: string
  value: unknown
}

const route = useRoute()
const id = String(route.params.id ?? '')

const loading = ref(true)
const error = ref('')
const student = ref<Student | null>(null)
const surveys = ref<Survey[]>([])
const surveysLoading = ref(false)
const surveysExpanded = ref(false)
const selfAssessments = ref<Survey[]>([])
const selfAssessmentsLoading = ref(false)
const riskLevel = ref<string | null>(null)
const riskLoading = ref(false)
// removed selfAssessmentsRiskEntries UI and loading refs (handled via `riskLevel`)

const riskBadgeClasses = computed(() => {
  const r = String(riskLevel.value ?? '').toLowerCase()
  const base = 'inline-flex items-center px-3 py-1 text-2xl font-semibold rounded'
  if (r === 'high') return [base, 'bg-red-100 text-red-800']
  if (r === 'medium') return [base, 'bg-orange-100 text-orange-800']
  if (r === 'low') return [base, 'bg-green-100 text-green-800']
  return [base, 'bg-gray-100 text-gray-700']
})

const personalFields = ['fullName', 'name', 'email', 'phone', 'dob']
const academicFields = ['schoolId', 'academicProgram', 'program', 'status']

const displayFields = () => {
  if (!student.value) return { personal: [], academic: [], other: [] }

  const personal: DisplayField[] = []
  const academic: DisplayField[] = []
  const other: DisplayField[] = []
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
  for (const [k, v] of Object.entries(student.value!)) {
    if (used.has(k)) continue
    other.push({
      label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: v,
    })
  }

  return { personal, academic, other }
}

const formatTimestamp = (ts: unknown): string => {
  if (!ts) return '—'
  try {
    let date: Date | null = null
    if (typeof ts === 'object' && ts !== null && 'seconds' in (ts as Record<string, unknown>)) {
      const seconds = (ts as { seconds: number }).seconds
      date = new Date(seconds * 1000)
    } else if (typeof ts === 'number') {
      date = new Date(ts)
    } else if (ts instanceof Date) {
      date = ts
    } else if (typeof ts === 'string') {
      date = new Date(ts)
    }

    if (date && !isNaN(date.getTime())) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
  } catch {
    // Fall through
  }
  return String(ts)
}

const fetchSurveys = async () => {
  if (!id) return

  surveysLoading.value = true
  try {
    const surveysRef = collection(db, 'users', id, 'initialProfileSurveys')
    const surveysSnap = await getDocs(surveysRef)
    surveys.value = surveysSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Survey)
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

const flattenSurveyData = (survey: Survey, showCreatedAt = false): DisplayField[] => {
  const flattened: DisplayField[] = []

  const keyLabelMap: Record<string, string> = {
    reminder_pref: 'Reminder Preference',
    role: 'Educational Attainment',
    stress_help: 'How do you cope with stress',
    living_with: 'Currently living with',
    age_range: 'Current age bracket',
    createdAt: 'Completed At',
    riskLevel: 'Risk Level',
    risk: 'Risk Level',
  }

  const processValue = (key: string, value: unknown, prefix = '') => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const leaf = String(fullKey).split('.').pop() || fullKey
    const leafLower = leaf.toLowerCase()

    // Skip created fields UNLESS showCreatedAt is true
    if (leafLower.includes('created') && !showCreatedAt) return

    // Prefer mapped human label for known keys
    const mapped = keyLabelMap[leaf]
    const label = mapped
      ? mapped
      : fullKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^./, (s) => s.toUpperCase())
          .replace(/\./g, ' - ')

    if (value === null || value === undefined) {
      flattened.push({ label, value: '—' })
    } else if (
      leafLower.includes('createdat') ||
      leafLower.includes('timestamp') ||
      leaf === 'createdAt'
    ) {
      // Format timestamp fields
      flattened.push({ label, value: formatTimestamp(value) })
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
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
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
    student.value = snap.data() as Student
    // fetch risk level after student loads
    fetchRiskLevel()
    // load selfAssessments documents for display under Initial Profile Surveys
    fetchSelfAssessments()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load student'
  } finally {
    loading.value = false
  }
})

const fetchSelfAssessments = async () => {
  if (!id) return
  selfAssessmentsLoading.value = true
  try {
    const refCol = collection(db, 'users', id, 'selfAssessments')
    const snap = await getDocs(refCol)
    selfAssessments.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Survey)
  } catch (err) {
    console.error('Failed to load selfAssessments:', err)
    selfAssessments.value = []
  } finally {
    selfAssessmentsLoading.value = false
  }
}

const fetchRiskLevel = async () => {
  if (!id) return
  riskLoading.value = true
  try {
    // 1) If the student document includes a riskLevel explicitly, use it
    const stud = student.value as Record<string, unknown> | null
    if (stud && stud.riskLevel !== undefined && stud.riskLevel !== null) {
      riskLevel.value = String(stud.riskLevel)
      return
    }

    // 2) Try the common case: query the latest selfAssessments doc ordered by `timestamp`
    try {
      const selfRef = collection(db, 'users', id, 'selfAssessments')
      const q = query(selfRef, orderBy('timestamp', 'desc'), limit(1))
      const sSnap = await getDocs(q)
      if (!sSnap.empty) {
        const firstDoc = sSnap.docs[0]
        if (firstDoc) {
          const sdata = firstDoc.data() as Record<string, unknown>
          if (Object.prototype.hasOwnProperty.call(sdata, 'riskLevel') && sdata.riskLevel != null) {
            riskLevel.value = String(sdata.riskLevel)
            return
          }
          if (Object.prototype.hasOwnProperty.call(sdata, 'risk') && sdata.risk != null) {
            riskLevel.value = String(sdata.risk)
            return
          }
        }
      }
    } catch (e) {
      // This can fail if `timestamp` isn't present or not indexed — fall back to scanning
      console.warn('Ordered selfAssessments lookup failed, will fall back to scanning:', e)
    }

    // 3) Fallback: scan all docs and pick the most recent doc that contains riskLevel/risk
    try {
      const selfRefAll = collection(db, 'users', id, 'selfAssessments')
      const allSnap = await getDocs(selfRefAll)
      let best: { value: string; seconds: number } | null = null
      allSnap.docs.forEach((d) => {
        const data = d.data() as Record<string, unknown>
        let candidate: string | null = null
        if (Object.prototype.hasOwnProperty.call(data, 'riskLevel') && data.riskLevel != null) {
          candidate = String(data.riskLevel)
        } else if (Object.prototype.hasOwnProperty.call(data, 'risk') && data.risk != null) {
          candidate = String(data.risk)
        }
        if (candidate) {
          const ts = data.timestamp as unknown
          let seconds = -Infinity
          if (
            typeof ts === 'object' &&
            ts !== null &&
            'seconds' in (ts as Record<string, unknown>)
          ) {
            const maybe = (ts as Record<string, unknown>)['seconds']
            if (typeof maybe === 'number') seconds = maybe
          } else if (typeof ts === 'number') {
            // assume milliseconds
            seconds = Math.floor((ts as number) / 1000)
          }
          if (!best || seconds > best.seconds) {
            best = { value: candidate, seconds }
          }
        }
      })
      if (best) {
        return
      }
    } catch (e) {
      console.warn('Scanning selfAssessments failed:', e)
    }

    // final fallback
    console.debug('No riskLevel found in student doc or selfAssessments')
    riskLevel.value = 'Unknown'
  } catch (err) {
    console.error('Failed to fetch risk level:', err)
    riskLevel.value = 'Unknown'
  } finally {
    riskLoading.value = false
  }
}

// removed unused helpers and scans for selfAssessments (risk is computed by `fetchRiskLevel`)
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
          <div class="flex-1 flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ student?.fullName ?? student?.name ?? 'Unnamed Student' }}
              </h1>
              <p class="text-gray-600">{{ student?.schoolId ?? 'No ID' }}</p>
            </div>

            <div class="ml-4 flex-shrink-0">
              <div v-if="riskLoading" class="text-sm text-gray-500">Checking risk…</div>
              <div v-else>
                <span v-if="riskLevel" :class="riskBadgeClasses">Risk: {{ riskLevel }}</span>
                <span v-else class="text-2xl text-gray-500">Risk: Unknown</span>
              </div>
            </div>
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
                  (Completed: {{ formatTimestamp(survey.timestamp) }})
                </span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="field in flattenSurveyData(survey, false)"
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

      <!-- Self Assessments (displayed below initial profile surveys) -->
      <div class="bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 p-4 border-b">Self Assessments</h3>
        <div class="p-4">
          <div v-if="selfAssessmentsLoading" class="text-center py-4">
            <div class="text-gray-500">Loading self-assessments...</div>
          </div>
          <div v-else-if="selfAssessments.length === 0" class="text-center py-4">
            <div class="text-gray-500">No self-assessments found</div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(s, idx) in selfAssessments"
              :key="s.id"
              class="p-4 bg-gray-50 rounded-lg border"
            >
              <h4 class="font-medium text-gray-900 mb-3">
                Self Assessment {{ idx + 1 }}
                <span v-if="s.timestamp || s.createdAt" class="text-sm text-gray-500 font-normal">
                  (Completed: {{ formatTimestamp(s.timestamp || s.createdAt) }})
                </span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="field in flattenSurveyData(s, true)"
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

      <!-- Self Assessments UI removed; riskLevel shown on header via fetchRiskLevel() -->
    </div>
  </div>
</template>

<style scoped>
/* All styling handled by Tailwind CSS */
</style>
