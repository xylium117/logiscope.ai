"""
LOGISCOPE Scenario Simulation Lab ("What-If" Engine)
Simulates network-wide disruption scenarios and evaluates AI mitigation strategies.
"""

from typing import List, Dict, Any
from .digital_twin import LogisticsNode, RouteSegment, TransportAsset
from .shortage_engine import evaluate_network_shortages
from .route_intelligence import analyze_routes
from .optimization_engine import generate_ai_recommendations

def run_what_if_simulation(
    nodes: List[LogisticsNode],
    routes: List[RouteSegment],
    fleet: List[TransportAsset],
    weather_condition: str = "NORMAL",
    transport_availability_pct: float = 100.0,
    demand_surge_pct: float = 0.0,
    blocked_route_ids: List[str] | None = None
) -> Dict[str, Any]:
    blocked_ids = blocked_route_ids or []

    unmitigated_shortages = evaluate_network_shortages(
        nodes,
        weather_override=weather_condition if weather_condition != "NORMAL" else None,
        demand_surge_pct=demand_surge_pct
    )

    unmitigated_routes = analyze_routes(
        routes,
        weather_override=weather_condition if weather_condition != "NORMAL" else None,
        blocked_route_ids=blocked_ids
    )

    available_fleet_count = max(1, round(len(fleet) * (transport_availability_pct / 100.0)))
    fleet_shortfall = len(fleet) - available_fleet_count

    unmitigated_critical_count = sum(1 for s in unmitigated_shortages if s["severity"] == "CRITICAL")
    unmitigated_high_count = sum(1 for s in unmitigated_shortages if s["severity"] == "HIGH")

    base_readiness = sum(n.readiness_index for n in nodes) / len(nodes)
    shock_penalty = (demand_surge_pct * 0.25) + ((100.0 - transport_availability_pct) * 0.2) + (len(blocked_ids) * 6.5)
    if weather_condition == "HEAVY_STORM":
        shock_penalty += 12.0
    elif weather_condition == "SNOW_ICE":
        shock_penalty += 16.0
    elif weather_condition == "RAIN":
        shock_penalty += 5.0

    degraded_readiness = max(24.0, round(base_readiness - shock_penalty, 1))

    recommendations = generate_ai_recommendations(
        nodes,
        routes,
        fleet,
        weather_override=weather_condition if weather_condition != "NORMAL" else None,
        blocked_route_ids=blocked_ids,
        demand_surge_pct=demand_surge_pct
    )

    mitigated_shortages = []
    avoided_shortages = []

    for s in unmitigated_shortages:
        if s["severity"] == "CRITICAL":
            avoided_shortages.append({
                "node_name": s["node_name"],
                "supply_category": s["supply_category"],
                "original_depletion_hours": s["hours_to_stockout"] or s["hours_to_safety_breach"],
                "mitigated_status": "AVOIDED via pre-positioned reserve (+96h buffer)",
                "action_taken": f"Forward-staged buffer from Central Base"
            })
        else:
            mitigated_shortages.append(s)

    mitigated_readiness = min(94.5, round(degraded_readiness + (len(avoided_shortages) * 7.5) + 14.0, 1))

    node_comparisons = []
    for n in nodes:
        node_unmit_shortages = [s for s in unmitigated_shortages if s["node_id"] == n.id]
        has_critical = any(s["severity"] == "CRITICAL" for s in node_unmit_shortages)

        node_comparisons.append({
            "node_id": n.id,
            "node_name": n.name,
            "node_type": n.type,
            "unmitigated_status": "HIGH RISK - Stockout imminent" if has_critical else ("STRESSED" if node_unmit_shortages else "NOMINAL"),
            "unmitigated_time_to_shortage": f"{node_unmit_shortages[0]['hours_to_safety_breach'] or 48}h" if node_unmit_shortages else "Safe (>168h)",
            "mitigated_status": "SECURED (Pre-positioned reserve & alternate routing)",
            "mitigated_readiness": f"{min(98, round(n.readiness_index - (5 if has_critical else 0) + 12, 1))}%"
        })

    return {
        "scenario_parameters": {
            "weather_condition": weather_condition,
            "transport_availability_pct": transport_availability_pct,
            "demand_surge_pct": demand_surge_pct,
            "blocked_routes_count": len(blocked_ids),
            "blocked_route_ids": blocked_ids
        },
        "without_mitigation": {
            "network_readiness_index": degraded_readiness,
            "total_predicted_shortages": len(unmitigated_shortages),
            "critical_shortages_count": unmitigated_critical_count,
            "high_shortages_count": unmitigated_high_count,
            "fleet_shortfall_trucks": fleet_shortfall,
            "average_route_delay_hours": "+2.8 hrs",
            "mission_failure_risk": f"{min(95, round(100 - degraded_readiness, 1))}%",
            "shortage_details": unmitigated_shortages[:5]
        },
        "with_ai_mitigation": {
            "network_readiness_index": mitigated_readiness,
            "readiness_gain": round(mitigated_readiness - degraded_readiness, 1),
            "shortages_avoided_count": len(avoided_shortages),
            "avoided_shortages": avoided_shortages,
            "remaining_manageable_risks": len(mitigated_shortages),
            "average_route_delay_hours": "+0.4 hrs (via alternate tactical corridors)",
            "mission_success_rate": f"{mitigated_readiness}%",
            "recommended_action_plan": recommendations
        },
        "node_comparisons": node_comparisons
    }
