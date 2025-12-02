/**
 * @file flightService.ts
 * @description This service acts as a wrapper for the @flightradar24/fr24sdk package.
 */

import SDK from '@flightradar24/fr24sdk';

interface FlightSummaryResponse {
  flightCount: number;
  startDate: string;
  endDate: string;
  height: number;
  latitude: number;
  longitude: number;
}

/**
 * Fetches flight summary data from FlightRadar24.
 *
 * @param startDate The start date for the flight data query (YYYY-MM-DD).
 * @param endDate The end date for the flight data query (YYYY-MM-DD).
 * @param latitude The latitude for the center of the search area.
 * @param longitude The longitude for the center of the search area.
 * @param height The maximum height in feet to filter flights by.
 * @returns A Promise that resolves with FlightSummaryResponse or rejects with an error.
 */
export async function fetchFlightSummaryData(
  latitude: number,
  longitude: number,
  height: number,
  // The SDK doesn't seem to support filtering by date,
  // but we'll keep these here for potential future use or to match the interface.
  startDate: string, // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
): Promise<FlightSummaryResponse> {
  console.log(`Fetching flights below ${height}ft near (${latitude}, ${longitude}) from ${startDate} to ${endDate}`);

  // const fr24 = new FlightRadar24API();
  const fr24 = new SDK.Client({
    apiToken: process.env.FR24_API_TOKEN,
    apiVersion: 'v1', // optional, defaults to 'v1'
  });
  try {
    // The SDK's primary flight fetching is based on real-time data for a bounding box.
    // We can define a bounding box around the given lat/lon.
    // The size of the box (e.g., 1 degree) is arbitrary and can be adjusted.
    const bounds = fr24.getBoundsByPoint(latitude, longitude, 25000); // 25km radius
    const flights = await fr24.getFlights(undefined, bounds);

    const filteredFlights = flights.filter((flight) => flight.altitude < height);

    return {
      flightCount: filteredFlights.length,
      startDate,
      endDate,
      height,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Failed to fetch flight data from FlightRadar24:', error);
    throw new Error('Failed to fetch flight data. Please try again.');
  }
}
