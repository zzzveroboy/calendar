<template>
  <Calendar v-model="date_1" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Calendar from './components/Calendar.vue';

const date_1 = ref('26-12-2022');
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.control {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 20px;
}
</style>
