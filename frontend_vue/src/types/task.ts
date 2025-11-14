export type TaskStatusFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export interface TaskCreate {
  title: string
}

export interface TaskUpdate {
  title?: string
  completed?: boolean
}

// PUBLIC_INTERFACE
export function newTask(title: string): Task {
  /** Creates a new Task object with generated id and timestamps. */
  const now = Date.now()
  const isCryptoAvailable =
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto !== 'undefined' &&
    typeof (globalThis as unknown as { crypto: { randomUUID?: () => string } }).crypto.randomUUID === 'function'
  const id = isCryptoAvailable
    ? (globalThis as unknown as { crypto: { randomUUID: () => string } }).crypto.randomUUID()
    : `${now}-${Math.random().toString(36).slice(2)}`
  return {
    id,
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
}
