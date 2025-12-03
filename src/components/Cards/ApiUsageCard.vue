<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFlightStore } from '@/stores/flightStore';

const flightStore = useFlightStore();
const { apiCallsInLastMinute, apiUsage } = storeToRefs(flightStore);

</script>

<template>
  <div class="api-usage-card">
    <div class="card-header">
      <h2 class="card-title">API Usage</h2>
    </div>
    <div class="usage-item">
      <div class="usage-item-row">
        <span class="label">Calls (last min):</span>
        <strong :class="{ 'high-usage': apiCallsInLastMinute >= 10 }">{{ apiCallsInLastMinute }}</strong>
      </div>
      <div class="refresh-row">
        <h3 class="sub-header">Calls (all)</h3>
        <button @click="flightStore.fetchAPIUsage()" class="refresh-button">Refresh</button>
      </div>
      <div v-for="usage in apiUsage?.data" :key="usage.endpoint" class="usage-item-row">
        <span class="label">{{ usage.endpoint }}</span>
        <div class="endpoint-stats">
          <span>
            Requests: <strong>{{ usage.request_count }}</strong>
          </span>
          <span>
            Credits: <strong>{{ usage.credits }}</strong>
          </span>
        </div>
      </div>
    </div>
   
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.api-usage-card {
  background-color: $card-background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-elevation-2;
  padding: $spacing-lg;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  color: $text-color-primary;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.card-title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.5rem;
  color: $accent-color;
}

.usage-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  font-size: $font-size-md;
}

.usage-item-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm;
  background-color: darken($card-background-color, 5%);
  border-radius: $border-radius-md;

  .label {
    color: $text-color-secondary;
  }

  strong {
    color: $text-color-primary;

    &.high-usage {
      color: $text-color-error;
    }
  }
}

.endpoint-stats {
  display: flex;
  gap: $spacing-md;
}

.refresh-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-header {
  margin: 0;
  font-size: 1.2rem;
  font-weight: normal;
  color: $text-color-secondary;
}

.loading-state {
  text-align: center;
  color: $text-color-secondary;
  padding: $spacing-md 0;
}

.refresh-button {
  background-color: $accent-color;
  color: white;
  border: none;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: darken($accent-color, 10%);
  }
}
</style>