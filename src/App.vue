<script setup lang="ts">
import { onMounted } from 'vue';
import { useFlightStore } from '@/stores/flightStore';
import DateRangePicker from '@/components/DateRangePicker.vue';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import FlightSummaryCard from '@/components/FlightSummaryCard.vue';

const flightStore = useFlightStore();

// Set initial date range to last 7 days
onMounted(() => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  flightStore.startDate = sevenDaysAgo.toISOString().split('T')[0];
  flightStore.endDate = today.toISOString().split('T')[0];
});

const handleFetchData = () => {
  flightStore.fetchFlightSummary();
};
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Aeroplane Flight Summary</h1>

    <div class="card-container">
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

    <FlightSummaryCard
      :start-date="flightStore.startDate"
      :end-date="flightStore.endDate"
      :height="flightStore.height"
      :flight-count="flightStore.flightCount"
      :is-loading="flightStore.isLoading"
      :error="flightStore.error"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: $spacing-md;
  box-sizing: border-box;
  text-align: center;
  color: $text-color-primary;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-sm;
  }
}

.app-title {
  color: $accent-color;
  margin-bottom: $spacing-lg;
  font-size: 2.5rem; /* Larger title */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: $breakpoint-sm) {
    font-size: 1.8rem;
    margin-bottom: $spacing-md;
  }
}

.card-container {
  background-color: $card-background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-elevation-2;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  width: 100%;
  max-width: 700px; /* Max width for the main card */
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

  .selected-info {
    font-size: $font-size-md;
    color: $text-color-secondary;
    margin-bottom: $spacing-sm;

    p {
      margin: $spacing-xs 0;
    }

    strong {
      color: $text-color-primary;
    }
  }

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    justify-content: space-between;
    .selected-info {
      text-align: left;
      margin-bottom: 0;
    }
  }
}
</style>
