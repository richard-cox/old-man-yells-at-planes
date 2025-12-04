<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import { useFlightStore } from '@/stores/flightStore';
import ApiUsageCard from '@/components/Cards/ApiUsageCard.vue';
import RecentFlightsCard from '@/components/Cards/RecentFlightsCard.vue';
import FlightLargeTimespanCard from '@/components/Cards/FlightLargeTimespanCard.vue';
import LiveFlightsCard from '@/components/Cards/LiveFlightsCard.vue';

const flightStore = useFlightStore();

const tabs = shallowRef({
  'Live Flights': LiveFlightsCard,
  'Recent Flights': RecentFlightsCard,
  'Ranged Flights': FlightLargeTimespanCard,
  'API Usage': ApiUsageCard
});

const activeTab = ref('Live Flights');

// Set initial date range to last 7 days
onMounted(() => {
  flightStore.initialiseClient();
  flightStore.startApiCallPolling(); // TODO: RC tidy
});
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Flight Summary</h1>
    <div class="tabs-container">
      <div class="tab-navigation">
        <button
          v-for="(_, tabName) in tabs"
          :key="tabName"
          :class="['tab-button', { active: activeTab === tabName }]"
          @click="activeTab = tabName"
        >
          {{ tabName }}
        </button>
      </div>
      <div class="tab-content">
        <KeepAlive>
          <component :is="tabs[activeTab]" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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

.tabs-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-sm;
  border-bottom: 2px solid $border-color;
  padding-bottom: $spacing-md;
}

.tab-button {
  padding: $spacing-sm $spacing-md;
  font-size: 1rem;
  font-weight: 600;
  color: $text-color-secondary;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    color: $accent-color;
  }

  &.active {
    color: $accent-color;
    border-bottom-color: $accent-color;
  }
}

.tab-content {
  width: 100%;
}
</style>
