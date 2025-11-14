<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Task } from '@/App.vue'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'toggle', val: boolean): void
  (e: 'update-title', title: string): void
  (e: 'delete'): void
}>()

const editing = ref(false)
const draft = ref(props.task.title)
const inputRef = ref<HTMLInputElement | null>(null)

watch(
  () => editing.value,
  async (val) => {
    if (val) {
      draft.value = props.task.title
      await nextTick()
      inputRef.value?.focus()
      inputRef.value?.select()
    }
  }
)

function commitEdit() {
  const title = draft.value.trim()
  if (!title) return cancelEdit()
  if (title !== props.task.title) {
    emit('update-title', title)
  }
  editing.value = false
}

function cancelEdit() {
  draft.value = props.task.title
  editing.value = false
}
</script>

<template>
  <article class="item" :class="{ done: task.completed }">
    <div class="left">
      <input
        :id="`chk-${task.id}`"
        class="chk"
        type="checkbox"
        :checked="task.completed"
        @change="emit('toggle', !task.completed)"
        :aria-label="task.completed ? 'Mark task as active' : 'Mark task as completed'"
      />
      <label
        class="title"
        :for="`chk-${task.id}`"
        v-if="!editing"
        :title="task.title"
      >
        {{ task.title }}
      </label>
      <input
        v-else
        ref="inputRef"
        class="edit"
        v-model="draft"
        type="text"
        @keyup.enter="commitEdit"
        @keyup.esc="cancelEdit"
        @blur="commitEdit"
        aria-label="Edit task title"
      />
    </div>
    <div class="right">
      <button
        class="btn ghost"
        type="button"
        @click="editing = !editing"
        :aria-label="editing ? 'Save changes' : 'Edit task'"
        :title="editing ? 'Save' : 'Edit'"
      >
        {{ editing ? 'Save' : 'Edit' }}
      </button>
      <button
        class="btn danger"
        type="button"
        @click="emit('delete')"
        aria-label="Delete task"
        title="Delete"
      >
        Delete
      </button>
    </div>
  </article>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: .5rem .75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: .65rem .7rem;
  transition: border-color .18s ease, box-shadow .18s ease, transform .06s ease;
}
.item:hover {
  border-color: rgba(37,99,235,.28);
  box-shadow: 0 2px 8px rgba(17,24,39,0.05);
}

.left {
  display: flex;
  align-items: center;
  gap: .65rem;
  min-width: 0;
}

.chk {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.title {
  color: var(--text);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item.done .title {
  color: #6b7280;
  text-decoration: line-through;
}

.edit {
  border: 1px solid rgba(37,99,235,.35);
  border-radius: 8px;
  padding: .4rem .55rem;
  outline: none;
  min-width: 0;
  width: 100%;
}

.right {
  display: flex;
  align-items: center;
  gap: .4rem;
}

.btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: .4rem .6rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .18s ease, color .18s ease, box-shadow .18s ease, background .18s ease;
}
.btn.ghost:hover {
  border-color: rgba(37,99,235,.35);
  color: var(--primary);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.btn.danger {
  border-color: rgba(239,68,68,.25);
  color: #b91c1c;
}
.btn.danger:hover {
  background: rgba(239,68,68,.06);
  border-color: rgba(239,68,68,.4);
  color: #991b1b;
}
</style>
