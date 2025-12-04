<script setup lang="ts">
import { computed } from 'vue';
import { useFlightStore } from '@/stores/flightStore';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LCircleMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

// Local airport data for ICAO code conversion.
import airportData from '@/data/airports.json';

// This is a workaround for a known issue with leaflet and bundlers like Vite.
// It ensures that the default marker icons are loaded correctly.
// See: https://vue-leaflet.github.io/vue-leaflet/guide/troubleshooting.html#marker-icons-are-not-showing
try {
  type D = L.Icon.Default & {
    _getIconUrl?: string;
  };
  delete (L.Icon.Default.prototype as D)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });
} catch (e) {
  console.error('Could not load leaflet marker icons', e);
}

const flightStore = useFlightStore();

// Create a Map for efficient ICAO code lookups.
const airportNameMap = new Map<string, string>(Object.entries(airportData));

const flightPoints = computed(() => {
  return (
    flightStore.recentFlightPoints.data
      ?.flatMap((flight) =>
        flight.events
          .filter((event) => event.lat && event.lon)
          .map((event) => ({
            lat: event.lat!,
            lon: event.lon!,

            callsign: flight.callsign,
            orig: airportNameMap.get(flight.orig_icao) || 'Unknown',
            dest: airportNameMap.get(flight.dest_icao_actual) || 'Unknown',
            type: event.type,
          }))
      ) || []
  );
});

// Using the hardcoded lat/lon from the store's env vars would be better,
// but they aren't exported. This is a close approximation of Manchester.
const center = [53.3833, -2.2333]; // Manchester
</script>

<template>
  <div class="flight-map-card">
    <h2>Recent Flight Event Points</h2>
    <div v-if="flightStore.recentFlightPoints.isLoading" class="message">Loading map data...</div>
    <div v-else-if="flightStore.recentFlightPoints.error" class="error-message">
      Error loading flight paths: {{ flightStore.recentFlightPoints.error }}
    </div>
    <div v-else-if="flightPoints.length > 0" style="height: 500px; width: 100%">
      <l-map ref="map" :zoom="8" :center="center">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
        ></l-tile-layer>
        <l-circle-marker
          v-for="(point, index) in flightPoints"
          :key="index"
          :lat-lng="[point.lat, point.lon]"
          :radius="6"
          color="#ff7f50"
          :fill-opacity="0.7"
        >
          <l-popup>
            <b>Flight:</b> {{ point.callsign }}<br />
            <b>Orig:</b> {{ point.orig }}<br />
            <b>Dest:</b> {{ point.dest }}<br />
            <b>Event Type:</b> {{ point.type }}
          </l-popup>
        </l-circle-marker>
      </l-map>
    </div>
    <div v-else class="message">No recent flight points to display.</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.flight-map-card {
  background-color: $card-background-color;
  border-radius: $border-radius-md;
  padding: $spacing-lg;
  // box-shadow: $box-shadow-lifted; TODO: RC
  width: 100%;
  max-width: 900px;
  text-align: left;

  h2 {
    margin-top: 0;
    color: $accent-color;
    margin-bottom: $spacing-md;
  }

  .message {
    color: $text-color-secondary;
    text-align: center;
    padding: $spacing-xl 0;
  }

  .error-message {
    color: $error-color;
    text-align: center;
    padding: $spacing-xl 0;
  }
}
</style>