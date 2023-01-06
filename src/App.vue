<template>
  <h2>Calendar</h2>
  <div class="row">
    <div>
      <h3>Without Props</h3>
      <Calendar v-model="date_1" />
    </div>

    <div>
      <h3>With Presets</h3>
      <Calendar v-model="date_2" :options="optionsForCalendar" />
    </div>

    <div>
      <h3>Min: Today</h3>
      <Calendar v-model="date_3" hide-presets :min="dayjs().format('D-M-YYYY')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

import Calendar from './components/Calendar.vue';

dayjs.locale('ru');

const date_1 = ref(dayjs().format('D-M-YYYY'));
const date_2 = ref(dayjs().format('D-M-YYYY'));
const date_3 = ref(dayjs().format('D-M-YYYY'));

const optionsForCalendar = computed(() => [
  {
    text: 'На выходных',
    value: [0, 6].includes(dayjs().day()) ? dayjs() : dayjs().day(6)
  },
  {
    text: 'Через неделю',
    value: dayjs().add(1, 'week')
  },
  {
    text: 'Через месяц',
    value: dayjs().add(1, 'month')
  }
]);
</script>

<style lang="scss">
* {
  font-family: 'Inter', sans-serif;
}

button {
  border: none;
  padding: 0;
  color: inherit;
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover:not([disabled]),
  &:active:not([disabled]) {
    opacity: 0.64;
  }
}

.row {
  display: flex;
  gap: 24px;
}
</style>
