<script setup lang="ts">
import type { TaskStatusFilter } from '@/App.vue'
defineProps<{
  activeFilter: TaskStatusFilter
  counts: { all: number; active: number; completed: number }
}>()

const emit = defineEmits<{
  (e: 'change', filter: TaskStatusFilter): void
  (e: 'clear-completed'): void
}>()

const filters: { key: TaskStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]
</script>

<template>
  <section
    class="filters"
    role="region"
    aria-label="Task filters"
  >
    <div class="tabs" role="tablist" aria-label="Filter tabs">
      <button
        v-for="f in filters"
        :key="f.key"
        class="tab"
        :class="{ active: activeFilter === f.key }"
        role="tab"
        :aria-selected="activeFilter === f.key"
        @click="emit('change', f.key)"
      >
        {{ f.label }}
        <span class="count" aria-hidden="true">{{
          f.key === 'all' ? counts.all : f.key === 'active' ? counts.active : counts.completed
        }}</span>
      </button>
    </div>
    <div class="spacer" />
    <button
      class="clear"
      type="button"
      @click="emit('clear-completed')"
      aria-label="Clear completed tasks"
      :disabled="counts.completed === 0"
      title="Clear completed"
    >
      Clear completed
    </button>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: .5rem;
  border-bottom: 1px solid #e5e7eb;
  padding: .5rem .25rem .65rem;
  margin-bottom: .5rem;
}

.tabs {
  display: inline-flex;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 11px;
  padding: .25rem;
  gap: .25rem;
}

.tab {
  border: none;
  background: transparent;
  padding: .45rem .7rem;
  border-radius: 9px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}
.tab.active {
  background: #fff;
  color: var(--primary);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  border: 1px solid rgba(37,99,235,.15);
}

.count {
  margin-left: .35rem;
  font-weight: 700;
  color: #6b7280;
}

.spacer {
  flex: 1;
}

.clear {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  padding: .45rem .7rem;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .18s ease, color .18s ease, box-shadow .18s ease;
}
.clear:disabled {
  opacity: .6;
  cursor: not-allowed;
}
.clear:not(:disabled):hover {
  border-color: rgba(37,99,235,.35);
  color: var(--primary);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
</style>
