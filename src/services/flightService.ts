/**
 * @file flightService.ts
 * @description This service acts as a wrapper for the (future) REST API calls related to flight data.
 *              Currently, it provides a mock implementation.
 */

interface FlightSummaryResponse {
  flightCount: number;
  startDate: string;
  endDate: string;
  height: number;
}

/**
 * Simulates fetching flight summary data from a REST API.
 * In a real application, this would make an actual HTTP request (e.g., using axios or fetch).
 *
 * @param startDate The start date for the flight data query (YYYY-MM-DD).
 * @param endDate The end date for the flight data query (YYYY-MM-DD).
 * @param height The maximum height in feet to filter flights by.
 * @returns A Promise that resolves with FlightSummaryResponse or rejects with an error.
 */
export async function fetchFlightSummaryData(
  startDate: string,
  endDate: string,
  height: number
): Promise<FlightSummaryResponse> {
  console.log(
    `Mock API Call: Fetching flights below ${height}ft from ${startDate} to ${endDate}`
  );

  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate potential API errors
      if (Math.random() < 0.1) {
        // 10% chance of error
        reject(new Error('Failed to fetch flight data. Please try again.'));
        return;
      }

      // Simulate data based on inputs
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Generate a somewhat realistic (but random) flight count
      // More flights for longer periods, higher height limits
      const baseFlightsPerDay = 10;
      const heightFactor = height / 1000; // e.g., 10000ft -> 10
      const randomFactor = Math.random() * 0.5 + 0.75; // Between 0.75 and 1.25

      const flightCount = Math.floor(
        baseFlightsPerDay * diffDays * heightFactor * randomFactor
      );

      resolve({
        flightCount: Math.max(0, flightCount), // Ensure non-negative
        startDate,
        endDate,
        height,
      });
    }, 1500); // Simulate 1.5 seconds loading time
  });
}
