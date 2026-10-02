"""
LOGISCOPE IoT Telemetry Simulation Engine
Produces realistic real-time telemetry streams from smart depots, fuel tanks, RFID gates, and GPS fleet beacons.
"""

from typing import List, Dict, Any
import random
from datetime import datetime

def generate_live_iot_feed() -> List[Dict[str, Any]]:
    sensor_types = [
        {
            "sensor_id": "IOT-TANK-FUEL-A1",
            "type": "ULTRASONIC_FUEL_LEVEL",
            "node_name": "Base Alpha Bulk Tank 1",
            "metric": "Capacity",
            "value": f"{round(random.uniform(92.0, 96.5), 1)}%",
            "status": "HEALTHY",
            "battery": "98%",
            "temp": "21.4 °C"
        },
        {
            "sensor_id": "IOT-COLD-MED-B2",
            "type": "COLD_CHAIN_TEMPERATURE",
            "node_name": "Hub Bravo Cold Storage 2",
            "metric": "Temp",
            "value": f"{round(random.uniform(3.8, 5.2), 1)} °C",
            "status": "HEALTHY",
            "battery": "94%",
            "temp": "4.2 °C"
        },
        {
            "sensor_id": "IOT-RFID-GATE-C1",
            "type": "RFID_TRANSIT_GATE",
            "node_name": "Unit Foxtrot Checkpoint Charlie",
            "metric": "Last Tag",
            "value": f"PALLET-AMMO-{random.randint(1000, 9999)}",
            "status": "LOGGED",
            "battery": "100%",
            "temp": "26.1 °C"
        },
        {
            "sensor_id": "IOT-GPS-CONVOY-01",
            "type": "GPS_TELEMETRY_BEACON",
            "node_name": "Heavy Convoy Alpha-1",
            "metric": "Speed / Altitude",
            "value": f"{random.randint(52, 68)} km/h | 480m elev",
            "status": "TRANSMITTING",
            "battery": "91%",
            "temp": "23.0 °C"
        },
        {
            "sensor_id": "IOT-LOAD-CELL-D4",
            "type": "PALLET_SCALE_CELL",
            "node_name": "Taskforce Delta Ration Depot",
            "metric": "Weight Readout",
            "value": f"{round(random.uniform(570.0, 590.0), 1)} Pallets",
            "status": "HEALTHY",
            "battery": "96%",
            "temp": "19.5 °C"
        }
    ]
    return sensor_types
