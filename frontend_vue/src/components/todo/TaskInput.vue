<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', title: string): void
}>()

const title = ref('')

// PUBLIC_INTERFACE
function submit() {
  const t = title.value.trim()
  if (!t) return
  emit('add', t)
  title.value = ''
}
</script>

<template>
  <form
    class="task-input"
    @submit.prevent="submit"
    role="form"
    aria-label="Add new task form"
  >
    <label class="visually-hidden" for="taskTitle">Task title</label>
    <input
      id="taskTitle"
      v-model="title"
      class="input"
      type="text"
      name="title"
      placeholder="Add a new task..."
      autocomplete="off"
      @keyup.enter="submit"
      aria-describedby="taskHelp"
    />
    <button
      class="add-btn"
      type="submit"
      :disabled="!title.trim()"
      aria-label="Add task"
    >
      Add
    </button>
  </form>
  <p id="taskHelp" class="help">Press Enter to quickly add</p>
</template>

<style scoped>
.visually-hidden {
  position: absolute !important;
  left: -10000px !important;
  top: auto !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
}

.task-input {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .6rem;
  padding: .75rem 0 .25rem;
}

.input {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: .75rem .9rem;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
  color: var(--text);
}
.input:focus {
  border-color: rgba(37,99,235,.6);
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
}

.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: .75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform .06s ease, box-shadow .18s ease, opacity .18s ease;
  box-shadow: 0 1px 2px rgba(37,99,235,.3);
}
.add-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
.add-btn:active {
  transform: translateY(1px);
}

.help {
  margin-top: .25rem;
  font-size: .8rem;
  color: #6b7280;
}
</style>
