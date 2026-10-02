from typing import Dict, Any, List
import numpy as np

def get_synthetic_engine_architecture() -> Dict[str, Any]:
    return {
        "title": "LOGISCOPE Mathematical Foundations & Synthetic Data Generation Engine",
        "description": "Comprehensive technical documentation and formal mathematical breakdown of the predictive algorithms, high-altitude physics models, and synthetic digital twin generators.",
        "mathematical_models": [
            {
                "module": "1. Multivariate Spatio-Temporal Demand Forecasting",
                "formula": r"\text{Demand}_i(t) = \text{BaseRate}_i(t) \cdot M_{\text{tempo}} \cdot M_{\text{weather}} \cdot M_{\text{altitude}} \cdot M_{\text{surge}} + \epsilon(t)",
                "variables": [
                    {"symbol": r"\text{BaseRate}_i", "description": "Baseline per-capita daily consumption for supply category i (Fuel: 0.18 kL, Ammo: 0.08 t, Rations: 0.4 pallets/100 troops, Medical: 0.12 kits, Spares: 0.05 crates)"},
                    {"symbol": r"M_{\text{tempo}}", "description": "Operational tempo scalar: LOW (0.75x), NORMAL (1.00x), HIGH (1.45x), SURGE (1.90x)"},
                    {"symbol": r"M_{\text{weather}}", "description": "Thermal and precipitation stress factor: CLEAR (1.00x), FOG (1.08x), RAIN (1.15x), HEAVY_STORM (1.30x), SNOW_ICE (1.40x)"},
                    {"symbol": r"M_{\text{altitude}}", "description": "High-altitude environmental degradation factor: 1.0 + max(0, (elevation - 1000m) / 10000m * 0.40)"},
                    {"symbol": r"M_{\text{surge}}", "description": "Dynamic scenario demand surge scalar: (1.0 + DemandSurge% / 100)"},
                    {"symbol": r"\epsilon(t)", "description": "Autoregressive uncertainty propagation fanning out over the 7-day forecast horizon (sigma_cum = sigma * t^0.65)"}
                ],
                "confidence_bounds": r"\text{CI}_{95\%}(t) = \text{ProjectedStock}(t) \pm 1.96 \cdot \sigma_{\text{cum}}(t)"
            },
            {
                "module": "2. High-Altitude Terrain & Weather Dynamic Route Resilience",
                "formula": r"\text{Resilience}(r) = \max(0, \min(100, 100 - P_{\text{disrupt}}(r) + B_{\text{infra}}))",
                "variables": [
                    {"symbol": r"P_{\text{disrupt}}(r)", "description": "Composite disruption probability: min(98%, 0.40 * TerrainRisk + 0.45 * WeatherRisk)"},
                    {"symbol": r"\text{TerrainRisk}", "description": "Calculated from slope gradient, altitude (>3500m), landslide history, and river crossing vulnerability (0-100%)"},
                    {"symbol": r"\text{WeatherRisk}", "description": "Dynamic penalty from live precipitation, snowpack depth, sub-zero freeze index, and wind chill (0-100%)"},
                    {"symbol": r"B_{\text{infra}}", "description": "Structural robustness factor (+20% for reinforced national highways / all-weather tunnels like Sela Tunnel / Atal Tunnel)"},
                    {"symbol": r"\text{DynamicETA}(r)", "description": r"\text{DynamicETA}(r) = \frac{\text{Distance}}{\text{BaseSpeed} \cdot S_{\text{terrain}} \cdot S_{\text{weather}}}"}
                ]
            },
            {
                "module": "3. Constraint-Based Multi-Echelon Pre-positioning Solver",
                "formula": r"\min \sum_{j \in \text{Nodes}} \left( W_{\text{deficit}} \cdot \Delta T_{\text{shortage}, j} + \sum_{r \in \text{Routes}} P_{\text{risk}, r} \cdot X_{r} + W_{\text{cost}} \cdot C_{\text{dispatch}} \right)",
                "constraints": [
                    "Inventory Availability: TransferAmount <= SourceNode_Reserve - SafetyBuffer",
                    "Storage Capacity: TargetNode_Current + TransferAmount <= MaxCapacity",
                    "Fleet Lift Limit: TransferTonnage <= Sum(AvailableConvoyCapacity)",
                    "Corridor Throughput: DispatchedTrucks <= Route_TrucksPerDayCapacity",
                    "Lead-Time Feasibility: LeadTime + TransferETA < PredictedShortageHours"
                ]
            },
            {
                "module": "4. Real-Time Statistical Telemetry Anomaly Radar",
                "formula": r"Z = \frac{x_{\text{observed}} - \mu_{\text{baseline}}}{\sigma_{\text{baseline}}}",
                "criteria": [
                    "Consumption Spike: Z >= +3.0σ -> Flagged as Consumption Anomaly (possible fuel siphoning, fuel line burst, or unlogged surge)",
                    "Cold-Chain Excursion: Storage Temperature > 8.0°C or < 2.0°C -> Critical Medical & Plasma Degradation Alarm",
                    "Sensor Delta: |RFID_Transit_Count - Scale_Load_Reading| >= 2.0σ -> Weight-Scale Manifest Discrepancy Alert"
                ]
            }
        ],
        "synthetic_generation_methodology": {
            "spatial_topology": "Built from authentic geographic coordinates across Northern Frontiers (Ladakh & Kashmir: Leh, Srinagar, Uri, Kargil, Dras, Siachen, DBO, Pangong), Central Himalayas (Rishikesh, Joshimath, Mana Pass, Dharchula, Niti), and Eastern Frontiers (Guwahati, Tezpur, Bomdila, Tawang, Sela Tunnel, Kibithu, Dinjan, Tuting).",
            "elevation_modeling": "Accurately represents real elevations ranging from 73m (Tezpur Assam Valley) to 5,545m (Mana Pass & Siachen Glacier), feeding directly into physics-based vehicle speed degradation and oxygen-deprivation engine curves.",
            "operational_relevance": "Mirrors the unique logistical challenges of the Indian Armed Forces in High Altitude and Extreme Cold Climate (HA-ECC) theaters, where seasonal pass closures cut ground lines of communication for up to 6 months without digital pre-positioning."
        },
        "why_synthetic_digital_twins": [
            {
                "heading": "Zero Classified Operational Security (OPSEC) Exposure",
                "content": "Live military supply levels, ordnance counts, and frontline positions are classified under national security. A mathematically rigorous synthetic twin enables end-to-end AI validation, C2 stress-testing, and training without risking any real-world defense data leakage."
            },
            {
                "heading": "Cold-Start & Black Swan Stress Testing",
                "content": "Historical data cannot predict extreme compound shocks (e.g., simultaneous Zojila blizzard + DS-DBO bridge washout + Tawang demand surge). Synthetic generation allows planners to inject catastrophic multi-echelon scenarios that have never occurred in peacetime."
            },
            {
                "heading": "Continuous Hardware-in-the-Loop Telemetry Simulation",
                "content": "Simulates 1,000+ IoT sensors (ultrasonic fuel probes, cold-chain temperature tags, RFID transit gates, strain gauges) with realistic physical noise, thermal contraction, and Gaussian sensor drift."
            }
        ]
    }

def simulate_interactive_synthetic(
    altitude_m: int = 3500,
    temperature_c: float = -15.0,
    tempo: str = "HIGH",
    weather: str = "SNOW_ICE",
    sensor_noise_pct: float = 3.5,
    troops: int = 500
) -> Dict[str, Any]:
    tempo_factors = {"LOW": 0.75, "NORMAL": 1.00, "HIGH": 1.45, "SURGE": 1.90}
    weather_factors = {"CLEAR": 1.00, "FOG": 1.08, "RAIN": 1.15, "HEAVY_STORM": 1.30, "SNOW_ICE": 1.40}

    t_m = tempo_factors.get(tempo, 1.0)
    w_m = weather_factors.get(weather, 1.0)
    alt_m = 1.0 + max(0.0, (altitude_m - 2500) / 1000.0 * 0.08)
    temp_m = 1.0 + max(0.0, (-temperature_c) * 0.025)

    composite_multiplier = round(t_m * w_m * alt_m * temp_m, 3)
    base_fuel_daily = troops * 0.18
    actual_fuel_daily = round(base_fuel_daily * composite_multiplier, 1)

    initial_stock = 600.0
    stock_curve = []
    current = initial_stock
    for d in range(8):
        if d == 0:
            stock_curve.append(current)
        else:
            noise = np.random.normal(0, (sensor_noise_pct / 100.0) * actual_fuel_daily)
            burn = max(5.0, actual_fuel_daily + noise)
            current = max(0.0, current - burn)
            stock_curve.append(round(current, 1))

    ultrasonic_level_pct = round(max(0.0, min(100.0, (stock_curve[0] / initial_stock) * 100.0 + np.random.normal(0, sensor_noise_pct * 0.2))), 1)
    cold_chain_temp = round(4.0 + (temperature_c * 0.05) + np.random.normal(0, 0.4), 1)
    z_score_simulated = round((actual_fuel_daily - base_fuel_daily) / (base_fuel_daily * 0.15 + 1e-5), 2)

    return {
        "inputs": {
            "altitude_m": altitude_m,
            "temperature_c": temperature_c,
            "tempo": tempo,
            "weather": weather,
            "sensor_noise_pct": sensor_noise_pct,
            "troops": troops
        },
        "intermediate_multipliers": {
            "tempo_multiplier": t_m,
            "weather_multiplier": w_m,
            "altitude_multiplier": round(alt_m, 3),
            "temperature_freeze_multiplier": round(temp_m, 3),
            "composite_demand_factor": composite_multiplier
        },
        "daily_burn_calculated": {
            "base_nominal_fuel_kL": round(base_fuel_daily, 1),
            "synthetic_actual_fuel_kL": actual_fuel_daily,
            "delta_pct": f"+{round((composite_multiplier - 1.0) * 100, 1)}%"
        },
        "simulated_7day_stock_curve": stock_curve,
        "simulated_iot_telemetry": {
            "ultrasonic_fuel_tank_pct": ultrasonic_level_pct,
            "cold_chain_ambient_probe_c": cold_chain_temp,
            "rfid_flow_rate_liters_min": round(actual_fuel_daily * 0.8, 1),
            "statistical_z_score": z_score_simulated,
            "is_anomaly": abs(z_score_simulated) >= 2.5
        }
    }
