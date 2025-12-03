<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFlightStore } from '@/stores/flightStore';
import BaseButton from '@/components/BaseButton.vue';

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
        <BaseButton @click="flightStore.fetchAPIUsage()">Refresh</BaseButton>
      </div>
      <div class="usage-details-container">
        <div v-if="apiUsage.isLoading" class="loading-state">Loading API usage...</div>
        <div v-else-if="apiUsage?.error" class="error-state">
          <p>Failed to load API usage data.</p>
          <p><strong>{{ apiUsage.error }}</strong></p>
        </div>
        <template v-else>
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
        </template>
      </div>
    </div>
   
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use 'sass:color';

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
  
  background-color: color.adjust($card-background-color, $lightness: -5%);
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

.usage-details-container {
  min-height: 120px;
  display: flex;
  flex-direction: column;
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

.error-state {
  text-align: center;
  color: $text-color-error;
  padding: $spacing-md;
  background-color: color.adjust($text-color-error, $lightness: 40%);
  border-radius: $border-radius-md;
  border: 1px solid color.adjust($text-color-error, $lightness: 20%);
}
</style>