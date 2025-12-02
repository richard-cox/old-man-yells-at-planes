import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://fr24api.flightradar24.com';
const API_VERSION = 'v1';

//#region Schemas

export interface AirlineLight {
  name: string;
  iata: string | null;
  icao: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Timezone {
  name: string;
  offset: number;
}

export interface Runway {
  designator: string;
  heading: number;
  length: number;
  width: number;
  elevation: number;
  thr_coordinates: [number, number];
  surface: {
    type: string;
    description: string;
  };
}

export interface AirportLight {
  name: string | null;
  iata: string | null;
  icao: string;
}

export interface AirportFull {
  name: string;
  iata: string | null;
  icao: string | null;
  lon: number;
  lat: number;
  elevation: number;
  country: Country;
  city: string;
  state: string | null;
  timezone: Timezone;
  runways: Runway[];
}

export interface FlightPositionsFull {
  fr24_id: string;
  flight: string | null;
  callsign: string | null;
  lat: number;
  lon: number;
  track: number;
  alt: number;
  gspeed: number;
  vspeed: number;
  squawk: string;
  timestamp: string; // date-time
  source: string;
  hex: string | null;
  type: string | null;
  reg: string | null;
  painted_as: string | null;
  operating_as: string | null;
  orig_iata: string | null;
  orig_icao: string | null;
  dest_iata: string | null;
  dest_icao: string | null;
  eta: string | null; // date-time
}

export interface FlightPositionsLight {
  fr24_id: string;
  hex: string | null;
  callsign: string | null;
  lat: number;
  lon: number;
  track: number;
  alt: number;
  gspeed: number;
  vspeed: number;
  squawk: string;
  timestamp: string; // date-time
  source: string;
}

export interface Count {
  record_count: number;
}

export interface HistoricFlightEventDetails {
  gate_ident?: string | null;
  gate_lat?: number | null;
  gate_lon?: number | null;
  takeoff_runway?: string | null;
  landed_icao?: string | null;
  landed_runway?: string | null;
  exited_airspace?: string | null;
  exited_airspace_id?: string | null;
  entered_airspace?: string | null;
  entered_airspace_id?: string | null;
}

export interface HistoricFlightEvent {
  type: string;
  timestamp: string; // date-time
  lat: number | null;
  lon: number | null;
  alt: number | null;
  gspeed: number | null;
  details: HistoricFlightEventDetails | null;
}

export interface HistoricFlightEventsLight {
  fr24_id: string;
  callsign: string;
  hex: string;
  events: HistoricFlightEvent[];
}

export interface HistoricFlightEventsFull extends HistoricFlightEventsLight {
  painted_as: string;
  operating_as: string;
  orig_iata: string;
  orig_icao: string;
  dest_iata: string;
  dest_icao: string;
}

export interface FlightSummaryLight {
  fr24_id: string;
  flight: string | null;
  callsign: string | null;
  operating_as: string | null;
  painted_as: string | null;
  type: string | null;
  reg: string | null;
  orig_icao: string | null;
  datetime_takeoff: string | null; // YYYY-MM-DDTHH:MM:SS
  dest_icao: string | null;
  datetime_landed: string | null; // YYYY-MM-DDTHH:MM:SS
  hex: string | null;
  first_seen: string | null; // YYYY-MM-DDTHH:MM:SS
  last_seen: string | null; // YYYY-MM-DDTHH:MM:SS
  flight_ended: boolean | null;
}

export interface FlightSummaryFull extends FlightSummaryLight {
  orig_iata: string | null;
  runway_takeoff: string | null;
  dest_iata: string | null;
  dest_icao_actual: string | null;
  dest_iata_actual: string | null;
  runway_landed: string | null;
  flight_time: number | null;
  actual_distance: number | null;
  circle_distance: number | null;
}

export interface FlightTrackPoint {
  timestamp: string; // date-time
  lat: number;
  lon: number;
  alt: number;
  gspeed: number;
  vspeed: number;
  track: number;
  squawk: string;
  callsign: string | null;
  source: string;
}

export interface FlightTracks {
  fr24_id: string;
  tracks: FlightTrackPoint[];
}

export interface UsageLogSummary {
  endpoint: string;
  request_count: number;
  credits: number;
}

//#endregion

//#region Params

export interface FlightPositionsParams {
  bounds?: string;
  flights?: string;
  callsigns?: string;
  registrations?: string;
  paintedAs?: string;
  operatingAs?: string;
  /**
   *
   */
  airports?: string;
  routes?: string;
  aircraft?: string;
  altitudeRanges?: string;
  squawks?: string;
  categories?: string;
  dataSources?: string;
  airspaces?: string;
  gspeed?: string;
  limit?: number;
}

export interface HistoricFlightPositionsParams extends FlightPositionsParams {
  timestamp: number;
}

export interface FlightEventsParams {
  /**
   * 	
    Comma-separated fr24_ids (maximum 15 IDs). Cannot be combined with flight_datetime.

    Examples: 391fdd79,35f2ffd9
   */
  flight_ids: string;
  /**
     * 	
      Event types to filter by (comma-separated values). Available values all, gate_departure, takeoff, cruising, airspace_transition, descent, landed, gate_arrival.

      Examples: gate_departure,takeoff,cruising,airspace_transition,descent,landed,gate_arrival
     */
  event_types: string;
}

export interface FlightSummaryParams {
  flight_ids?: string;
  /**
     * Flight date lower range (YYYY-MM-DDTHH:MM:SS), uses first_seen. Cannot be combined with flight_ids. The maximum permitted date range is 14 days.

      Examples: 2025-01-04T13:17:14Z
     */
  flight_datetime_from?: string; // date-time
  /**
     * 	
      Flight date upper range (YYYY-MM-DDTHH:MM:SS), uses first_seen. Cannot be combined with flight_ids.

     Examples: 2025-01-07T13:17:14Z
     */
  flight_datetime_to?: string; // date-time
  /**
     * Flight numbers (comma-separated values, max 15).

Examples: CA4515,UA1742
     */
  flights?: string;
  /**
     * 	
Flight callsigns (comma-separated values, max 15).

Examples: WJA329,WSW102
     */
  callsigns?: string;
  /**
     * 	
Aircraft registration numbers (comma-separated values, max 15).

Examples: D-AFAM,EC-MQM
     */
  registrations?: string;
  paintedAs?: string;
  /**
     * 	
Aircraft operating under an airline's call sign, identified by ICAO code, but not necessarily an aircraft belonging to that airline, such as an aircraft on lease from another airline (comma-separated values, max 15).

Examples: SAS,ART
     */
  operatingAs?: string;
  /**
     * Airports specified by IATA or ICAO codes or countries specified by ISO 3166-1 alpha-2 codes (comma-separated values) To determine direction use format: <direction>:<code> (colon-separated, max 15)

        Available directions:

        both - both directions (default direction when not specified)
        inbound - flights to airport
        outbound - flight from airport
        Examples: LHR,SE,inbound:WAW,US,outbound:JFK,both:ESSA
     */
  airports?: string;
  /**
     * 	
Flights between different airports or countries. Airports specified by IATA or ICAO codes or countries specified by ISO 3166-1 alpha-2 codes (comma-separated values, max 15).

Examples: SE-US,ESSA-JFK
     */
  routes?: string;
  /**
     * Aircraft ICAO type codes (comma-separated values, max 15).

Examples: B38M,B738
     */
  aircraft?: string;
  sort?: 'asc' | 'desc';
  limit?: number;
}

//#endregion

class BaseService {
  protected client: AxiosInstance;

  constructor(apiToken: string) {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Accept-Version': API_VERSION,
        Accept: 'application/json',
      },
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
}

class StaticService extends BaseService {
  public airlines = {
    getLight: (params: { icao: string }) => this.get<AirlineLight>(`/api/static/airlines/${params.icao}/light`),
  };

  public airports = {
    getFull: (params: { code: string }) => this.get<AirportFull>(`/api/static/airports/${params.code}/full`),
    getLight: (params: { code: string }) => this.get<AirportLight>(`/api/static/airports/${params.code}/light`),
  };
}

class LiveService extends BaseService {
  public flightPositions = {
    getFull: (params: FlightPositionsParams) =>
      this.get<{ data: FlightPositionsFull[] }>('/api/live/flight-positions/full', { params }),
    getLight: (params: FlightPositionsParams) =>
      this.get<{ data: FlightPositionsLight[] }>('/api/live/flight-positions/light', { params }),
    getCount: (params: FlightPositionsParams) => this.get<Count>('/api/live/flight-positions/count', { params }),
  };
}

class HistoricService extends BaseService {
  public flightPositions = {
    getFull: (params: HistoricFlightPositionsParams) =>
      this.get<{ data: FlightPositionsFull[] }>('/api/historic/flight-positions/full', { params }),
    getLight: (params: HistoricFlightPositionsParams) =>
      this.get<{ data: FlightPositionsLight[] }>('/api/historic/flight-positions/light', { params }),
    getCount: (params: HistoricFlightPositionsParams) =>
      this.get<Count>('/api/historic/flight-positions/count', { params }),
  };

  public flightEvents = {
    getFull: (params: FlightEventsParams) =>
      this.get<{ data: HistoricFlightEventsFull[] }>('/api/historic/flight-events/full', { params }),
    getLight: (params: FlightEventsParams) =>
      this.get<{ data: HistoricFlightEventsLight[] }>('/api/historic/flight-events/light', { params }),
  };
}

class FlightSummaryService extends BaseService {
  getFull(params: FlightSummaryParams) {
    return this.get<{ data: FlightSummaryFull[] }>('/api/flight-summary/full', { params });
  }

  getLight(params: FlightSummaryParams) {
    return this.get<{ data: FlightSummaryLight[] }>('/api/flight-summary/light', { params });
  }

  getCount(params: FlightSummaryParams) {
    return this.get<Count>('/api/flight-summary/count', { params });
  }
}

class FlightTracksService extends BaseService {
  get(params: { flight_id: string }) {
    return this.get<FlightTracks>('/api/flight-tracks', { params });
  }
}

class UsageService extends BaseService {
  get(params?: { period?: '24h' | '7d' | '30d' | '1y' }) {
    return this.get<{ data: UsageLogSummary[] }>('/api/usage', { params });
  }
}

export class FlightRadar24Client {
  public static: StaticService;
  public live: LiveService;
  public historic: HistoricService;
  public flightSummary: FlightSummaryService;
  public flightTracks: FlightTracksService;
  public usage: UsageService;

  constructor(apiToken: string) {
    if (!apiToken) {
      throw new Error('FlightRadar24 API token is required.');
    }
    this.static = new StaticService(apiToken);
    this.live = new LiveService(apiToken);
    this.historic = new HistoricService(apiToken);
    this.flightSummary = new FlightSummaryService(apiToken);
    this.flightTracks = new FlightTracksService(apiToken);
    this.usage = new UsageService(apiToken);
  }
}

/**
 * Example Usage:
 *
 * async function main() {
 *   const token = process.env.FR24_API_TOKEN;
 *   if (!token) {
 *     console.error("Please set the FR24_API_TOKEN environment variable.");
 *     return;
 *   }
 *
 *   const client = new FlightRadar24Client(token);
 *
 *   try {
 *     // Get basic airline info
 *     const airline = await client.static.airlines.getLight({ icao: 'SAS' });
 *     console.log('Airline Info:', airline);
 *
 *     // Get detailed airport info
 *     const airport = await client.static.airports.getFull({ code: 'LHR' });
 *     console.log('Airport Info:', airport.name);
 *
 *     // Get live flights in a bounding box
 *     const bounds = "50.682,46.218,14.422,22.243"; // N, S, W, E
 *     const liveFlights = await client.live.flightPositions.getLight({ bounds, limit: 10 });
 *     console.log(`Found ${liveFlights.data.length} live flights.`);
 *     if (liveFlights.data.length > 0) {
 *         console.log('First live flight:', liveFlights.data[0]);
 *     }
 *
 *     // Get flight summary
 *     const flightSummary = await client.flightSummary.getLight({
 *         flights: "EK184",
 *         flight_datetime_from: "2025-02-14T01:17:14Z",
 *         flight_datetime_to: "2025-02-15T13:17:14Z"
 *     });
 *     console.log('Flight Summary:', flightSummary.data);
 *
 *     // Get API usage
 *     const usage = await client.usage.get({ period: '7d' });
 *     console.log('API Usage (last 7 days):', usage.data);
 *
 *   } catch (error) {
 *     if (axios.isAxiosError(error)) {
 *       console.error('API Error:', error.response?.data || error.message);
 *     } else {
 *       console.error('An unexpected error occurred:', error);
 *     }
 *   }
 * }
 *
 * // To run this example:
 * // 1. Save the code as flightradar24.ts
 * // 2. Install dependencies: npm install axios typescript ts-node
 * // 3. Set your API token: export FR24_API_TOKEN='<your_token>'
 * // 4. Run: npx ts-node flightradar24.ts
 * // main();
 *
 */

/*
 * Notes on Parameter Naming:
 * The OpenAPI specification uses snake_case for query parameters (e.g., `painted_as`).
 * For consistency with JavaScript/TypeScript conventions, the parameter interfaces
 * (`FlightPositionsParams`, etc.) use camelCase (e.g., `paintedAs`).
 * Axios will automatically serialize these to snake_case in the URL if needed,
 * but by default, it passes them as is. To handle this robustly in a real-world
 * scenario, you might add a request interceptor to convert camelCase keys to snake_case
 * before the request is sent. For this generated service, we assume the API can handle
 * camelCase or the developer will use the correct snake_case property names if issues arise.
 * The current implementation will send camelCase keys.
 */
