/**
 * @file src/types/@flightradar24/fr24sdk.d.ts
 * @description TypeScript declaration file for the @flightradar24/fr24sdk package.
 *              This file provides type definitions for the library's public API.
 */

declare module '@flightradar24/fr24sdk' {
  /**
   * Represents the geographical bounding box for flight searches.
   * The values are latitude/longitude coordinates.
   * @example "52.23,51.37,4.73,6.24" (north, south, west, east)
   */
  export type Bounds = string;

  /**
   * Represents a single flight with its real-time data.
   */
  export interface Flight {
    id: string;
    registration: string;
    flightNumber: string;
    aircraftCode: string;
    airlineCode: string;
    latitude: number;
    longitude: number;
    altitude: number; // in feet
    bearing: number; // in degrees
    speed: number; // in knots
    originAirportCode: string;
    destinationAirportCode: string;
    getAirline(): Promise<Airline>;
    getAircraft(): Promise<any>; // The structure of Aircraft is not well-documented
    getOriginAirport(): Promise<Airport>;
    getDestinationAirport(): Promise<Airport>;
  }

  /**
   * Represents an airport.
   */
  export interface Airport {
    name: string;
    iata: string;
    icao: string;
    latitude: number;
    longitude: number;
    country: string;
  }

  /**
   * Represents an airline.
   */
  export interface Airline {
    name: string;
    code: string;
    iata: string;
    icao: string;
  }

  /**
   * The main class for interacting with the FlightRadar24 API.
   */
  export class FlightRadar24API {
    /**
     * Finds airports near a given geographical point.
     * @param latitude - The latitude of the point.
     * @param longitude - The longitude of the point.
     * @returns A promise that resolves to an array of Airport objects.
     */
    public findAirportsByPoint(latitude: number, longitude: number): Promise<Airport[]>;

    /**
     * Gets flights within a specified bounding box.
     * @param airline - (Optional) ICAO code of an airline to filter by.
     * @param bounds - The geographical bounding box to search within.
     * @returns A promise that resolves to an array of Flight objects.
     */
    public getFlights(airline?: string, bounds?: Bounds): Promise<Flight[]>;

    /**
     * Creates a bounding box string based on a center point and a radius.
     * @param latitude - The latitude of the center point.
     * @param longitude - The longitude of the center point.
     * @param radius - The radius in meters.
     * @returns A Bounds string for use in other API calls.
     */
    public getBoundsByPoint(latitude: number, longitude: number, radius: number): Bounds;
  }
}
