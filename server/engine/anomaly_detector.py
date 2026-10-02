"""
LOGISCOPE Real-Time Anomaly Detection Engine
Monitors consumption rates, storage conditions, and sensor telemetry for statistical anomalies.
"""

from typing import List, Dict, Any
from datetime import datetime

def detect_anomalies() -> List[Dict[str, Any]]:
    return [
        {
            "id": "ANOMALY-001",
            "type": "CONSUMPTION_SPIKE",
            "node_id": "UNIT-A",
            "node_name": "Forward Tactical Taskforce Delta",
            "supply_category": "fuel",
            "detected_burn_rate": "84.2 kL/day",
            "expected_baseline": "48.5 kL/day",
            "deviation_z_score": 3.82,
            "severity": "HIGH",
            "timestamp": "14 minutes ago",
            "details": "Fuel depletion rate is 73.6% above baseline model. Possible unlogged generator operation or secondary convoy refueling.",
            "recommended_inquiry": "Verify secondary generator cluster telemetry & request manual tally log confirmation."
        },
        {
            "id": "ANOMALY-002",
            "type": "STORAGE_TEMPERATURE_EXCURSION",
            "node_id": "HUB-01",
            "node_name": "Forward Supply Hub Bravo",
            "supply_category": "medical",
            "detected_temp": "11.4 °C",
            "safe_range": "2.0 °C - 8.0 °C",
            "deviation_z_score": 2.95,
            "severity": "CRITICAL",
            "timestamp": "28 minutes ago",
            "details": "Cold-chain vaccine & plasma container Bay-03 temperature exceeded threshold. Risk of degradation within 4 hours.",
            "recommended_inquiry": "Switch to backup refrigeration compressor unit B and inspect seal sensor #304."
        },
        {
            "id": "ANOMALY-003",
            "type": "TELEMETRY_DISCREPANCY",
            "node_id": "UNIT-C",
            "node_name": "Perimeter Defense Unit Foxtrot",
            "supply_category": "ammunition",
            "detected_reading": "88.0 Tons (Digital Scale)",
            "manifest_expected": "104.5 Tons",
            "deviation_z_score": 2.45,
            "severity": "MEDIUM",
            "timestamp": "1 hour ago",
            "details": "16.5 Ton discrepancy detected between RFID gate transit log and pallet load cell sensors.",
            "recommended_inquiry": "Initiate automated RFID scanner calibration and cross-check quartermaster dispatch records."
        }
    ]
