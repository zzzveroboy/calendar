<template>
  <div class="calendar">
    <div class="calendar-header">
      <BaseButton
        variant="text"
        :class="['header-arrow', { disabled: disabledToSelectLastMonth }]"
        @click="currentMonth = currentMonth.subtract(1, 'M')"
      >
        <LeftArrowIcon />
      </BaseButton>

      <div class="header-month">
        {{ currentMonth.format('MMMM YYYY') }}
      </div>

      <BaseButton variant="text" class="header-arrow" @click="currentMonth = currentMonth.add(1, 'M')">
        <RightArrowIcon />
      </BaseButton>
    </div>

    <div class="calendar-main">
      <div class="weekdays">
        <div v-for="weekDay in weekdaysToDisplay" :key="weekDay" class="calendar-cell calendar-weekday">{{ weekDay }}</div>
      </div>

      <div class="days">
        <BaseButton
          v-for="({ value, disabled, today, selected }, dayIndex) in genDaysToDisplay"
          :key="`day-${dayIndex}`"
          variant="text"
          :class="['calendar-cell', { disabled, today, selected }]"
          @click="selectDay(value)"
        >
          {{ value }}
        </BaseButton>
      </div>
    </div>

    <div v-if="options.length" class="preset">
      <BaseButton
        v-for="(option, index) in optionsToDisplay"
        :key="`option-${index}`"
        class="preset-option"
        variant="text"
        @click="selectedDay = option.value"
      >
        <div>{{ option.text }}</div>

        <CheckIcon v-if="option.value === selectedDay" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ru';

import BaseButton from '@/components/base/BaseButton.vue';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue';
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';

import { useVModel } from '@/composables/useVModel';

dayjs.locale('ru');
dayjs.extend(isToday);
dayjs.extend(localeData);

const DATE_FORMAT = 'D-M-YYYY';
const DAYS_IN_WEEK = 7; // Дней в неделе
const FIRST_DAY_OF_WEEK = 1; // Индекс понедельника

interface Option {
  text: string;
  value: Dayjs;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    min?: string;
    options?: Option[];
  }>(),
  {
    options: () => []
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
}>();

const selectedDay = useVModel(props, 'modelValue', emit);

// Переключение месяца, если выбранный день не входит в текущий
watch(selectedDay, (value) => {
  if (!dayjs(value, DATE_FORMAT).isSame(currentMonth.value, 'month')) {
    currentMonth.value = dayjs(selectedDay.value, DATE_FORMAT).date(1);
  }
});

const currentMonth = ref(dayjs(selectedDay.value, DATE_FORMAT).date(1));

// Последние дни прошлого месяца
const lastDaysOfLastMonth = computed(() => {
  const previousMonth = currentMonth.value.subtract(1, 'M');
  const lastDayOfPreviousMonth = previousMonth.date(previousMonth.daysInMonth());
  const weekDay = lastDayOfPreviousMonth.day();

  return (weekDay - FIRST_DAY_OF_WEEK + DAYS_IN_WEEK) % DAYS_IN_WEEK;
});

// Количество дней в текущем месяце
const daysInMonth = computed(() => currentMonth.value.daysInMonth());

// Генерирование всех видимых дней в календаре
const genDaysToDisplay = computed(() => {
  let matrix: {
    value: number;
    today: boolean;
    selected: boolean;
    disabled: boolean;
  }[] = [];
  const numberOfDaysInPreviousMonth = currentMonth.value.subtract(1, 'M').daysInMonth();

  // Генерация дней прошлого месяца
  if (currentMonth.value.subtract(1, 'M').date(numberOfDaysInPreviousMonth).get('day') !== 0) {
    for (let i = numberOfDaysInPreviousMonth; numberOfDaysInPreviousMonth - i <= lastDaysOfLastMonth.value; i--) {
      const date: Dayjs = dayjs(currentMonth.value, DATE_FORMAT).subtract(1, 'M').set('date', i);

      matrix.unshift({
        value: i,
        today: date.isToday(),
        selected: selectedDay.value === date.format(DATE_FORMAT),
        disabled: true
      });
    }
  }

  // Генерация дней текущего месяца
  for (let i = 1; i <= daysInMonth.value; i++) {
    const date: Dayjs = dayjs(currentMonth.value, DATE_FORMAT).set('date', i);

    matrix.push({
      value: i,
      today: date.isToday(),
      selected: selectedDay.value === date.format(DATE_FORMAT),
      disabled: dayjs(date).isBefore(dayjs(props.min, DATE_FORMAT))
    });
  }

  // Генерация дней следующего месяца
  for (let i = 1; matrix.length % DAYS_IN_WEEK !== 0; i++) {
    const date: Dayjs = dayjs(currentMonth.value, DATE_FORMAT).add(1, 'M').set('date', i);

    matrix.push({
      value: i,
      today: dayjs(currentMonth.value, DATE_FORMAT).add(1, 'M').set('date', i).isToday(),
      selected: selectedDay.value === date.format(DATE_FORMAT),
      disabled: true
    });
  }

  return matrix;
});

// Выбор дня
const selectDay = (day: number) => {
  selectedDay.value = dayjs(currentMonth.value, DATE_FORMAT).set('date', day).format(DATE_FORMAT);
};

// Дни недели
const weekdaysToDisplay = computed(() => {
  const weekdays = dayjs.weekdaysMin();

  return weekdays.slice(1).concat(weekdays[0]);
});

const disabledToSelectLastMonth = computed(() => {
  return props.min && dayjs(props.min, DATE_FORMAT).isSame(currentMonth.value, 'month');
});

// Опции
const optionsToDisplay = computed(() => {
  return props.options.map((option) => ({
    text: `${option.text} (${option.value.format('dd')}) ${option.value.format('D.M.YYYY')}`,
    value: option.value.format(DATE_FORMAT)
  }));
});
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  padding: 16px;

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: 600;
    margin-bottom: 16px;

    .header-month {
      text-align: center;
      text-transform: capitalize;
      width: 125px;
      cursor: default;
    }

    .header-arrow {
      margin: 0 8px;

      &.disabled {
        color: #b6c7d6;
        pointer-events: none;
      }
    }
  }

  .calendar-main {
    padding: 0 4px 8px;
    border-spacing: 4px;
    text-align: center;
    color: #2b3238;
    box-shadow: inset 0px -1px 0px rgba(#2b3238, 0.08);

    .weekdays,
    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-gap: 12px;
    }

    .weekdays {
      margin-bottom: 8px;
    }

    .calendar-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;

      &.disabled {
        color: #d0dbe4;
        pointer-events: none;

        &.today::before {
          background-color: #d0dbe4;
        }

        &.selected {
          background-color: #d0dbe4;
        }

        &.selected.today::before {
          background-color: #ffffff;
        }
      }

      &.today {
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

      &.selected {
        background-color: #2b3238;
        border-radius: 50%;
        color: #ffffff;
        font-weight: 600;
      }
    }

    .calendar-weekday {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #b6c7d6;
      cursor: default;
    }
  }

  .preset {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin-top: 16px;

    &-option {
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 24px;

      :deep(span) {
        width: 100%;
        justify-content: space-between;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
