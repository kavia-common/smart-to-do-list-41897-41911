<script setup lang="ts">
/* Home view simply hosts the To-Do UI defined in App.vue layout */
</script>

<template>
  <main aria-label="Home">
    <!-- The App shell renders the full To-Do UI; this view remains minimal by design -->
    <section class="welcome-note">
      <p>
        Use the header controls to manage your tasks. This space intentionally left simple for SPA layout.
      </p>
    </section>
  </main>
</template>

<style scoped>
main {
  padding: .5rem;
}

.welcome-note {
  display: none;
}
</style>
