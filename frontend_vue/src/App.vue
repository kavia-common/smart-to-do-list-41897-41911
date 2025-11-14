<script setup lang="ts">
import HeaderBar from '@/components/todo/HeaderBar.vue'
import FiltersBar from '@/components/todo/FiltersBar.vue'
import TaskInput from '@/components/todo/TaskInput.vue'
import TaskList from '@/components/todo/TaskList.vue'
import EmptyState from '@/components/todo/EmptyState.vue'
import { computed, onMounted, ref, watch } from 'vue'

// PUBLIC_INTERFACE
export type TaskStatusFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'todo.tasks.v1'
const tasks = ref<Task[]>([])
const filter = ref<TaskStatusFilter>('all')

// persist and load
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) tasks.value = JSON.parse(raw)
  } catch {
    tasks.value = []
  }
})
watch(
  tasks,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
      // ignore persistence errors
    }
  },
  { deep: true }
)

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.completed)
  if (filter.value === 'completed') return tasks.value.filter((t) => t.completed)
  return tasks.value
})

function addTask(title: string) {
  const now = Date.now()
  const t: Task = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random()}`,
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
  if (!t.title) return
  tasks.value.unshift(t)
}

function updateTask(id: string, payload: Partial<Pick<Task, 'title' | 'completed'>>) {
  const idx = tasks.value.findIndex((t) => t.id === id)
  if (idx === -1) return
  tasks.value[idx] = { ...tasks.value[idx], ...payload, updatedAt: Date.now() }
}

function deleteTask(id: string) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

function clearCompleted() {
  tasks.value = tasks.value.filter((t) => !t.completed)
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
          :counts="{
            all: tasks.length,
            active: tasks.filter((t) => !t.completed).length,
            completed: tasks.filter((t) => t.completed).length
          }"
          @change="(f) => (filter = f)"
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
  --secondary: #F59E0B;
  --success: #F59E0B;
  --error: #EF4444;
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
}

.app-wrap {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb 35%, #f9fafb);
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
