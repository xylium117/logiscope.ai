export interface TheaterMetadata {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  description: string;
}

export interface NetworkVariation {
  id: string;
  name: string;
  badge: string;
  description: string;
  operational_posture: string;
  tempo_modifier: string;
  active_routes_ratio: string;
  risk_profile: 'MODERATE' | 'HIGH' | 'CRITICAL' | 'SEVERE';
  key_mechanic: string;
}

export interface HistoricalCase {
  id: string;
  year: string;
  title: string;
  theater: string;
  theater_name: string;
  badge: string;
  conflict_name: string;
  scenario_overview: string;
  historical_failure_point: string;
  supply_bottlenecks: string[];
  historical_manual_outcome: {
    stockout_delay_days: string;
    artillery_or_fuel_shortage: string;
    convoys_attrition: string;
    reactive_emergency_airdrop: string;
  };
  digital_twin_ai_solution: {
    proactive_actions: string[];
    simulated_readiness_gain: string;
    prevented_shortages_pct: string;
    lead_time_buffer_hours: string;
    dynamic_rerouting_strategy: string;
  };
  key_routes_involved: string[];
  key_nodes_involved: string[];
  simulation_params: {
    weather_condition: string;
    transport_availability_pct: number;
    demand_surge_pct: number;
    blocked_route_ids: string[];
  };
}

export interface NodeInventory {
  fuel: number;
  ammunition: number;
  rations: number;
  medical: number;
  spare_parts: number;
}

export interface LogisticsNode {
  id: string;
  theater: string;
  name: string;
  type: 'DEPOT' | 'HUB' | 'FORWARD_UNIT';
  lat: number;
  lng: number;
  elevation_m: number;
  readiness_index: number;
  operational_tempo: 'LOW' | 'NORMAL' | 'HIGH' | 'SURGE';
  personnel_count: number;
  current_inventory: NodeInventory;
  safety_stock: NodeInventory;
  max_capacity: NodeInventory;
  weather_condition: 'CLEAR' | 'RAIN' | 'HEAVY_STORM' | 'SNOW_ICE' | 'FOG';
  terrain_type: 'MOUNTAINOUS' | 'HIGH_ALTITUDE_PASS' | 'VALLEY' | 'RIVER_CROSSING' | 'JUNGLE_RIDGE';
  iot_sensors_active: number;
  last_telemetry_time: string;
}

export interface RouteSegment {
  id: string;
  theater: string;
  source_id: string;
  target_id: string;
  name: string;
  type: 'PRIMARY_HIGHWAY' | 'ALTERNATE_TACTICAL' | 'MOUNTAIN_PASS' | 'AIR_CORRIDOR';
  distance_km: number;
  base_eta_hours: number;
  dynamic_eta_hours?: number | null;
  coordinates: [number, number][];
  terrain_risk: number;
  weather_risk: number;
  disruption_prob: number;
  resilience_score: number;
  tactical_status?: 'RECOMMENDED' | 'CAUTION' | 'AVOID';
  status_reason?: string | null;
  capacity_trucks_day: number;
  is_blocked: boolean;
  bottleneck_warning?: string | null;
}

export interface TransportAsset {
  id: string;
  theater: string;
  name: string;
  type: 'HEAVY_CONVOY' | 'TACTICAL_TRUCK' | 'AIR_TRANSPORT' | 'RAPID_SUPPORT';
  assigned_node: string;
  capacity_tons: number;
  fuel_pct: number;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'MAINTENANCE' | 'REALLOCATED';
  current_route_id?: string | null;
  lat: number;
  lng: number;
}

export interface CategoryForecast {
  current_stock: number;
  safety_stock: number;
  daily_burn_rate: number;
  projected_stock: number[];
  forecast_demand: number[];
  upper_bound_95: number[];
  lower_bound_95: number[];
  hours_to_safety_breach: number | null;
  hours_to_stockout: number | null;
}

export interface NodeForecast {
  node_id: string;
  node_name: string;
  days: string[];
  effective_tempo: string;
  effective_weather: string;
  demand_factor_multiplier: number;
  daily_burn_rates: Record<string, number>;
  categories: Record<string, CategoryForecast>;
}

export interface ShortageAlert {
  id: string;
  node_id: string;
  node_name: string;
  node_type: string;
  supply_category: string;
  current_stock: number;
  safety_stock: number;
  daily_burn_rate: number;
  hours_to_safety_breach: number | null;
  hours_to_stockout: number | null;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  contributing_factors: string[];
  burn_curve: number[];
}

export interface Recommendation {
  id: string;
  type: 'PRE_POSITION_INVENTORY' | 'ROUTE_DIVERSION' | 'FLEET_REALLOCATION';
  title: string;
  urgency: 'URGENT' | 'RECOMMENDED' | 'MODERATE';
  action_summary: string;
  source_node?: string;
  target_node?: string;
  supply_category?: string;
  transfer_amount?: number;
  route_recommended?: string;
  primary_route?: string;
  alternate_route?: string;
  expected_impact: Record<string, string>;
  confidence_score: number;
  explanation: {
    reasons: string[];
    key_metrics: Record<string, string>;
  };
}

export interface SimulationResult {
  scenario_parameters: {
    weather_condition: string;
    transport_availability_pct: number;
    demand_surge_pct: number;
    blocked_routes_count: number;
    blocked_route_ids: string[];
  };
  without_mitigation: {
    network_readiness_index: number;
    total_predicted_shortages: number;
    critical_shortages_count: number;
    high_shortages_count: number;
    fleet_shortfall_trucks: number;
    average_route_delay_hours: string;
    mission_failure_risk: string;
    shortage_details: ShortageAlert[];
  };
  with_ai_mitigation: {
    network_readiness_index: number;
    readiness_gain: number;
    shortages_avoided_count: number;
    avoided_shortages: Array<{
      node_name: string;
      supply_category: string;
      original_depletion_hours: number;
      mitigated_status: string;
      action_taken: string;
    }>;
    remaining_manageable_risks: number;
    average_route_delay_hours: string;
    mission_success_rate: string;
    recommended_action_plan: Recommendation[];
  };
  node_comparisons: Array<{
    node_id: string;
    node_name: string;
    node_type: string;
    unmitigated_status: string;
    unmitigated_time_to_shortage: string;
    mitigated_status: string;
    mitigated_readiness: string;
  }>;
}

export interface Anomaly {
  id: string;
  type: string;
  node_id: string;
  node_name: string;
  supply_category: string;
  detected_burn_rate?: string;
  expected_baseline?: string;
  detected_temp?: string;
  safe_range?: string;
  detected_reading?: string;
  manifest_expected?: string;
  deviation_z_score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  details: string;
  recommended_inquiry: string;
}

export interface IoTEvent {
  sensor_id: string;
  type: string;
  node_name: string;
  metric: string;
  value: string;
  status: string;
  battery: string;
  temp: string;
}

export interface SyntheticExplainerDoc {
  title: string;
  description: string;
  mathematical_models: Array<{
    module: string;
    formula: string;
    variables?: Array<{ symbol: string; description: string }>;
    confidence_bounds?: string;
    constraints?: string[];
    criteria?: string[];
  }>;
  synthetic_generation_methodology: {
    spatial_topology: string;
    elevation_modeling: string;
    operational_relevance: string;
  };
  why_synthetic_digital_twins?: Array<{
    heading: string;
    content: string;
  }>;
}

export interface SyntheticSimulateResult {
  inputs: {
    altitude_m: number;
    temperature_c: number;
    tempo: string;
    weather: string;
    sensor_noise_pct: number;
    troops: number;
  };
  intermediate_multipliers: {
    tempo_multiplier: number;
    weather_multiplier: number;
    altitude_multiplier: number;
    temperature_freeze_multiplier: number;
    composite_demand_factor: number;
  };
  daily_burn_calculated: {
    base_nominal_fuel_kL: number;
    synthetic_actual_fuel_kL: number;
    delta_pct: string;
  };
  simulated_7day_stock_curve: number[];
  simulated_iot_telemetry: {
    ultrasonic_fuel_tank_pct: number;
    cold_chain_ambient_probe_c: number;
    rfid_flow_rate_liters_min: number;
    statistical_z_score: number;
    is_anomaly: boolean;
  };
}
