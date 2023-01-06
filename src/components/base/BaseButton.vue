<template>
  <button :class="['base-button', `variant-${variant}`, `color-${buttonColor}`]">
    <slot name="left"></slot>
    <span><slot></slot></span>
    <slot name="right"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'text';
  }>(),
  {
    variant: 'default',
    size: 'medium'
  }
);

const buttonColor = computed(() => {
  return props.variant === 'text' ? 'dark' : 'secondary';
});
</script>

<style lang="scss" scoped>
$colors: (
  'secondary': (
    mainColor: #f1f5f9,
    secondColor: #2b3238
  ),
  'dark': (
    mainColor: #2b3238,
    secondColor: #ffffff
  )
);

$font-sizes: (
  'x-large': 'h2',
  'large': 'h3',
  'medium': 'text',
  'small': 'caption'
);

.base-button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-weight: 600;
  overflow: hidden;

  span {
    display: inline-flex;
  }

  &.variant-text {
    background-color: transparent;

    @each $color-key, $color-value in $colors {
      &.color-#{$color-key} {
        color: map-get($color-value, mainColor);
      }
    }
  }

  :slotted(:first-child) {
    flex-shrink: 0;
    margin-right: 4px;
  }

  :slotted(:last-child) {
    flex-shrink: 0;
    margin-left: 4px;
  }

  :slotted(:only-child) {
    margin: 0;
  }
}
</style>
