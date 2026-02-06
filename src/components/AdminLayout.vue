<script setup lang="ts">
import AdminLogin from './AdminLogin.vue'
import StudentLookup from './StudentLookup.vue'
</script>

<template>
  <section class="admin-root">
    <div class="panel login">
      <h2>Admin Login</h2>
      <AdminLogin />
    </div>

    <div class="panel lookup">
      <h2>Student Lookup</h2>
      <StudentLookup />
    </div>
  </section>
</template>

<style scoped>
.admin-root {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  padding: 2rem;
}

.panel {
  background: var(--surface, #fff);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.panel h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
}

@media (max-width: 800px) {
  .admin-root {
    grid-template-columns: 1fr;
  }
}
</style>
