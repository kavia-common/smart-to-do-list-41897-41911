<script setup lang="ts">
import HeaderBar from '@/components/todo/HeaderBar.vue'
import FiltersBar from '@/components/todo/FiltersBar.vue'
import TaskInput from '@/components/todo/TaskInput.vue'
import TaskList from '@/components/todo/TaskList.vue'
import EmptyState from '@/components/todo/EmptyState.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatusFilter } from '@/types/task'

const store = useTasksStore()
const { filteredTasks, counts, filter } = storeToRefs(store)

onMounted(() => {
  // Load from backend if configured, otherwise from localStorage via API
  store.load().catch(() => {
    // ignore initial load errors to keep UI responsive
  })
})

// PUBLIC_INTERFACE
function addTask(title: string) {
  store.add(title).catch(() => {
    // optionally show a toast; for now we keep silent to match minimal UI
  })
}

// PUBLIC_INTERFACE
function updateTask(id: string, payload: Partial<{ title: string; completed: boolean }>) {
  store.update(id, payload).catch(() => {
    // optionally show a toast
  })
}

// PUBLIC_INTERFACE
function deleteTask(id: string) {
  store.remove(id).catch(() => {
    // optionally show a toast
  })
}

// PUBLIC_INTERFACE
function clearCompleted() {
  store.clearCompleted().catch(() => {
    // optionally show a toast
  })
}

// PUBLIC_INTERFACE
function setFilter(f: TaskStatusFilter) {
  store.setFilter(f)
}
</script>

<template>
  <div class="app-wrap">
    <div class="surface">
      <HeaderBar title="Smart To‑Do" />
      <main>
        <TaskInput @add="addTask" />
        <FiltersBar
          :active-filter="filter"
          :counts="counts"
          @change="setFilter"
          @clear-completed="clearCompleted"
        />
        <template v-if="filteredTasks.length === 0">
          <transition name="fade">
            <EmptyState />
          </transition>
        </template>
        <TaskList
          v-else
          :tasks="filteredTasks"
          @toggle="(id, val) => updateTask(id, { completed: val })"
          @update-title="(id, title) => updateTask(id, { title })"
          @delete="deleteTask"
        />
      </main>
    </div>
    <footer class="foot">
      <p aria-label="footer-note">
        Built with Vue 3 + Vite • Ocean Professional theme
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* Theme tokens - Ocean Professional */
:root {
  --primary: #2563EB;
  --secondary: #F59E0B; /* keep amber as secondary */
  --success: var(--primary); /* success standardized to primary blue */
  --error: #EF4444;
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
}

.app-wrap {
  min-height: 100vh;
  /* blue 500/10 to gray-50 equivalent */
  background: linear-gradient(135deg, rgba(37,99,235,0.10), #f9fafb 35%, #f9fafb);
  display: flex;
  flex-direction: column;
}

.surface {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 1.25rem;
}

main {
  background: var(--surface);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(17,24,39,0.06), 0 1px 3px rgba(17,24,39,0.04);
  padding: 1rem;
}

/* Footer */
.foot {
  color: #6b7280;
  text-align: center;
  font-size: 0.85rem;
  margin: 1.25rem 0 2rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .24s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 720px) {
  .surface {
    padding: 2rem;
  }
  main {
    padding: 1.25rem 1.25rem 1rem 1.25rem;
  }
}
</style>
