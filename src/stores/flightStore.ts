import { defineStore } from 'pinia';
import { fetchFlightSummaryData } from '@/services/flightService';

interface FlightState {
  startDate: string;
  endDate: string;
  height: number;
  flightCount: number | null;
  isLoading: boolean;
  error: string | null;
}

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
        const data = await fetchFlightSummaryData(
          this.startDate,
          this.endDate,
          this.height
        );
        this.flightCount = data.flightCount;
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
