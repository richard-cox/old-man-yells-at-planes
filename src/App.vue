<script setup lang="ts">
import { onMounted } from 'vue';
import { useFlightStore } from '@/stores/flightStore';
import ApiUsageCard from '@/components/Cards/ApiUsageCard.vue';
import RecentFlightsCard from '@/components/Cards/RecentFlightsCard.vue';
import FlightLargeTimespanCard from '@/components/Cards/FlightLargeTimespanCard.vue';
import FlightMapCard from '@/components/Cards/FlightMapCard.vue';

const flightStore = useFlightStore();

// Set initial date range to last 7 days
onMounted(() => {
  flightStore.initialiseClient();
  flightStore.startApiCallPolling();
});
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Flight Summary</h1>
    <FlightLargeTimespanCard />
    <RecentFlightsCard />
    <FlightMapCard />

    <ApiUsageCard />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  min-height: 100vh;
  padding: $spacing-md;
  box-sizing: border-box;
  text-align: center;
  color: $text-color-primary;
  width: 100%;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-sm;
  }
}

.app-title {
  color: $accent-color;
  margin-bottom: 0; /* Replaced with gap on parent */
  font-size: 2.5rem; /* Larger title */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: $breakpoint-sm) {
    font-size: 1.8rem;
    margin-bottom: $spacing-md;
  }
}

</style>
