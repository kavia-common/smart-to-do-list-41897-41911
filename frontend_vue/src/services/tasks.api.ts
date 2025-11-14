import { httpDelete, httpGet, httpPatch, httpPost } from './http'
import { isBackendEnabled } from '@/utils/env'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'

const STORAGE_KEY = 'todo.tasks.v1'

// PUBLIC_INTERFACE
export const TasksApi = {
  /** Lists tasks either from backend or localStorage. */
  async list(): Promise<Task[]> {
    if (isBackendEnabled()) {
      // Expect backend route: GET /tasks -> Task[]
      return await httpGet<Task[]>('/tasks')
    }
    return readLocal()
  },

  /** Creates a task; returns created Task. */
  async create(payload: TaskCreate): Promise<Task> {
    if (isBackendEnabled()) {
      // Expect backend route: POST /tasks {title} -> Task
      return await httpPost<Task>('/tasks', payload)
    }
    const tasks = readLocal()
    const now = Date.now()
    const isCryptoAvailable =
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto !== 'undefined' &&
      typeof (globalThis as unknown as { crypto: { randomUUID?: () => string } }).crypto.randomUUID === 'function'
    const id = isCryptoAvailable
      ? (globalThis as unknown as { crypto: { randomUUID: () => string } }).crypto.randomUUID()
      : `${now}-${Math.random().toString(36).slice(2)}`
    const task: Task = {
      id,
      title: payload.title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    const next = [task, ...tasks]
    writeLocal(next)
    return task
  },

  /** Updates a task by id; returns updated Task. */
  async update(id: string, payload: TaskUpdate): Promise<Task> {
    if (isBackendEnabled()) {
      // Expect backend route: PATCH /tasks/:id -> Task
      return await httpPatch<Task>(`/tasks/${id}`, payload)
    }
    const tasks = readLocal()
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Task not found')
    const updated: Task = { ...tasks[idx], ...payload, updatedAt: Date.now() }
    const next = [...tasks]
    next[idx] = updated
    writeLocal(next)
    return updated
  },

  /** Deletes a task by id; returns void. */
  async remove(id: string): Promise<void> {
    if (isBackendEnabled()) {
      // Expect backend route: DELETE /tasks/:id
      await httpDelete<void>(`/tasks/${id}`)
      return
    }
    const tasks = readLocal().filter((t) => t.id !== id)
    writeLocal(tasks)
  },

  /** Clears completed tasks; returns remaining tasks. */
  async clearCompleted(): Promise<Task[]> {
    if (isBackendEnabled()) {
      // If backend supports, call: DELETE /tasks?completed=true or POST /tasks/clear-completed
      // Fallback to client-side clear then sync list.
      try {
        const result = await httpDelete<Task[]>('/tasks?completed=true')
        return result
      } catch {
        // If endpoint missing, fetch list and filter client-side
        const tasks = await httpGet<Task[]>('/tasks')
        const remaining = tasks.filter((t) => !t.completed)
        return remaining
      }
    }
    const remaining = readLocal().filter((t) => !t.completed)
    writeLocal(remaining)
    return remaining
  },
}

function readLocal(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Task[]) : []
  } catch {
    return []
  }
}

function writeLocal(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // ignore
  }
}
