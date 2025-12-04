<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import DateRangePicker from '@/components/DateRangePicker.vue';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { onMounted } from 'vue';

const flightStore = useFlightStore();

const handleFetchData = () => {
  flightStore.fetchFlightSummary();
};

// Set initial date range to last 7 days
onMounted(() => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  flightStore.startDate = sevenDaysAgo.toISOString().split('T')[0];
  flightStore.endDate = today.toISOString().split('T')[0];
});

</script>

<template>
  <div class="flight-large-timespan-card base-card">
    <div class="card-content">
      <div class="options-section">
        <div class="input-group">
          <DateRangePicker
            v-model:start-date="flightStore.startDate"
            v-model:end-date="flightStore.endDate"
          />
          <HeightInput v-model:height="flightStore.height" />
        </div>

        <div class="action-area">
          <BaseButton @click="handleFetchData" :is-loading="flightStore.flightSummary.isLoading">
            {{ flightStore.flightSummary.isLoading ? 'Fetching...' : 'Get Flight Summary' }}
          </BaseButton>
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="summary-section">
        <div v-if="flightStore.flightSummary.isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Loading flight data...</p>
        </div>

        <div v-else-if="flightStore.flightSummary.error" class="error-state">
          <p>Error: {{ flightStore.flightSummary.error }}</p>
          <p>Please try again.</p>
        </div>

        <div v-else-if="flightStore.flightSummary?.data !== null" class="summary-content">
          <p class="flight-count-label">Flights:</p>
          <p class="flight-count-value">{{ flightStore.flightSummary?.data?.flightCount }}</p>
        </div>

        <div v-else class="no-data-state">
          <p>No data fetched yet. Please select your criteria and click "Get Flight Summary".</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/card.scss';

.flight-large-timespan-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}
.options-section {
  h2 {
    color: $accent-color;
    margin-bottom: $spacing-md;
    font-size: $font-size-xl;
    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-lg;
    }
  }
}

.input-group {
  > * {
    min-width: 280px; /* Minimum width before wrapping */

    @media (max-width: $breakpoint-sm) {
      min-width: unset; /* Remove min-width on very small screens */
      width: 100%;
    }
  }
}

.action-area {
  // Overrides for this card's action area
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    justify-content: center;
  }
}
</style>