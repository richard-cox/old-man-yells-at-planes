import { defineStore } from 'pinia';
import {
  FlightRadar24Client,
  getApiCallsInLastMinute,
  UsageLogSummary,
  apiCallTracker,
} from '../services/flightRadar24Service';

interface AsyncData<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface FlightState {
  startDate: string;
  endDate: string;
  height: number;
  flightSummary: AsyncData<number>;
  apiUsage: AsyncData<UsageLogSummary[]>;
  client: FlightRadar24Client | null;
  _ticker: number;
}

const {
  VITE_FR24_API_TOKEN_SANDBOX: FR24_API_TOKEN,
  // VITE_FR24_API_TOKEN: FR24_API_TOKEN,
  VITE_BASE_LAT: HARDCODED_LAT,
  VITE_BASE_LONG: HARDCODED_LON,
} = import.meta.env;

// const FR24_API_TOKEN = import.meta.env.VITE_FR24_API_TOKEN;
// const HARDCODED_LAT = import.meta.env.VITE_BASE_LAT;
// const HARDCODED_LON = import.meta.env.VITE_BASE_LONG;

/**
 * Calculates the distance between two GPS coordinates in meters using the Haversine formula.
 *
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance between the two points in meters.
 */
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (deg: number) => deg * (Math.PI / 180);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

/**
 * Checks if a given coordinate is within 500 meters of a hardcoded location.
 *
 * @param lat The latitude of the point to check.
 * @param lon The longitude of the point to check.
 * @returns True if the point is within 500 meters, false otherwise.
 */
const isInBounds = (lat: number, lon: number): boolean => {
  const MAX_DISTANCE_METERS = 500;

  const distance = getDistanceInMeters(lat, lon, HARDCODED_LAT, HARDCODED_LON);

  if (Number.isNaN(distance)) {
    console.warn('isInBounds', 'derp', lat, lon, HARDCODED_LAT, HARDCODED_LON, distance);

    return false;
  } else {
    console.warn('isInBounds', lat, lon, HARDCODED_LAT, HARDCODED_LON, distance, MAX_DISTANCE_METERS);
    return distance <= MAX_DISTANCE_METERS;
  }
};

export const useFlightStore = defineStore('flight', {
  state: (): FlightState => ({
    startDate: '', // YYYY-MM-DD format
    endDate: '', // YYYY-MM-DD format
    height: 10000, // Default height in feet
    client: null,
    flightSummary: {
      data: null,
      isLoading: false,
      error: null,
    },
    apiUsage: {
      data: null,
      isLoading: false,
      error: null,
    },
    _ticker: 0,
  }),
  getters: {
    /**
     * Returns the number of API calls made in the last minute.
     */
    apiCallsInLastMinute(): number {
      // Depend on the ticker and the reactive tracker to ensure this getter updates
      // TODO: RC this is all sorts of horrible
      this._ticker; // Re-evaluates when ticker changes
      apiCallTracker.count; // Re-evaluates when an API call is made
      return getApiCallsInLastMinute();
    },
  },
  actions: {
    startApiCallPolling() {
      setInterval(() => {
        this._ticker++;
      }, 10000); // Update every 10 seconds
    },

    initialiseClient() {
      this.client = new FlightRadar24Client(FR24_API_TOKEN);
    },

    async fetchAPIUsage() {
      this.apiUsage.isLoading = true;
      this.apiUsage.error = null;
      try {
        const usage = await this.client.usage.get({
          period: '30d',
        });
        this.apiUsage.data = usage.data;
      } catch (err) {
        this.apiUsage.error = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error fetching API usage:', err);
      } finally {
        this.apiUsage.isLoading = false;
      }
    },

    async fetchFlightSummary() {
      this.flightSummary.isLoading = true;
      this.flightSummary.error = null;
      this.flightSummary.data = null; // Clear previous data

      // Basic validation
      if (!this.startDate || !this.endDate) {
        this.flightSummary.error = 'Please select both start and end dates.';
        this.flightSummary.isLoading = false;
        return;
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.flightSummary.error = 'Start date cannot be after end date.';
        this.flightSummary.isLoading = false;
        return;
      }
      if (this.height < 0) {
        this.flightSummary.error = 'Height cannot be negative.';
        this.flightSummary.isLoading = false;
        return;
      }

      // Issues
      // subscription levels have changed and are not prohibitive (need to spend $90!). am sure with gold they used to give 1years worth of data

      // low    - response count - 20.        historic - 30 days. frequency - 10 per min
      // medium - response count - 300.       historic - 2 years
      // high   - response count - unlimited. historic - unlimited

      // bounds - only useable with live OR historic (with timestamp)
      // no pagination, no way to know if at response count peak or not

      try {
        // Not allowed in low plan!
        // const allFlightsCounts = await client.flightSummary.getCount({
        //   flight_datetime_from: `${this.startDate}T00:00:00`,
        //   flight_datetime_to: `${this.endDate}T23:59:59`,
        //   airports: 'MAN',
        // });

        // console.warn('flightEvents: ', 'allFlightsCounts', allFlightsCounts);

        const allFlights = await this.client.flightSummary.getLight({
          flight_datetime_from: `${this.startDate}T00:00:00`,
          flight_datetime_to: `${this.endDate}T23:59:59`,
          airports: 'MAN',
          limit: 15, // TODO: RC  ????
        });

        console.warn('flightEvents: ', 'allFlights', allFlights);

        const flights = allFlights.data.map((d) => d.fr24_id);

        if (flights.length > 15) {
          throw new Error('TODO: RC max 15');
        }

        const flightEvents = await this.client.historic.flightEvents.getLight({
          flight_ids: flights.join(','),
          event_types: ['cruising', 'descent'],
        });

        console.warn('flightEvents: ', 'flightEvents', flightEvents);

        const flightsUnderHeight = flightEvents.data.filter((event) => {
          for (let i = 0; i < event.events.length; i++) {
            const e = event.events[i];
            if (!['cruising', 'descent'].includes(e.type)) {
              continue;
            }

            if (!e.alt || e.alt > this.height) {
              continue;
            }

            if (!e.lat || !e.lon || !isInBounds(e.lat, e.lon)) {
              continue;
            }

            return true;
          }
        });

        console.warn('flightEvents: ', 'flightsUnderHeight', flightsUnderHeight);

        this.flightSummary.data = flightsUnderHeight.length;

        // const flightsInBounds = flightsUnderHeight.filter((event) => {
        //   return event.events.filter((e) => {
        //     if (['cruising', 'descent'].includes(e.type)) {
        //       return isInBounds(e.lat, e.lon);
        //     }
        //   });
        // });

        // console.warn('flightEvents: ', 'flightsInBounds', flightsInBounds);
      } catch (err) {
        this.flightSummary.error = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error fetching flight summary:', err);
      } finally {
        this.flightSummary.isLoading = false;
      }
    },
  },
  // Getters can be added here if derived state is needed, e.g., formatted dates
});
