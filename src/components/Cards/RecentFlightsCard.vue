<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { onMounted } from 'vue';
import FlightMapCard from '@/components/Cards/FlightMapCard.vue';
import { storeToRefs } from 'pinia';

const flightStore = useFlightStore();
const { recentHeight, recentPreciseLocation } = storeToRefs(flightStore);

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
    <div class="card-content">
      <div class="options-section">
        <div class="input-group">
          <HeightInput v-model:height="recentHeight" />
          <div class="form-control">
            <label for="hours-select">Time Range</label>
            <select id="hours-select" v-model.number="flightStore.recentHours">
              <option v-for="hour in hourOptions" :key="hour" :value="hour">
                {{ hour }} hour{{ hour > 1 ? 's' : '' }}
              </option>
            </select>
          </div>
          <div class="checkbox-control">
            <input id="recent-precise-location" type="checkbox" v-model="recentPreciseLocation" />
            <label for="recent-precise-location">Filter to precise location</label>
          </div>
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
          <p>Error: {{ flightStore.recentFlights.error }}. Please try again.</p>
        </div>

        <div v-else-if="flightStore.recentFlights?.data" class="summary-content">
          <p class="flight-count-label">Flights under {{ recentHeight }} feet:</p>
          <p class="flight-count-value">{{ flightStore.recentFlights.data }}</p>
        </div>

        <div v-else class="no-data-state">
          <p>No data fetched yet. Please select your criteria and click "Fetch".</p>
        </div>
      </div>
    </div>
    <FlightMapCard :flights="flightStore.recentFlights?.points" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/card.scss';
@use '@/assets/styles/forms.scss';

.recent-flights-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}
</style>