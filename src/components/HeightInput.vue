<script setup lang="ts">
interface Props {
  height: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:height']);

const updateHeight = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value, 10);
  if (!isNaN(value) && value >= 0) {
    emit('update:height', value);
  } else if ((event.target as HTMLInputElement).value === '') {
    // Allow clearing the input, but set to 0 or a default if preferred
    emit('update:height', 0);
  }
};
</script>

<template>
  <div class="input-field height-input-container">
    <label for="max-height">Max Height (feet)</label>
    <input
      type="number"
      id="max-height"
      :value="props.height"
      @input="updateHeight"
      min="0"
      aria-label="Specify maximum flight height in feet"
    />
  </div>
</template>

<style lang="scss" scoped>
.height-input-container {
  // Specific styles if needed, otherwise inherits from global .input-field
}
</style>
