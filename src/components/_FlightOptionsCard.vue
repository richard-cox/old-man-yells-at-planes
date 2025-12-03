<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import DateRangePicker from '@/components/DateRangePicker.vue';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const flightStore = useFlightStore();

const handleFetchData = () => {
  flightStore.fetchFlightSummary();
};
</script>

<template>
  <div class="base-card">
    <div class="input-group">
      <DateRangePicker
        v-model:start-date="flightStore.startDate"
        v-model:end-date="flightStore.endDate"
      />
      <HeightInput v-model:height="flightStore.height" />
    </div>

    <div class="action-area">
      <div class="selected-info">
        <p>
          Selected Date Range:
          <strong>{{ flightStore.startDate || 'N/A' }}</strong> to
          <strong>{{ flightStore.endDate || 'N/A' }}</strong>
        </p>
        <p>
          Max Height: <strong>{{ flightStore.height }}</strong> feet
        </p>
      </div>
      <BaseButton @click="handleFetchData" :is-loading="flightStore.isLoading">
        {{ flightStore.isLoading ? 'Fetching...' : 'Get Flight Summary' }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.card-container {
  background-color: $card-background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-elevation-2;
  padding: $spacing-lg; /* margin-bottom removed */
  width: 100%;
  max-width: 800px; /* Max width for the main card */
  box-sizing: border-box;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-md;
  }
}

.input-group {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  justify-content: center; /* Center inputs when wrapped */

  > * {
    flex: 1; /* Distribute space evenly */
    min-width: 280px; /* Minimum width before wrapping */

    @media (max-width: $breakpoint-sm) {
      min-width: unset; /* Remove min-width on very small screens */
      width: 100%;
    }
  }
}

.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>