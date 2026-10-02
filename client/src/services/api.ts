import { 
  LogisticsNode, 
  RouteSegment, 
  TransportAsset, 
  ShortageAlert, 
  Recommendation, 
  SimulationResult, 
  Anomaly, 
  IoTEvent, 
  NodeForecast, 
  TheaterMetadata, 
  NetworkVariation, 
  HistoricalCase, 
  SyntheticExplainerDoc, 
  SyntheticSimulateResult 
} from '../types';

const SERVER_API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000/api' : 'https://logiscope-ai.onrender.com/api')
).replace(/\/$/, '');

export async function fetchTheaters(): Promise<TheaterMetadata[]> {
  const res = await fetch(`${SERVER_API_BASE_URL}/theaters`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch theaters`);
  return await res.json();
}

export async function fetchNetworkVariations(): Promise<NetworkVariation[]> {
  const res = await fetch(`${SERVER_API_BASE_URL}/network-variations`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch network variations`);
  return await res.json();
}

export async function fetchHistoricalCases(): Promise<HistoricalCase[]> {
  const res = await fetch(`${SERVER_API_BASE_URL}/historical-cases`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch historical cases`);
  return await res.json();
}

export async function fetchOverview(theater?: string, variation?: string) {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/overview${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch overview`);
  return await res.json();
}

export async function fetchNodes(theater?: string, variation?: string): Promise<LogisticsNode[]> {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/nodes${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch nodes`);
  return await res.json();
}

export async function fetchNodeForecast(nodeId: string, tempo?: string, weather?: string): Promise<NodeForecast> {
  const params = new URLSearchParams();
  if (tempo) params.append('tempo', tempo);
  if (weather) params.append('weather', weather);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/nodes/${nodeId}/forecast${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch forecast for node ${nodeId}`);
  return await res.json();
}

export async function fetchRoutes(theater?: string, variation?: string, weather?: string): Promise<RouteSegment[]> {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  if (weather) params.append('weather', weather);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/routes${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch routes`);
  return await res.json();
}

export async function fetchShortages(theater?: string, variation?: string, weather?: string, demandSurge?: number): Promise<ShortageAlert[]> {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  if (weather) params.append('weather', weather);
  if (demandSurge !== undefined) params.append('demand_surge_pct', demandSurge.toString());
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/shortages${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch shortages`);
  return await res.json();
}

export async function fetchRecommendations(theater?: string, variation?: string, weather?: string, demandSurge?: number): Promise<Recommendation[]> {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  if (weather) params.append('weather', weather);
  if (demandSurge !== undefined) params.append('demand_surge_pct', demandSurge.toString());
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/recommendations${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch recommendations`);
  return await res.json();
}

export async function runSimulation(params: {
  theater?: string;
  variation?: string;
  weather_condition: string;
  transport_availability_pct: number;
  demand_surge_pct: number;
  blocked_route_ids: string[];
}): Promise<SimulationResult> {
  const res = await fetch(`${SERVER_API_BASE_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to run simulation`);
  return await res.json();
}

export async function run7DayForecast(theater?: string, variation?: string) {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/run-7day-forecast${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to run 7-day forecast`);
  return await res.json();
}

export async function fetchAnomalies(): Promise<Anomaly[]> {
  const res = await fetch(`${SERVER_API_BASE_URL}/anomalies`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch anomalies`);
  return await res.json();
}

export async function fetchIoTStream(): Promise<IoTEvent[]> {
  const res = await fetch(`${SERVER_API_BASE_URL}/iot/stream`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IoT telemetry stream`);
  return await res.json();
}

export async function fetchFleet(theater?: string, variation?: string): Promise<TransportAsset[]> {
  const params = new URLSearchParams();
  if (theater) params.append('theater', theater);
  if (variation) params.append('variation', variation);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${SERVER_API_BASE_URL}/fleet${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch fleet`);
  return await res.json();
}

export async function fetchSyntheticExplainer(): Promise<SyntheticExplainerDoc> {
  const res = await fetch(`${SERVER_API_BASE_URL}/synthetic-explainer`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch synthetic explainer`);
  return await res.json();
}

export async function simulateSyntheticPipeline(params: {
  altitude_m: number;
  temperature_c: number;
  tempo: string;
  weather: string;
  sensor_noise_pct: number;
  troops: number;
}): Promise<SyntheticSimulateResult> {
  const res = await fetch(`${SERVER_API_BASE_URL}/synthetic-explainer/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to simulate synthetic pipeline`);
  return await res.json();
}

export async function applyRecommendation(recId: string) {
  const res = await fetch(`${SERVER_API_BASE_URL}/recommendations/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recommendation_id: recId }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to apply recommendation`);
  return await res.json();
}
