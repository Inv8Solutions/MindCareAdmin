<template>
  <section class="dashboard-root">
    <aside class="side">
      <div class="p-4">
        <nav class="flex flex-col space-y-2">
          <router-link to="/dashboard/analytics" class="text-sm text-green-600 hover:underline"
            >Analytics</router-link
          >
          <router-link to="/dashboard/lookup" class="text-sm text-green-600 hover:underline"
            >Lookup</router-link
          >
        </nav>
      </div>
    </aside>

    <section class="main">
      <div class="mb-4 flex items-center justify-between">
        <div class="text-sm text-gray-500">Dashboard</div>
      </div>

      <router-view />
    </section>
  </section>
</template>

<style scoped>
.dashboard-root {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.side {
  min-width: 0;
}

.main {
  min-width: 0;
}

@media (max-width: 800px) {
  .dashboard-root {
    grid-template-columns: 1fr;
  }
}
</style>
