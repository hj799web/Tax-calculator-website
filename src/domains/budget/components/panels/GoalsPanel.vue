<template>
  <div class="panel-container">
    <GoalTracker />
  </div>
</template>

<script setup>
import GoalTracker from '@/domains/budget/components/GoalTracker.vue';
</script>

<style scoped>
.panel-container { padding: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
</style>

