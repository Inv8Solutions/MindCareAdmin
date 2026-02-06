<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { db } from '@/firebase'
import { collection, query as q, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { useRouter } from 'vue-router'

// rawQuery stores only digits used for searching; displayQuery shows formatted value with dashes
const rawQuery = ref('')
const displayQuery = ref('')
const results = ref<
  Array<{ id: string; fullName: string; academicProgram?: string; schoolId?: string }>
>([])
const loading = ref(false)
const error = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const searching = computed(() => rawQuery.value.length > 0)

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

const fetchBySchoolId = async (term: string) => {
  loading.value = true
  error.value = ''
  try {
    // Use a prefix range query to find schoolId starting with the term
    // term supplied here is raw digits; convert to formatted XX-XXXX-XXX which matches stored schoolId
    const formatted = formatDisplay(term)
    const start = formatted
    const end = formatted + '\uf8ff'
    const usersCol = collection(db, 'users')
    const qry = q(
      usersCol,
      where('schoolId', '>=', start),
      where('schoolId', '<=', end),
      orderBy('schoolId'),
      limit(50),
    )
    const snap = await getDocs(qry)
    results.value = snap.docs.map((d) => {
      const data: any = d.data()
      return {
        id: d.id,
        fullName: data.fullName ?? data.name ?? data.displayName ?? 'Unnamed',
        academicProgram: data.academicProgram ?? data.program ?? '',
        schoolId: data.schoolId,
      }
    })
  } catch (err: any) {
    results.value = []
    error.value = err?.message ?? 'Failed to query Firestore'
  } finally {
    loading.value = false
  }
}

// format raw digits into XX-XXXX-XXX
const formatDisplay = (digits: string) => {
  const a = digits.slice(0, 2)
  const b = digits.slice(2, 6)
  const c = digits.slice(6, 9)
  return [a, b, c].filter(Boolean).join('-')
}

const onInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  // remove non-digits
  const digits = v.replace(/\D/g, '').slice(0, 9)
  rawQuery.value = digits
  displayQuery.value = formatDisplay(digits)
  // trigger search using raw digits
  triggerSearch()
}

const triggerSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!rawQuery.value) {
      results.value = []
      loading.value = false
      return
    }
    fetchBySchoolId(rawQuery.value.trim())
  }, 300)
}

// router for navigation to details
const router = useRouter()

const goToDetails = (docId: string) => {
  router.push({ name: 'StudentDetails', params: { id: docId } })
}
</script>

<template>
  <div class="lookup-root">
    <div class="controls">
      <input
        type="search"
        :value="displayQuery"
        placeholder="Search by ID (XX-XXXX-XXX)"
        @input="onInput"
      />
      <div v-if="loading" class="text-sm text-gray-500 mt-2">Searching...</div>
      <div v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</div>
    </div>

    <div class="results">
      <p v-if="!searching">Enter a search term to find students.</p>
      <ul v-else>
        <li
          v-for="r in results"
          :key="r.id"
          class="cursor-pointer hover:bg-gray-50 p-2 rounded"
          @click="goToDetails(r.id)"
        >
          <strong>{{ r.fullName }}</strong>
          <div class="meta">Program: {{ r.academicProgram || '—' }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.lookup-root .controls {
  margin-bottom: 0.75rem;
}

input[type='search'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
}

.results ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
}

.results li {
  padding: 0.6rem;
  border-radius: 6px;
  background: #fbfbfb;
  border: 1px solid #f0f0f0;
}

.meta {
  font-size: 0.85rem;
  color: #666;
}
</style>
