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
  <div class="flight-large-timespan-card base-card">
    <h2>Summary for Flights - Date Range and Height</h2>
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

        <div v-else-if="flightStore.flightSummary?.data?.flightCount !== null" class="summary-content">
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

.flight-large-timespan-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  h2 {
    margin-top: 0;
    text-align: center;
  }
}

.card-content {
  display: flex;
  gap: $spacing-lg;
  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}
.options-section,
.summary-section {
  flex: 1;
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

  .loading-state,
  .error-state,
  .no-data-state,
  .summary-content {
    padding: $spacing-sm 0;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    color: $text-color-secondary;
  }

  .spinner-large {
    border: 4px solid rgba($accent-color, 0.3);
    border-top: 4px solid $accent-color;
    border-radius: 50%;
    width: 40px;
    height: 40px;
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

  .error-state {
    color: $error-color;
    font-weight: bold;
  }

  .no-data-state {
    color: $text-color-secondary;
    font-style: italic;
  }

  .summary-content {
    text-align: center;
    .flight-count-label {
      font-size: $font-size-lg;
      color: $text-color-secondary;
      margin-bottom: $spacing-sm;
    }

    .flight-count-value {
      font-size: 3rem; /* Large number display */
      font-weight: bold;
      margin: 0;
      color: $accent-color;
      text-shadow: 0 0 10px rgba($accent-color, 0.5);

      @media (max-width: $breakpoint-sm) {
        font-size: 2.5rem;
      }
    }
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
    justify-content: center;
  }
}

.vertical-divider {
  width: 1px;
  background-color: $divider-color;
  margin: 0;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.summary-section {
  text-align: center;
}
</style>