"""
LOGISCOPE Predictive Shortage Engine
Scans supply network and generates early warning alerts before stockouts occur.
"""

from typing import List, Dict, Any
from .digital_twin import LogisticsNode
from .demand_forecasting import generate_7day_demand_forecast

class ShortageAlert:
    pass

def evaluate_network_shortages(
    nodes: List[LogisticsNode],
    tempo_override: str | None = None,
    weather_override: str | None = None,
    demand_surge_pct: float = 0.0
) -> List[Dict[str, Any]]:
    alerts = []

    for node in nodes:
        forecast = generate_7day_demand_forecast(
            node,
            tempo_override=tempo_override,
            weather_override=weather_override,
            demand_surge_pct=demand_surge_pct
        )

        for cat, data in forecast["categories"].items():
            breach_h = data["hours_to_safety_breach"]
            stockout_h = data["hours_to_stockout"]

            if breach_h is not None or stockout_h is not None:
                criticality = "CRITICAL" if (breach_h and breach_h < 48) or (stockout_h and stockout_h < 72) else (
                    "HIGH" if (breach_h and breach_h < 96) else "MEDIUM"
                )

                factors = []
                if node.operational_tempo in ["HIGH", "SURGE"]:
                    factors.append(f"Elevated operational tempo ({node.operational_tempo})")
                if node.weather_condition in ["HEAVY_STORM", "RAIN", "SNOW_ICE"]:
                    factors.append(f"Adverse weather condition ({node.weather_condition})")
                if data["current_stock"] <= data["safety_stock"] * 1.2:
                    factors.append("Low initial reserve margin")
                if demand_surge_pct > 0:
                    factors.append(f"Simulated demand surge (+{demand_surge_pct}%)")

                alerts.append({
                    "id": f"SHORTAGE-{node.id}-{cat.upper()}",
                    "node_id": node.id,
                    "node_name": node.name,
                    "node_type": node.type,
                    "supply_category": cat,
                    "current_stock": data["current_stock"],
                    "safety_stock": data["safety_stock"],
                    "daily_burn_rate": data["daily_burn_rate"],
                    "hours_to_safety_breach": breach_h,
                    "hours_to_stockout": stockout_h,
                    "severity": criticality,
                    "contributing_factors": factors,
                    "burn_curve": data["projected_stock"]
                })

    alerts.sort(key=lambda x: (x["hours_to_safety_breach"] or 999, x["hours_to_stockout"] or 999))
    return alerts
