<script setup lang="ts">
import { useFlightStore } from '@/stores/flightStore';
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import HeightInput from '@/components/HeightInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import FlightMapCard from '@/components/Cards/FlightMapCard.vue';

const flightStore = useFlightStore();

const { preciseBoundsArray, roughBounds, roughBoundsArray, liveAltitude, livePollingInterval, liveFlights, _livePollingTickerId, livePreciseLocation } =
  storeToRefs(flightStore);

// When the component is unmounted, stop polling to prevent memory leaks.
onUnmounted(() => {
  flightStore.stopLivePolling();
});
</script>

<template>
  <div class="live-flights-card base-card">
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
          <div class="checkbox-control">
            <input id="live-precise-location" type="checkbox" v-model="livePreciseLocation" />
            <label for="live-precise-location">Filter to precise location</label>
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
        </div>
        <div v-else class="no-data-state">
          <p>No data fetched yet. Use the controls to fetch live flight data.</p>
        </div>
      </div>
    </div>
    <!-- <br>!!{{roughBounds}}!!<br> -->
     <!-- TODO: RC add precise as different colour, and only if checked -->
    <FlightMapCard :flights="flightStore.liveFlights?.points" :boundingBoxPoints="[roughBoundsArray, preciseBoundsArray]" />
  </div>
</template>



<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/card.scss';
@use '@/assets/styles/forms.scss';

.live-flights-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}
</style>