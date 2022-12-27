<template>
  <div class="calendar">
    <div class="header">
      <LeftArrowIcon class="header-arrow" @click="currentMonth = currentMonth.subtract(1, 'M')" />

      <div class="header-month">{{ currentMonth.format('MMMM YYYY') }}</div>

      <RightArrowIcon class="header-arrow" @click="currentMonth = currentMonth.add(1, 'M')" />
    </div>

    <div class="calendar-main">
      <table class="calendar-days">
        <thead>
          <th v-for="weekDay in weekdaysToDisplay" :key="weekDay" class="calendar-cell calendar-weekday">{{ weekDay }}</th>
        </thead>

        <tbody>
          <tr v-for="(week, weekIndex) in genDaysToDisplay" :key="`week-${weekIndex}`">
            <td
              v-for="(day, dayIndex) in week"
              :key="`day-${dayIndex}`"
              :class="['calendar-cell', { 'neighboring-month': day.neighboringDay, today: day.isToday, active: day.active }]"
              @click="model = dayjs(currentMonth, DATE_FORMAT).set('date', day.value).format(DATE_FORMAT)"
            >
              {{ day.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ru';

import { useVModel } from '@/composables/useVModel';

import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue';
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';

dayjs.extend(isToday);
dayjs.extend(localeData);
dayjs.locale('ru');

const DATE_FORMAT = 'D-M-YYYY';
const DAYS_IN_WEEK = 7; // Дней в неделе
const FIRST_DAY_OF_WEEK = 1; // Индекс понедельника

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
}>();

const model = useVModel(props, 'modelValue', emit);
const currentMonth = ref(dayjs(model.value, DATE_FORMAT).date(1));

// Последние дни прошлого месяца
const lastDaysOfLastMonth = computed(() => {
  const previousMonth = currentMonth.value.subtract(1, 'M');
  const lastDayOfPreviousMonth = previousMonth.date(previousMonth.daysInMonth());
  const weekDay = lastDayOfPreviousMonth.day();

  return (weekDay - FIRST_DAY_OF_WEEK + DAYS_IN_WEEK) % DAYS_IN_WEEK;
});

// Количество дней в текущем месяце
const daysInMonth = computed(() => currentMonth.value.daysInMonth());

const genDaysToDisplay = computed(() => {
  let matrix: any = [];
  const numberOfDaysInPreviousMonth = currentMonth.value.subtract(1, 'M').daysInMonth();

  // Генерация дней прошлого месяца
  if (currentMonth.value.subtract(1, 'M').date(numberOfDaysInPreviousMonth).get('day') !== 0) {
    for (let i = numberOfDaysInPreviousMonth; numberOfDaysInPreviousMonth - i <= lastDaysOfLastMonth.value; i--) {
      matrix.unshift({
        value: i,
        neighboringDay: true
      });
    }
  }

  // Генерация дней текущего месяца
  for (let i = 1; i <= daysInMonth.value; i++) {
    matrix.push({
      value: i,
      ...(dayjs(currentMonth.value, DATE_FORMAT).set('date', i).isToday() ? { isToday: true } : {}),
      ...(model.value === dayjs(currentMonth.value, DATE_FORMAT).set('date', i).format(DATE_FORMAT) ? { active: true } : {})
    });
  }

  // Генерация дней следующего месяца
  for (let i = 1; matrix.length % 7 !== 0; i++) {
    matrix.push({
      value: i,
      neighboringDay: true
    });
  }

  return matrix.reduce((acc: any[], _: any, index: number) => {
    return index % DAYS_IN_WEEK === 0 ? [...acc, matrix.slice(index, index + DAYS_IN_WEEK)] : acc;
  }, []);
});

// Дни недели
const weekdaysToDisplay = computed(() => {
  return dayjs.weekdaysMin().slice(1).concat(dayjs.weekdaysMin()[0]);
});
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: 600;
    margin-bottom: 8px;

    &-month {
      text-align: center;
      text-transform: capitalize;
      width: 125px;
      cursor: default;
    }

    &-arrow {
      margin: 0 8px;
      cursor: pointer;
    }
  }

  &-days {
    border-spacing: 4px;
    text-align: center;
    color: #2b3238;

    .neighboring-month {
      color: #d0dbe4;
      pointer-events: none;
    }

    .today {
      position: relative;

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #f4765a;
        position: absolute;
        margin-left: 50%;
        left: -2px;
        top: 4px;
      }
    }

    .active {
      background-color: #2b3238;
      border-radius: 50%;
      color: #ffffff;
      font-weight: 600;
    }
  }

  &-cell {
    width: 32px;
    height: 32px;
    padding: 0;
    cursor: pointer;
  }

  &-weekday {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #b6c7d6;
    cursor: default;
  }
}
</style>
