import { defineStore } from 'pinia';
import { FlightRadar24Client } from '../services/flightRadar24Service';

interface FlightState {
  startDate: string;
  endDate: string;
  height: number;
  flightCount: number | null;
  isLoading: boolean;
  error: string | null;
}
// FR24_API_TOKEN
const client = new FlightRadar24Client(import.meta.env.VITE_FR24_API_TOKEN);

export const useFlightStore = defineStore('flight', {
  state: (): FlightState => ({
    startDate: '', // YYYY-MM-DD format
    endDate: '', // YYYY-MM-DD format
    height: 10000, // Default height in feet
    flightCount: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchFlightSummary() {
      this.isLoading = true;
      this.error = null;
      this.flightCount = null; // Clear previous data

      // Basic validation
      if (!this.startDate || !this.endDate) {
        this.error = 'Please select both start and end dates.';
        this.isLoading = false;
        return;
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.error = 'Start date cannot be after end date.';
        this.isLoading = false;
        return;
      }
      if (this.height < 0) {
        this.error = 'Height cannot be negative.';
        this.isLoading = false;
        return;
      }

      try {
        // The new service does not support filtering by height directly on the summary endpoint.
        // We will filter by date. The height parameter is currently unused with the new service.
        const data = await client.flightSummary.getCount({
          flight_datetime_from: `${this.startDate}T00:00:00`,
          flight_datetime_to: `${this.endDate}T23:59:59`,
          airports: 'MAN',
        });
        this.flightCount = data.record_count;

        const allFlights = await client.flightSummary.getLight({
          flight_datetime_from: `${this.startDate}T00:00:00`,
          flight_datetime_to: `${this.endDate}T23:59:59`,
          airports: 'MAN',
        });

        allFlights.data.forEach((d) => {
          d.flight;
        });

        // const flightsInBounds = await client.historic.flightPositions.getLight({
        //   timestamp????
        //   altitudeRanges
        // })

        //  max 15
        // const flightEvents = await client.historic.flightEvents.getLight({
        //   flight_ids:
        // })
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error fetching flight summary:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  // Getters can be added here if derived state is needed, e.g., formatted dates
});
