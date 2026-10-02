"""
LOGISCOPE Route Intelligence & Terrain/Weather Analysis Engine
Calculates dynamic route resilience, delay likelihood, and optimal tactical paths.
"""

from typing import List, Dict, Any
from .digital_twin import RouteSegment

INFRASTRUCTURE_RESILIENCE = {
    "PRIMARY_HIGHWAY": {"base_boost": 20.0, "weather_damping": 0.55, "speed_kmh": 65.0},
    "ALTERNATE_TACTICAL": {"base_boost": 8.0, "weather_damping": 0.80, "speed_kmh": 50.0},
    "AIR_CORRIDOR": {"base_boost": 25.0, "weather_damping": 0.30, "speed_kmh": 220.0},
    "MOUNTAIN_PASS": {"base_boost": 0.0, "weather_damping": 1.25, "speed_kmh": 35.0}
}

def analyze_routes(
    routes: List[RouteSegment],
    weather_override: str | None = None,
    blocked_route_ids: List[str] | None = None
) -> List[Dict[str, Any]]:
    results = []
    blocked_ids = blocked_route_ids or []

    for route in routes:
        is_blocked = route.id in blocked_ids or route.is_blocked
        infra = INFRASTRUCTURE_RESILIENCE.get(route.type, {"base_boost": 5.0, "weather_damping": 1.0, "speed_kmh": 45.0})

        base_w_risk = route.weather_risk
        effective_weather_risk = base_w_risk

        if weather_override:
            w = weather_override.upper()
            if w == "HEAVY_STORM":
                effective_weather_risk = min(95.0, base_w_risk + (30.0 * infra["weather_damping"]))
            elif w == "RAIN":
                effective_weather_risk = min(85.0, base_w_risk + (15.0 * infra["weather_damping"]))
            elif w == "SNOW_ICE":
                effective_weather_risk = min(98.0, base_w_risk + (40.0 * infra["weather_damping"]))
            elif w == "FOG":
                effective_weather_risk = min(75.0, base_w_risk + (18.0 * (1.5 if route.type == "AIR_CORRIDOR" else 0.7)))
            elif w == "CLEAR":
                effective_weather_risk = max(5.0, base_w_risk * 0.4)

        disruption_prob = min(98.0, (route.terrain_risk * 0.40) + (effective_weather_risk * 0.45))
        if is_blocked:
            disruption_prob = 100.0

        resilience_score = max(5.0, min(99.0, 100.0 - disruption_prob + (infra["base_boost"] if not is_blocked else 0)))
        if is_blocked:
            resilience_score = 0.0

        avg_speed_kmh = infra["speed_kmh"]
        weather_spd = 0.65 if effective_weather_risk > 65 else (0.85 if effective_weather_risk > 35 else 1.0)
        terrain_spd = 0.70 if route.terrain_risk > 50 else (0.90 if route.terrain_risk > 20 else 1.0)

        effective_speed = max(18.0, avg_speed_kmh * weather_spd * terrain_spd)
        dynamic_eta_hours = round(route.distance_km / effective_speed, 2)

        if is_blocked:
            tactical_status = "AVOID"
            status_reason = "CRITICAL: Route Blocked / Impassable"
        elif resilience_score >= 68.0:
            tactical_status = "RECOMMENDED"
            status_reason = "All-weather corridor with engineered drainage & priority clearance"
        elif resilience_score >= 42.0:
            tactical_status = "CAUTION"
            status_reason = "Passable with convoy speed restrictions and active monitoring"
        else:
            tactical_status = "AVOID"
            status_reason = "High hazard risk: Unpaved mountain pass vulnerable to storm disruption"

        results.append({
            "id": route.id,
            "theater": route.theater,
            "name": route.name,
            "source_id": route.source_id,
            "target_id": route.target_id,
            "type": route.type,
            "distance_km": route.distance_km,
            "base_eta_hours": route.base_eta_hours,
            "dynamic_eta_hours": dynamic_eta_hours if not is_blocked else None,
            "terrain_risk": round(route.terrain_risk, 1),
            "weather_risk": round(effective_weather_risk, 1),
            "disruption_prob": round(disruption_prob, 1),
            "resilience_score": round(resilience_score, 1),
            "tactical_status": tactical_status,
            "status_reason": status_reason,
            "capacity_trucks_day": route.capacity_trucks_day,
            "is_blocked": is_blocked,
            "bottleneck_warning": status_reason if (is_blocked or tactical_status == "AVOID") else route.bottleneck_warning,
            "coordinates": route.coordinates
        })

    return results

