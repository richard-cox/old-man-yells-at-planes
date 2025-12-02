<script setup lang="ts">
interface Props {
  startDate: string;
  endDate: string;
  height: number;
  flightCount: number | null;
  isLoading: boolean;
  error: string | null;
}

defineProps<Props>();
</script>

<template>
  <div class="flight-summary-card base-card">
    <h2>Summary for Flights Below {{ height }} feet</h2>
    <p class="date-range-display">
      From <strong>{{ startDate || 'N/A' }}</strong> to
      <strong>{{ endDate || 'N/A' }}</strong>
    </p>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner-large"></div>
      <p>Loading flight data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
      <p>Please try again.</p>
    </div>

    <div v-else-if="flightCount !== null" class="summary-content">
      <p class="flight-count-label">Total Flights Below Height:</p>
      <p class="flight-count-value">{{ flightCount }}</p>
    </div>

    <div v-else class="no-data-state">
      <p>No data fetched yet. Please select your criteria and click "Get Flight Summary".</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.flight-summary-card {
  text-align: center;
  max-width: 800px; /* Match App.vue card-container max-width */

  h2 {
    color: $accent-color;
    margin-bottom: $spacing-md;
    font-size: $font-size-xl;

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-lg;
    }
  }

  .date-range-display {
    color: $text-color-secondary;
    font-size: $font-size-md;
    margin-bottom: $spacing-lg;

    strong {
      color: $text-color-primary;
    }
  }

  .loading-state,
  .error-state,
  .no-data-state,
  .summary-content {
    padding: $spacing-md 0;
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
    .flight-count-label {
      font-size: $font-size-lg;
      color: $text-color-secondary;
      margin-bottom: $spacing-sm;
    }

    .flight-count-value {
      font-size: 3rem; /* Large number display */
      font-weight: bold;
      color: $accent-color;
      text-shadow: 0 0 10px rgba($accent-color, 0.5);

      @media (max-width: $breakpoint-sm) {
        font-size: 2.5rem;
      }
    }
  }
}
</style>
