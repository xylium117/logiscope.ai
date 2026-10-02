"""
LOGISCOPE Demand Forecasting Engine
Multivariate Spatio-Temporal Forecasting Model with Realistic Depletion Physics & Cumulative Uncertainty Bands
"""

from typing import List, Dict, Any
import numpy as np
from .digital_twin import LogisticsNode, NodeInventory

TEMPO_COMMODITY_MULTIPLIERS = {
    "LOW": {"fuel": 0.75, "ammunition": 0.30, "rations": 0.95, "medical": 0.70, "spare_parts": 0.65},
    "NORMAL": {"fuel": 1.00, "ammunition": 1.00, "rations": 1.00, "medical": 1.00, "spare_parts": 1.00},
    "HIGH": {"fuel": 1.45, "ammunition": 1.65, "rations": 1.12, "medical": 1.40, "spare_parts": 1.45},
    "SURGE": {"fuel": 1.90, "ammunition": 2.60, "rations": 1.25, "medical": 2.20, "spare_parts": 2.10}
}

WEATHER_COMMODITY_MULTIPLIERS = {
    "CLEAR": {"fuel": 1.00, "ammunition": 1.00, "rations": 1.00, "medical": 1.00, "spare_parts": 1.00},
    "FOG": {"fuel": 1.10, "ammunition": 1.05, "rations": 1.00, "medical": 1.05, "spare_parts": 1.08},
    "RAIN": {"fuel": 1.18, "ammunition": 1.10, "rations": 1.05, "medical": 1.15, "spare_parts": 1.20},
    "HEAVY_STORM": {"fuel": 1.35, "ammunition": 1.20, "rations": 1.12, "medical": 1.30, "spare_parts": 1.40},
    "SNOW_ICE": {"fuel": 1.48, "ammunition": 1.15, "rations": 1.25, "medical": 1.42, "spare_parts": 1.50},
    "EXTREME_COLD": {"fuel": 1.55, "ammunition": 1.12, "rations": 1.30, "medical": 1.50, "spare_parts": 1.55}
}

BASE_RATES = {
    "fuel": 0.18,
    "ammunition": 0.08,
    "rations": 0.40,
    "medical": 0.12,
    "spare_parts": 0.05
}

def generate_7day_demand_forecast(
    node: LogisticsNode,
    tempo_override: str | None = None,
    weather_override: str | None = None,
    demand_surge_pct: float = 0.0
) -> Dict[str, Any]:
    tempo = tempo_override or node.operational_tempo or "NORMAL"
    weather = weather_override or node.weather_condition or "CLEAR"

    t_mults = TEMPO_COMMODITY_MULTIPLIERS.get(tempo, TEMPO_COMMODITY_MULTIPLIERS["NORMAL"])
    w_mults = WEATHER_COMMODITY_MULTIPLIERS.get(weather, WEATHER_COMMODITY_MULTIPLIERS["CLEAR"])
    surge_mult = 1.0 + (demand_surge_pct / 100.0)

    elev = getattr(node, 'elevation_m', 1500)
    alt_penalty = 1.0 + max(0.0, (elev - 1000.0) / 10000.0) * 0.40

    terrain = getattr(node, 'terrain_type', 'PLAINS')
    terrain_fuel_mult = 1.25 if 'MOUNTAIN' in terrain else (1.15 if 'DESERT' in terrain else 1.0)
    terrain_parts_mult = 1.30 if 'MOUNTAIN' in terrain else (1.40 if 'DESERT' in terrain else 1.0)

    active_sensors = getattr(node, 'iot_sensors_active', 8)
    sensor_variance_reduction = 1.0 / np.sqrt(1.0 + active_sensors / 10.0)

    p_count = node.personnel_count

    base_daily_burn = {
        "fuel": p_count * BASE_RATES["fuel"] * t_mults["fuel"] * w_mults["fuel"] * surge_mult * alt_penalty * terrain_fuel_mult,
        "ammunition": p_count * BASE_RATES["ammunition"] * t_mults["ammunition"] * w_mults["ammunition"] * surge_mult,
        "rations": (p_count / 100.0) * BASE_RATES["rations"] * 10.0 * t_mults["rations"] * w_mults["rations"] * surge_mult * (1.0 + (alt_penalty - 1.0) * 0.35),
        "medical": p_count * BASE_RATES["medical"] * 0.5 * t_mults["medical"] * w_mults["medical"] * surge_mult,
        "spare_parts": p_count * BASE_RATES["spare_parts"] * 0.4 * t_mults["spare_parts"] * w_mults["spare_parts"] * surge_mult * terrain_parts_mult
    }

    categories = ["fuel", "ammunition", "rations", "medical", "spare_parts"]
    days = ["Day 0 (Now)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6", "Day +7"]

    seed_val = sum(ord(c) for c in (node.id or "NODE")) % 10000
    rng = np.random.RandomState(seed_val)

    series_by_category: Dict[str, Any] = {}
    current_inv = node.current_inventory.model_dump()
    safety_inv = node.safety_stock.model_dump()

    for cat in categories:
        burn_mean = base_daily_burn[cat]
        start_val = float(current_inv[cat])
        safety_val = float(safety_inv[cat])

        projected_stock = [round(start_val, 1)]
        forecast_demand = [0.0]
        upper_bound = [round(start_val, 1)]
        lower_bound = [round(start_val, 1)]

        ar_noise = rng.normal(0, 0.04, 7)
        cum_burn_mean = 0.0
        cum_var = 0.0
        daily_sigma = burn_mean * 0.09 * sensor_variance_reduction

        running_stock = start_val
        for d in range(1, 8):

            cycle_factor = 1.0 + (0.05 * np.sin((d + seed_val % 4) * 0.9)) + ar_noise[d - 1]
            day_burn = max(burn_mean * 0.4, burn_mean * cycle_factor)

            cum_burn_mean += day_burn
            running_stock = max(0.0, start_val - cum_burn_mean)

            cum_var += (daily_sigma ** 2) * (1.0 + 0.3 * (d - 1))
            cum_sigma = np.sqrt(cum_var)

            ci_spread = 1.96 * cum_sigma
            ub = max(0.0, start_val - max(0.0, cum_burn_mean - ci_spread))
            lb = max(0.0, start_val - (cum_burn_mean + ci_spread))

            projected_stock.append(float(round(running_stock, 1)))
            forecast_demand.append(float(round(day_burn, 1)))
            upper_bound.append(float(round(ub, 1)))
            lower_bound.append(float(round(lb, 1)))

        hours_to_safety_breach = None
        hours_to_stockout = None

        for i in range(1, 8):
            prev_s = projected_stock[i - 1]
            curr_s = projected_stock[i]

            if prev_s >= safety_val and curr_s < safety_val and hours_to_safety_breach is None:
                drop = prev_s - curr_s
                if drop > 0:
                    frac = (prev_s - safety_val) / drop
                    hours_to_safety_breach = float(round(((i - 1) + frac) * 24.0, 1))

            if prev_s > 0 and curr_s <= 0 and hours_to_stockout is None:
                drop = prev_s - curr_s
                if drop > 0:
                    frac = prev_s / drop
                    hours_to_stockout = float(round(((i - 1) + frac) * 24.0, 1))

        series_by_category[cat] = {
            "current_stock": float(start_val),
            "safety_stock": float(safety_val),
            "daily_burn_rate": float(round(burn_mean, 1)),
            "projected_stock": projected_stock,
            "forecast_demand": forecast_demand,
            "upper_bound_95": upper_bound,
            "lower_bound_95": lower_bound,
            "hours_to_safety_breach": hours_to_safety_breach,
            "hours_to_stockout": hours_to_stockout
        }

    avg_demand_factor = np.mean([t_mults[c] * w_mults[c] for c in categories]) * surge_mult

    return {
        "node_id": node.id,
        "node_name": node.name,
        "days": days,
        "effective_tempo": tempo,
        "effective_weather": weather,
        "demand_factor_multiplier": round(float(avg_demand_factor), 2),
        "daily_burn_rates": {k: float(round(v, 1)) for k, v in base_daily_burn.items()},
        "categories": series_by_category
    }

