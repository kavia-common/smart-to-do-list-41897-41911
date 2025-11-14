<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import type { Task } from '@/App.vue'

defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string, val: boolean): void
  (e: 'update-title', id: string, title: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <ul class="list" role="list" aria-label="Tasks">
    <transition-group name="pop" tag="template">
      <li v-for="t in tasks" :key="t.id" class="row" role="listitem">
        <TaskItem
          :task="t"
          @toggle="(val) => emit('toggle', t.id, val)"
          @update-title="(title) => emit('update-title', t.id, title)"
          @delete="() => emit('delete', t.id)"
        />
      </li>
    </transition-group>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  gap: .5rem;
  padding: .75rem .25rem .5rem;
}

.row {
  list-style: none;
}

/* Animations */
.pop-enter-active,
.pop-leave-active {
  transition: all .18s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
