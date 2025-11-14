import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Task, TaskStatusFilter } from '@/types/task'
import { TasksApi } from '@/services/tasks.api'

// PUBLIC_INTERFACE
export const useTasksStore = defineStore('tasks', () => {
  /** Pinia store to manage tasks and filter state with optimistic updates and backend sync when available. */
  const tasks = ref<Task[]>([])
  const filter = ref<TaskStatusFilter>('all')

  // Derived
  const counts = computed(() => {
    const all = tasks.value.length
    const active = tasks.value.filter((t) => !t.completed).length
    const completed = all - active
    return { all, active, completed }
  })

  const filteredTasks = computed(() => {
    if (filter.value === 'active') return tasks.value.filter((t) => !t.completed)
    if (filter.value === 'completed') return tasks.value.filter((t) => t.completed)
    return tasks.value
  })

  // Actions
  async function load() {
    const list = await TasksApi.list()
    tasks.value = list.sort((a, b) => b.createdAt - a.createdAt)
  }

  async function add(title: string) {
    const draftTitle = title.trim()
    if (!draftTitle) return
    // optimistic: create a local temp task
    const now = Date.now()
    const tempId = `temp-${now}-${Math.random().toString(36).slice(2)}`
    const optimistic: Task = {
      id: tempId,
      title: draftTitle,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    tasks.value.unshift(optimistic)

    try {
      const created = await TasksApi.create({ title: draftTitle })
      // replace optimistic with server record (match by tempId or by title+createdAt)
      const idx = tasks.value.findIndex((t) => t.id === tempId)
      if (idx !== -1) tasks.value[idx] = created
      else tasks.value.unshift(created)
    } catch (e) {
      // rollback optimistic
      tasks.value = tasks.value.filter((t) => t.id !== tempId)
      throw e
    }
  }

  async function update(id: string, payload: Partial<Pick<Task, 'title' | 'completed'>>) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    const prev = { ...tasks.value[idx] }
    // optimistic update
    tasks.value[idx] = { ...prev, ...payload, updatedAt: Date.now() }
    try {
      const updated = await TasksApi.update(id, payload)
      tasks.value[idx] = updated
    } catch (e) {
      // rollback
      tasks.value[idx] = prev
      throw e
    }
  }

  async function remove(id: string) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    const prev = tasks.value[idx]
    // optimistic delete
    tasks.value.splice(idx, 1)
    try {
      await TasksApi.remove(id)
    } catch (e) {
      // rollback
      tasks.value.splice(idx, 0, prev)
      throw e
    }
  }

  async function clearCompleted() {
    const prev = [...tasks.value]
    // optimistic clear
    tasks.value = tasks.value.filter((t) => !t.completed)
    try {
      const remaining = await TasksApi.clearCompleted()
      tasks.value = remaining.sort((a, b) => b.createdAt - a.createdAt)
    } catch (e) {
      tasks.value = prev
      throw e
    }
  }

  function setFilter(f: TaskStatusFilter) {
    filter.value = f
  }

  return {
    // state
    tasks,
    filter,
    // getters
    counts,
    filteredTasks,
    // actions
    load,
    add,
    update,
    remove,
    clearCompleted,
    setFilter,
  }
})
