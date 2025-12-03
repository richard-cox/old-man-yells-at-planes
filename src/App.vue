<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFlightStore } from '@/stores/flightStore';
import ApiUsageCard from '@/components/ApiUsageCard.vue';
import FlightSummaryCard from '@/components/FlightSummaryCard.vue';
import FlightOptionsCard from '@/components/FlightOptionsCard.vue';

const flightStore = useFlightStore();
const { apiCallsInLastMinute, apiUsage } = storeToRefs(flightStore);

// Set initial date range to last 7 days
onMounted(() => {
  flightStore.initialiseClient();

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  flightStore.startDate = sevenDaysAgo.toISOString().split('T')[0];
  flightStore.endDate = today.toISOString().split('T')[0];
  flightStore.fetchAPIUsage();
});
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Flight Summary</h1>

    <FlightOptionsCard />

    <FlightSummaryCard
      :start-date="flightStore.startDate"
      :end-date="flightStore.endDate"
      :height="flightStore.height"
      :flight-count="flightStore.flightCount"
      :is-loading="flightStore.isLoading"
      :error="flightStore.error"
    />

    <ApiUsageCard :calls-in-last-minute="apiCallsInLastMinute" :api-usage="apiUsage" />
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
