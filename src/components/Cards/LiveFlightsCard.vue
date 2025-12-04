<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import FlightMapCard from '@/components/Cards/FlightMapCard.vue';


const flightStore = useFlightStore();

const { liveAltitude, livePollingInterval, liveFlights, _livePollingTickerId } = storeToRefs(flightStore);

// When the component is unmounted, stop polling to prevent memory leaks.
onUnmounted(() => {
  flightStore.stopLivePolling();
});
</script>

<template>
  <div class="live-flights-card base-card">
    <h2>Live Flights Overhead</h2>
    <div class="card-content">
      <div class="options-section">
        <div class="input-group">
          <HeightInput v-model:height="liveAltitude" />
          <div class="form-control">
            <label for="polling-interval">Polling Frequency:</label>
            <select id="polling-interval" v-model="livePollingInterval">
              <option :value="null">Off</option>
              <option :value="10">10 seconds</option>
              <option :value="60">1 minute</option>
              <option :value="300">5 minutes</option>
            </select>
          </div>
        </div>
        <div class="action-area">
          <BaseButton @click="flightStore.fetchBounds" :disabled="liveFlights.isLoading">
            Fetch Now
          </BaseButton>
          <BaseButton
            v-if="!_livePollingTickerId"
            @click="flightStore.startLivePolling"
            :disabled="!livePollingInterval"
          >
            Start Polling
          </BaseButton>
          <BaseButton v-else @click="flightStore.stopLivePolling"> Stop Polling </BaseButton>
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="summary-section">
        <div v-if="liveFlights.isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Loading flight data...</p>
        </div>
        <div v-else-if="liveFlights.error" class="error-state">
          <p>Error: {{ liveFlights.error }}</p>
        </div>
        <div v-else-if="liveFlights.data !== null" class="summary-content">
          <p class="flight-count-label">Flights under {{ liveAltitude }} feet:</p>
          <p class="flight-count-value">{{ liveFlights.data }}</p>
          <ul v-if="liveFlights.points && liveFlights.points.length > 0">
            <li v-for="flight in liveFlights.points" :key="flight.fr24_id">
              {{ flight.callsign || flight.flight || 'N/A' }} ({{ flight.reg }}) at
              {{ flight.alt }} ft
            </li>
          </ul>
        </div>
        <div velse class="no-data-state">
          <p>Use the controls to fetch live flight data.</p>
        </div>
      </div>
    </div>
    <FlightMapCard :flights="flightStore.liveFlights?.points" />
  </div>
</template>



<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/card.scss';

.live-flights-card {
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
    font-size: $font-size-md;
    width: 100%;
  }
}

// Styles for the results list
ul {
  list-style-type: none;
  padding: 0;
  margin-top: $spacing-md;
  max-height: 200px;
  overflow-y: auto;
}
li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 8px;
  margin-top: 4px;
  border-radius: $border-radius-sm;
  text-align: left;
}
</style>