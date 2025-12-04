<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { onMounted } from 'vue';

const flightStore = useFlightStore();

const handleFetchData = () => {
  flightStore.fetchRecentFlights();
};

// Set initial value for hours if not already set
onMounted(() => {
  if (flightStore.recentHours === undefined) {
    flightStore.recentHours = 1;
  }
});

const hourOptions = [1, 2, 3];
</script>

<template>
  <div class="recent-flights-card base-card">
    <h2>Summary of Recent flights</h2>
    <div class="card-content">
      <div class="options-section">
        <div class="input-group">
          <div class="form-control">
            <label for="hours-select">Time Range</label>
            <select id="hours-select" v-model.number="flightStore.recentHours">
              <option v-for="hour in hourOptions" :key="hour" :value="hour">
                {{ hour }} hour{{ hour > 1 ? 's' : '' }}
              </option>
            </select>
          </div>
          <HeightInput v-model:height="flightStore.recentHeight" />
        </div>

        <div class="action-area">
          <BaseButton @click="handleFetchData" :is-loading="flightStore.recentFlights?.isLoading">
            {{ flightStore.recentFlights?.isLoading ? 'Fetching...' : 'Fetch' }}
          </BaseButton>
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="summary-section">
        <div v-if="flightStore.recentFlights?.isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Loading flight data...</p>
        </div>

        <div v-else-if="flightStore.recentFlights?.error" class="error-state">
          <p>Error: {{ flightStore.recentFlights.error }}</p>
          <p>Please try again.</p>
        </div>

        <div v-else-if="flightStore.recentFlights?.data" class="summary-content">
          <p class="flight-count-label">Flights:</p>
          <p class="flight-count-value">{{ flightStore.recentFlights.data.flightCount }}</p>
        </div>

        <div v-else class="no-data-state">
          <p>No data fetched yet. Please select your criteria and click "Fetch".</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/card.scss';

.recent-flights-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  h2 {
    margin-top: 0;
    text-align: center;
  }
}
.input-group {
  > * {
    min-width: 200px;
  }
}
.form-control {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  text-align: left;

  label {
    font-weight: bold;
    color: $text-color-secondary;
    font-size: $font-size-sm;
    margin-left: $spacing-xs;
  }

  select {
    padding: $spacing-sm;
    border-radius: $border-radius-md;
    border: 1px solid $divider-color;
    // background-color: $background-color-light;
    font-size: $font-size-md;
    width: 100%;
  }
}
</style>