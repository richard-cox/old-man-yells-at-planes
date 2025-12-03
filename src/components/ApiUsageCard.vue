<template>
  <div class="api-usage-card">
    <h2 class="card-title">API Usage</h2>
    <div class="usage-item">
      <div class="usage-item-row">
        <span class="label">Calls (last min):</span>
        <strong :class="{ 'high-usage': callsInLastMinute >= 10 }">{{ callsInLastMinute }}</strong>
      </div>
      <div v-for="usage in apiUsage" :key="usage.endpoint" class="usage-item-row">
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

<script setup lang="ts">
import { UsageLogSummary } from '../services/flightRadar24Service';

defineProps<{
  callsInLastMinute: number;
  apiUsage: UsageLogSummary[] | null;
}>();
</script>

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

.card-title {
  margin-top: 0;
  margin-bottom: $spacing-md;
  font-size: 1.5rem;
  color: $accent-color;
  text-align: center;
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

.loading-state {
  text-align: center;
  color: $text-color-secondary;
  padding: $spacing-md 0;
}
</style>