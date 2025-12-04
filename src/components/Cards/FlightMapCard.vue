<script setup lang="ts">
import { computed } from 'vue';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LCircleMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';


// TODO: RC Gemini came up with this itself....
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


const props = defineProps<{
  flights: FlightEventPointForMap[] | null | undefined;
}>();

const hasEventType = computed(() => {
  return props.flights?.some((flight) => flight.type);
});


// Using the hardcoded lat/lon from the store's env vars would be better,
// but they aren't exported. This is a close approximation of Manchester.
const center = [53.3833, -2.2333]; // Manchester
</script>

<template>
  <div class="flight-map-card">
    <div v-if="flights?.length > 0" style="height: 500px; width: 100%">
      <l-map ref="map" :zoom="8" :center="center">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
        ></l-tile-layer>
        <l-circle-marker
          v-for="(point, index) in flights"
          :key="index"
          :lat-lng="[point.lat, point.lon]"
          :radius="6"
          color="#ff7f50"
          :fill-opacity="0.7"
        >
          <l-popup>
            <b>Flight:</b> {{ point.callsign }}<br />
            <b>Altitude:</b> {{ point.alt }}<br />
            <b>Orig:</b> {{ point.orig }}<br />
            <b>Dest:</b> {{ point.dest }}<br />
            <template v-if="point.type"> <b>Event Type:</b> {{ point.type }}</template>
          </l-popup>
        </l-circle-marker>
      </l-map>
    </div>
    <div v-else class="message">No recent flight points to display.</div>
    <div v-if="flights?.length > 0" class="flight-summary">
      <h4>Flight Events</h4>
      <table>
        <thead>
          <tr>
            <th>Callsign</th>
            <th>Altitude</th>
            <th>Origin</th>
            <th>Destination</th>
            <th v-if="hasEventType">Event Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in flights" :key="`summary-${index}`">
            <td>{{ point.callsign }}</td>
            <td>{{ point.alt }}ft</td>
            <td>{{ point.orig }}</td>
            <td>{{ point.dest }}</td>
            <td v-if="hasEventType">{{ point.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as *;

.flight-map-card {
  width: 100%;
  text-align: left;

  .message {
    color: $text-color-secondary;
    text-align: center;
    padding: $spacing-xl 0;
  }

  .flight-summary {
    margin-top: $spacing-lg;
    h4 {
      margin-bottom: $spacing-md;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: $spacing-sm;
      text-align: left;
      border-bottom: 1px solid $border-color;
    }
    th {
      font-weight: bold;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
  }
}
</style>