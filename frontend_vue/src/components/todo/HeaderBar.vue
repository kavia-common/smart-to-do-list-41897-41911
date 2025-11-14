<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <header class="header" role="banner" aria-label="App header">
    <div class="branding">
      <span class="logo" aria-hidden="true">✓</span>
      <h1 class="title">{{ title }}</h1>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 1rem 1.25rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
}

.branding {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.logo {
  background: linear-gradient(135deg, rgba(37,99,235,.15), rgba(243,244,246,1));
  color: var(--primary);
  border: 1px solid rgba(37,99,235,.2);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.title {
  color: var(--text);
  font-size: 1.35rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: .2px;
}
</style>
