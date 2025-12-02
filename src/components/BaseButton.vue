<script setup lang="ts">
interface Props {
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});
</script>

<template>
  <button :disabled="isLoading" class="base-button">
    <span v-if="isLoading" class="spinner"></span>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use 'sass:color';

.base-button {
  background-color: $accent-color;
  color: $primary-background-color; // Dark text on accent button
  border: none;
  border-radius: $border-radius-md;
  padding: $spacing-sm $spacing-lg;
  font-size: $font-size-md;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  min-width: 150px; /* Ensure button has a minimum width */

  &:hover:not(:disabled) {
    background-color: $accent-color-hover;
    box-shadow: $box-shadow-elevation-1;
  }

  &:disabled {
    background-color: color.adjust($accent-color, $lightness: 15%);
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.spinner {
  border: 2px solid rgba($primary-background-color, 0.3);
  border-top: 2px solid $primary-background-color;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
