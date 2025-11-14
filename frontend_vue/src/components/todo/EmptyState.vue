<template>
  <section class="empty" role="note" aria-label="No tasks">
    <div class="icon" aria-hidden="true">📝</div>
    <p class="title">No tasks to show</p>
    <p class="hint">Add a task to get started or change the filter.</p>
  </section>
</template>

<style scoped>
.empty {
  display: grid;
  place-items: center;
  gap: .35rem;
  text-align: center;
  padding: 2.25rem .5rem;
  color: #6b7280;
}
.icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, rgba(37,99,235,.12), #fff);
  border: 1px solid rgba(37,99,235,.2);
  color: var(--primary);
}
.title {
  color: var(--text);
  font-weight: 700;
}
.hint {
  font-size: .95rem;
}
</style>
