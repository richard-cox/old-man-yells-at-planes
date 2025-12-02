<script setup lang="ts">
interface Props {
  startDate: string;
  endDate: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:startDate', 'update:endDate']);

const updateStartDate = (event: Event) => {
  emit('update:startDate', (event.target as HTMLInputElement).value);
};

const updateEndDate = (event: Event) => {
  emit('update:endDate', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="date-range-picker">
    <div class="input-field">
      <label for="start-date">Start Date</label>
      <input
        type="date"
        id="start-date"
        :value="props.startDate"
        @input="updateStartDate"
        aria-label="Select start date"
      />
    </div>
    <div class="input-field">
      <label for="end-date">End Date</label>
      <input
        type="date"
        id="end-date"
        :value="props.endDate"
        @input="updateEndDate"
        aria-label="Select end date"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.date-range-picker {
  display: flex;
  gap: $spacing-md;
  width: 100%;

  .input-field {
    flex: 1;
    margin-bottom: 0; /* Override global margin for this component's internal fields */
  }

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
  }
}
</style>
