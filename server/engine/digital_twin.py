"""
LOGISCOPE Digital Twin Engine - Indian Northern, Central & Eastern Frontier Theaters
Covers:
1. Northern Frontier: Ladakh, Kashmir Valley, Srinagar, Kargil, Dras, Siachen Glacier, DBO, Pangong Tso, Kupwara/Uri LoC.
2. Central Himalayas: Uttarakhand (Rishikesh Railhead, Joshimath, Pithoragarh, Uttarkashi, Mana Pass, Dharchula, Niti Valley).
3. Eastern Himalayas / North East: Arunachal Pradesh & Assam (Tezpur 4 Corps Base, Guwahati Railhead, Bomdila, Tawang Sector, Sela Tunnel, Dinjan/Chabua, Along, Kibithu/Walong, Tuting).

Includes 4 distinct operational Network Variations to demonstrate the full potential of LOGISCOPE:
- STANDARD: Standard Multi-Echelon Resupply Backbone
- WINTER_FREEZE: High-Altitude Winter Freeze & Pass Blockades (Air bridges & tunnel diversions active)
- TACTICAL_SURGE: High-Tempo Forward Crisis Posture (Accelerated consumption & multi-depot dynamic dispatch)
- CHOKEPOINT_STRESS: Multi-Chokepoint Disruption & Washout Stress Test (Simultaneous route cuts & AI solver mitigation)
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import copy

class NodeInventory(BaseModel):
    fuel: float
    ammunition: float
    rations: float
    medical: float
    spare_parts: float

class NodeCapacity(BaseModel):
    fuel: float
    ammunition: float
    rations: float
    medical: float
    spare_parts: float

class LogisticsNode(BaseModel):
    id: str
    theater: str
    name: str
    type: str
    lat: float
    lng: float
    elevation_m: int
    readiness_index: float
    operational_tempo: str
    personnel_count: int
    current_inventory: NodeInventory
    safety_stock: NodeInventory
    max_capacity: NodeCapacity
    weather_condition: str
    terrain_type: str
    iot_sensors_active: int
    last_telemetry_time: str

class RouteSegment(BaseModel):
    id: str
    theater: str
    source_id: str
    target_id: str
    name: str
    type: str
    distance_km: float
    base_eta_hours: float
    coordinates: List[List[float]]
    terrain_risk: float
    weather_risk: float
    disruption_prob: float
    resilience_score: float
    capacity_trucks_day: int
    is_blocked: bool = False
    bottleneck_warning: Optional[str] = None

class TransportAsset(BaseModel):
    id: str
    theater: str
    name: str
    type: str
    assigned_node: str
    capacity_tons: float
    fuel_pct: float
    status: str
    current_route_id: Optional[str] = None
    lat: float
    lng: float

THEATER_NORTH_NODES: List[LogisticsNode] = [
    LogisticsNode(
        id="DEPOT-LEH-01",
        theater="NORTHERN_LADAKH",
        name="Leh Central Base Depot (14 Corps Hub)",
        type="DEPOT",
        lat=34.1526,
        lng=77.5771,
        elevation_m=3500,
        readiness_index=96.8,
        operational_tempo="NORMAL",
        personnel_count=2400,
        current_inventory=NodeInventory(fuel=6200.0, ammunition=4100.0, rations=11500.0, medical=4800.0, spare_parts=3200.0),
        safety_stock=NodeInventory(fuel=2000.0, ammunition=1200.0, rations=3500.0, medical=1400.0, spare_parts=900.0),
        max_capacity=NodeCapacity(fuel=8000.0, ammunition=5500.0, rations=15000.0, medical=6000.0, spare_parts=4500.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=264,
        last_telemetry_time="Just now"
    ),
    LogisticsNode(
        id="DEPOT-SRINAGAR-01",
        theater="NORTHERN_LADAKH",
        name="Srinagar Chinar Corps Base & Aviation Depot",
        type="DEPOT",
        lat=34.0837,
        lng=74.7973,
        elevation_m=1585,
        readiness_index=98.2,
        operational_tempo="NORMAL",
        personnel_count=2100,
        current_inventory=NodeInventory(fuel=5900.0, ammunition=4300.0, rations=12000.0, medical=4600.0, spare_parts=3100.0),
        safety_stock=NodeInventory(fuel=1800.0, ammunition=1100.0, rations=3200.0, medical=1300.0, spare_parts=850.0),
        max_capacity=NodeCapacity(fuel=7500.0, ammunition=5200.0, rations=14000.0, medical=5500.0, spare_parts=4000.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=240,
        last_telemetry_time="Just now"
    ),
    LogisticsNode(
        id="HUB-KARGIL-02",
        theater="NORTHERN_LADAKH",
        name="Kargil Forward Supply Hub",
        type="HUB",
        lat=34.5539,
        lng=76.1349,
        elevation_m=2676,
        readiness_index=88.5,
        operational_tempo="HIGH",
        personnel_count=850,
        current_inventory=NodeInventory(fuel=1850.0, ammunition=1150.0, rations=3900.0, medical=1350.0, spare_parts=820.0),
        safety_stock=NodeInventory(fuel=750.0, ammunition=550.0, rations=1400.0, medical=480.0, spare_parts=320.0),
        max_capacity=NodeCapacity(fuel=3000.0, ammunition=2200.0, rations=6500.0, medical=2500.0, spare_parts=1500.0),
        weather_condition="SNOW_ICE",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=132,
        last_telemetry_time="8s ago"
    ),
    LogisticsNode(
        id="HUB-NUBRA-03",
        theater="NORTHERN_LADAKH",
        name="Nubra Valley Tactical Staging Hub (Diskit)",
        type="HUB",
        lat=34.5428,
        lng=77.5619,
        elevation_m=3150,
        readiness_index=91.2,
        operational_tempo="HIGH",
        personnel_count=620,
        current_inventory=NodeInventory(fuel=2400.0, ammunition=1600.0, rations=4600.0, medical=1750.0, spare_parts=1050.0),
        safety_stock=NodeInventory(fuel=800.0, ammunition=600.0, rations=1600.0, medical=550.0, spare_parts=400.0),
        max_capacity=NodeCapacity(fuel=3500.0, ammunition=2400.0, rations=7000.0, medical=2600.0, spare_parts=1600.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=98,
        last_telemetry_time="14s ago"
    ),
    LogisticsNode(
        id="HUB-URI-04",
        theater="NORTHERN_LADAKH",
        name="Uri / Baramulla Mountain Transit Hub",
        type="HUB",
        lat=34.1980,
        lng=74.0410,
        elevation_m=1363,
        readiness_index=89.6,
        operational_tempo="HIGH",
        personnel_count=580,
        current_inventory=NodeInventory(fuel=2100.0, ammunition=1400.0, rations=4200.0, medical=1550.0, spare_parts=900.0),
        safety_stock=NodeInventory(fuel=700.0, ammunition=500.0, rations=1350.0, medical=450.0, spare_parts=300.0),
        max_capacity=NodeCapacity(fuel=3200.0, ammunition=2200.0, rations=6200.0, medical=2300.0, spare_parts=1400.0),
        weather_condition="RAIN",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=88,
        last_telemetry_time="19s ago"
    ),
    LogisticsNode(
        id="UNIT-SIACHEN-01",
        theater="NORTHERN_LADAKH",
        name="Siachen Base Camp & Glacier Logistics Sector",
        type="FORWARD_UNIT",
        lat=35.1983,
        lng=77.0650,
        elevation_m=4200,
        readiness_index=72.4,
        operational_tempo="SURGE",
        personnel_count=520,
        current_inventory=NodeInventory(fuel=380.0, ammunition=210.0, rations=680.0, medical=210.0, spare_parts=95.0),
        safety_stock=NodeInventory(fuel=320.0, ammunition=200.0, rations=550.0, medical=170.0, spare_parts=80.0),
        max_capacity=NodeCapacity(fuel=950.0, ammunition=700.0, rations=1900.0, medical=600.0, spare_parts=350.0),
        weather_condition="SNOW_ICE",
        terrain_type="HIGH_ALTITUDE_PASS",
        iot_sensors_active=54,
        last_telemetry_time="3s ago"
    ),
    LogisticsNode(
        id="UNIT-DRAS-02",
        theater="NORTHERN_LADAKH",
        name="Dras High-Altitude Brigade Command",
        type="FORWARD_UNIT",
        lat=34.4281,
        lng=75.7533,
        elevation_m=3280,
        readiness_index=61.2,
        operational_tempo="SURGE",
        personnel_count=440,
        current_inventory=NodeInventory(fuel=210.0, ammunition=125.0, rations=380.0, medical=105.0, spare_parts=48.0),
        safety_stock=NodeInventory(fuel=240.0, ammunition=150.0, rations=420.0, medical=130.0, spare_parts=60.0),
        max_capacity=NodeCapacity(fuel=700.0, ammunition=500.0, rations=1400.0, medical=450.0, spare_parts=220.0),
        weather_condition="HEAVY_STORM",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=42,
        last_telemetry_time="11s ago"
    ),
    LogisticsNode(
        id="UNIT-DAULAT-03",
        theater="NORTHERN_LADAKH",
        name="DBO (Daulat Beg Oldie) Forward Outpost",
        type="FORWARD_UNIT",
        lat=35.3486,
        lng=77.9292,
        elevation_m=5065,
        readiness_index=54.8,
        operational_tempo="SURGE",
        personnel_count=360,
        current_inventory=NodeInventory(fuel=165.0, ammunition=98.0, rations=310.0, medical=82.0, spare_parts=36.0),
        safety_stock=NodeInventory(fuel=195.0, ammunition=130.0, rations=360.0, medical=110.0, spare_parts=50.0),
        max_capacity=NodeCapacity(fuel=600.0, ammunition=400.0, rations=1100.0, medical=350.0, spare_parts=180.0),
        weather_condition="SNOW_ICE",
        terrain_type="HIGH_ALTITUDE_PASS",
        iot_sensors_active=38,
        last_telemetry_time="1s ago"
    ),
    LogisticsNode(
        id="UNIT-PANGONG-04",
        theater="NORTHERN_LADAKH",
        name="Chushul / Pangong Tso Patrol Sector",
        type="FORWARD_UNIT",
        lat=33.5936,
        lng=78.6536,
        elevation_m=4350,
        readiness_index=86.7,
        operational_tempo="NORMAL",
        personnel_count=310,
        current_inventory=NodeInventory(fuel=420.0, ammunition=290.0, rations=720.0, medical=240.0, spare_parts=110.0),
        safety_stock=NodeInventory(fuel=200.0, ammunition=150.0, rations=350.0, medical=120.0, spare_parts=55.0),
        max_capacity=NodeCapacity(fuel=750.0, ammunition=500.0, rations=1300.0, medical=400.0, spare_parts=200.0),
        weather_condition="CLEAR",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=34,
        last_telemetry_time="25s ago"
    ),
    LogisticsNode(
        id="UNIT-KUPWARA-05",
        theater="NORTHERN_LADAKH",
        name="Kupwara / Tangdhar High-Altitude Outpost",
        type="FORWARD_UNIT",
        lat=34.5262,
        lng=74.2546,
        elevation_m=2850,
        readiness_index=78.4,
        operational_tempo="HIGH",
        personnel_count=390,
        current_inventory=NodeInventory(fuel=290.0, ammunition=195.0, rations=520.0, medical=165.0, spare_parts=75.0),
        safety_stock=NodeInventory(fuel=210.0, ammunition=140.0, rations=380.0, medical=120.0, spare_parts=50.0),
        max_capacity=NodeCapacity(fuel=720.0, ammunition=480.0, rations=1250.0, medical=380.0, spare_parts=190.0),
        weather_condition="SNOW_ICE",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=40,
        last_telemetry_time="12s ago"
    )
]

THEATER_NORTH_ROUTES: List[RouteSegment] = [
    RouteSegment(
        id="RT-SRINAGAR-KARGIL-ZOJILA",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-SRINAGAR-01",
        target_id="HUB-KARGIL-02",
        name="NH-1 Srinagar-Sonamarg-Zojila-Kargil Strategic Arterial",
        type="PRIMARY_HIGHWAY",
        distance_km=204.0,
        base_eta_hours=5.2,
        coordinates=[[34.0837, 74.7973], [34.3100, 75.3000], [34.5539, 76.1349]],
        terrain_risk=44.0,
        weather_risk=58.0,
        disruption_prob=51.0,
        resilience_score=68.5,
        capacity_trucks_day=35,
        bottleneck_warning="Zojila Pass sub-zero icing & avalanche hazard"
    ),
    RouteSegment(
        id="RT-SRINAGAR-URI-NH1A",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-SRINAGAR-01",
        target_id="HUB-URI-04",
        name="NH-1A Srinagar-Baramulla-Uri Highway",
        type="PRIMARY_HIGHWAY",
        distance_km=102.0,
        base_eta_hours=2.4,
        coordinates=[[34.0837, 74.7973], [34.2000, 74.3400], [34.1980, 74.0410]],
        terrain_risk=24.0,
        weather_risk=30.0,
        disruption_prob=22.0,
        resilience_score=88.0,
        capacity_trucks_day=45
    ),
    RouteSegment(
        id="RT-LEH-KARGIL-NH1D",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-LEH-01",
        target_id="HUB-KARGIL-02",
        name="NH-1D Leh-Kargil Strategic Arterial",
        type="PRIMARY_HIGHWAY",
        distance_km=216.0,
        base_eta_hours=4.8,
        coordinates=[[34.1526, 77.5771], [34.2900, 76.8500], [34.5539, 76.1349]],
        terrain_risk=28.0,
        weather_risk=35.0,
        disruption_prob=26.0,
        resilience_score=84.5,
        capacity_trucks_day=45
    ),
    RouteSegment(
        id="RT-LEH-NUBRA-KHARDUNGLA",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-LEH-01",
        target_id="HUB-NUBRA-03",
        name="Khardung La Pass Corridor (17,982 ft)",
        type="MOUNTAIN_PASS",
        distance_km=115.0,
        base_eta_hours=4.2,
        coordinates=[[34.1526, 77.5771], [34.2789, 77.6047], [34.5428, 77.5619]],
        terrain_risk=72.0,
        weather_risk=78.0,
        disruption_prob=74.0,
        resilience_score=44.0,
        capacity_trucks_day=14,
        bottleneck_warning="Heavy blizzard & black ice at Khardung La summit"
    ),
    RouteSegment(
        id="RT-LEH-NUBRA-ALT-WARILA",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-LEH-01",
        target_id="HUB-NUBRA-03",
        name="Wari La Tactical Bypass Route",
        type="ALTERNATE_TACTICAL",
        distance_km=148.0,
        base_eta_hours=5.1,
        coordinates=[[34.1526, 77.5771], [34.1200, 77.8500], [34.5428, 77.5619]],
        terrain_risk=38.0,
        weather_risk=42.0,
        disruption_prob=34.0,
        resilience_score=76.8,
        capacity_trucks_day=22
    ),
    RouteSegment(
        id="RT-KARGIL-DRAS-MAIN",
        theater="NORTHERN_LADAKH",
        source_id="HUB-KARGIL-02",
        target_id="UNIT-DRAS-02",
        name="Kargil-Dras Highway Corridor",
        type="PRIMARY_HIGHWAY",
        distance_km=58.0,
        base_eta_hours=1.8,
        coordinates=[[34.5539, 76.1349], [34.4800, 75.9200], [34.4281, 75.7533]],
        terrain_risk=48.0,
        weather_risk=65.0,
        disruption_prob=54.0,
        resilience_score=58.0,
        capacity_trucks_day=20,
        bottleneck_warning="Zojila-Dras sub-zero freeze & avalanche zone"
    ),
    RouteSegment(
        id="RT-NUBRA-SIACHEN-GLACIER",
        theater="NORTHERN_LADAKH",
        source_id="HUB-NUBRA-03",
        target_id="UNIT-SIACHEN-01",
        name="Sasoma-Siachen Base Tactical Road",
        type="MOUNTAIN_PASS",
        distance_km=82.0,
        base_eta_hours=3.2,
        coordinates=[[34.5428, 77.5619], [34.8800, 77.3200], [35.1983, 77.0650]],
        terrain_risk=66.0,
        weather_risk=72.0,
        disruption_prob=67.0,
        resilience_score=48.5,
        capacity_trucks_day=16,
        bottleneck_warning="Nubra River flash floods & moraine instability"
    ),
    RouteSegment(
        id="RT-NUBRA-DBO-DSDBO",
        theater="NORTHERN_LADAKH",
        source_id="HUB-NUBRA-03",
        target_id="UNIT-DAULAT-03",
        name="DS-DBO (Darbuk-Shyok-DBO) Strategic Highway",
        type="PRIMARY_HIGHWAY",
        distance_km=142.0,
        base_eta_hours=4.6,
        coordinates=[[34.5428, 77.5619], [34.9500, 77.8200], [35.3486, 77.9292]],
        terrain_risk=58.0,
        weather_risk=68.0,
        disruption_prob=61.0,
        resilience_score=52.0,
        capacity_trucks_day=18,
        bottleneck_warning="Shyok River bridge swelling during melt"
    ),
    RouteSegment(
        id="RT-LEH-PANGONG-CHUSHUL",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-LEH-01",
        target_id="UNIT-PANGONG-04",
        name="Leh-Chang La-Chushul Corridor",
        type="PRIMARY_HIGHWAY",
        distance_km=198.0,
        base_eta_hours=5.0,
        coordinates=[[34.1526, 77.5771], [33.9800, 78.1500], [33.5936, 78.6536]],
        terrain_risk=32.0,
        weather_risk=28.0,
        disruption_prob=24.0,
        resilience_score=88.2,
        capacity_trucks_day=32
    ),
    RouteSegment(
        id="RT-SRINAGAR-KUPWARA-AXIS",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-SRINAGAR-01",
        target_id="UNIT-KUPWARA-05",
        name="Srinagar-Sopore-Kupwara Border Corridor",
        type="PRIMARY_HIGHWAY",
        distance_km=84.0,
        base_eta_hours=2.1,
        coordinates=[[34.0837, 74.7973], [34.3000, 74.4500], [34.5262, 74.2546]],
        terrain_risk=30.0,
        weather_risk=40.0,
        disruption_prob=32.0,
        resilience_score=80.0,
        capacity_trucks_day=28
    ),
    RouteSegment(
        id="RT-LEH-DBO-AIR",
        theater="NORTHERN_LADAKH",
        source_id="DEPOT-LEH-01",
        target_id="UNIT-DAULAT-03",
        name="Leh to DBO Tactical Air Bridge (C-130J / Chinook)",
        type="AIR_CORRIDOR",
        distance_km=165.0,
        base_eta_hours=0.8,
        coordinates=[[34.1526, 77.5771], [34.7500, 77.7500], [35.3486, 77.9292]],
        terrain_risk=10.0,
        weather_risk=38.0,
        disruption_prob=18.0,
        resilience_score=92.0,
        capacity_trucks_day=24
    )
]

THEATER_CENTRAL_NODES: List[LogisticsNode] = [
    LogisticsNode(
        id="DEPOT-RISHIKESH-01",
        theater="CENTRAL_UTTARAKHAND",
        name="Rishikesh Strategic Railhead Depot",
        type="DEPOT",
        lat=30.0869,
        lng=78.2676,
        elevation_m=372,
        readiness_index=98.0,
        operational_tempo="NORMAL",
        personnel_count=2100,
        current_inventory=NodeInventory(fuel=5800.0, ammunition=3900.0, rations=10800.0, medical=4400.0, spare_parts=2900.0),
        safety_stock=NodeInventory(fuel=1800.0, ammunition=1100.0, rations=3200.0, medical=1300.0, spare_parts=850.0),
        max_capacity=NodeCapacity(fuel=7500.0, ammunition=5000.0, rations=14000.0, medical=5500.0, spare_parts=4000.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=210,
        last_telemetry_time="Just now"
    ),
    LogisticsNode(
        id="HUB-JOSHIMATH-02",
        theater="CENTRAL_UTTARAKHAND",
        name="Joshimath Mountain Brigade Hub",
        type="HUB",
        lat=30.5564,
        lng=79.5668,
        elevation_m=1875,
        readiness_index=87.4,
        operational_tempo="HIGH",
        personnel_count=720,
        current_inventory=NodeInventory(fuel=1920.0, ammunition=1240.0, rations=4100.0, medical=1480.0, spare_parts=860.0),
        safety_stock=NodeInventory(fuel=780.0, ammunition=520.0, rations=1500.0, medical=510.0, spare_parts=340.0),
        max_capacity=NodeCapacity(fuel=3200.0, ammunition=2100.0, rations=6800.0, medical=2600.0, spare_parts=1600.0),
        weather_condition="RAIN",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=105,
        last_telemetry_time="10s ago"
    ),
    LogisticsNode(
        id="HUB-PITHORAGARH-03",
        theater="CENTRAL_UTTARAKHAND",
        name="Pithoragarh Forward Support Hub",
        type="HUB",
        lat=29.5829,
        lng=80.2182,
        elevation_m=1627,
        readiness_index=90.6,
        operational_tempo="NORMAL",
        personnel_count=590,
        current_inventory=NodeInventory(fuel=2150.0, ammunition=1420.0, rations=4400.0, medical=1620.0, spare_parts=940.0),
        safety_stock=NodeInventory(fuel=720.0, ammunition=490.0, rations=1450.0, medical=480.0, spare_parts=320.0),
        max_capacity=NodeCapacity(fuel=3400.0, ammunition=2300.0, rations=6900.0, medical=2500.0, spare_parts=1550.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=92,
        last_telemetry_time="18s ago"
    ),
    LogisticsNode(
        id="UNIT-MANA-01",
        theater="CENTRAL_UTTARAKHAND",
        name="Mana Pass High Ridge Sector (18,192 ft)",
        type="FORWARD_UNIT",
        lat=30.9856,
        lng=79.4147,
        elevation_m=5545,
        readiness_index=59.4,
        operational_tempo="SURGE",
        personnel_count=380,
        current_inventory=NodeInventory(fuel=175.0, ammunition=105.0, rations=320.0, medical=86.0, spare_parts=38.0),
        safety_stock=NodeInventory(fuel=210.0, ammunition=140.0, rations=390.0, medical=115.0, spare_parts=55.0),
        max_capacity=NodeCapacity(fuel=650.0, ammunition=450.0, rations=1200.0, medical=400.0, spare_parts=200.0),
        weather_condition="HEAVY_STORM",
        terrain_type="HIGH_ALTITUDE_PASS",
        iot_sensors_active=44,
        last_telemetry_time="2s ago"
    ),
    LogisticsNode(
        id="UNIT-DHARCHULA-02",
        theater="CENTRAL_UTTARAKHAND",
        name="Dharchula / Lipulekh Frontier Pass Outpost",
        type="FORWARD_UNIT",
        lat=30.2312,
        lng=81.0435,
        elevation_m=4850,
        readiness_index=64.8,
        operational_tempo="SURGE",
        personnel_count=320,
        current_inventory=NodeInventory(fuel=190.0, ammunition=118.0, rations=345.0, medical=96.0, spare_parts=42.0),
        safety_stock=NodeInventory(fuel=215.0, ammunition=135.0, rations=375.0, medical=120.0, spare_parts=50.0),
        max_capacity=NodeCapacity(fuel=600.0, ammunition=420.0, rations=1100.0, medical=380.0, spare_parts=190.0),
        weather_condition="RAIN",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=36,
        last_telemetry_time="6s ago"
    ),
    LogisticsNode(
        id="UNIT-NITI-03",
        theater="CENTRAL_UTTARAKHAND",
        name="Niti Valley / Barahoti Alpine Post",
        type="FORWARD_UNIT",
        lat=30.9634,
        lng=79.8652,
        elevation_m=5050,
        readiness_index=74.2,
        operational_tempo="HIGH",
        personnel_count=290,
        current_inventory=NodeInventory(fuel=230.0, ammunition=145.0, rations=410.0, medical=125.0, spare_parts=58.0),
        safety_stock=NodeInventory(fuel=190.0, ammunition=125.0, rations=340.0, medical=105.0, spare_parts=45.0),
        max_capacity=NodeCapacity(fuel=580.0, ammunition=390.0, rations=1050.0, medical=340.0, spare_parts=170.0),
        weather_condition="SNOW_ICE",
        terrain_type="HIGH_ALTITUDE_PASS",
        iot_sensors_active=32,
        last_telemetry_time="15s ago"
    )
]

THEATER_CENTRAL_ROUTES: List[RouteSegment] = [
    RouteSegment(
        id="RT-RISHIKESH-JOSHIMATH-NH07",
        theater="CENTRAL_UTTARAKHAND",
        source_id="DEPOT-RISHIKESH-01",
        target_id="HUB-JOSHIMATH-02",
        name="Char Dham All-Weather Corridor (NH-07)",
        type="PRIMARY_HIGHWAY",
        distance_km=254.0,
        base_eta_hours=6.2,
        coordinates=[[30.0869, 78.2676], [30.2800, 78.9800], [30.5564, 79.5668]],
        terrain_risk=42.0,
        weather_risk=52.0,
        disruption_prob=46.0,
        resilience_score=72.5,
        capacity_trucks_day=38
    ),
    RouteSegment(
        id="RT-JOSHIMATH-MANA-PRIMARY",
        theater="CENTRAL_UTTARAKHAND",
        source_id="HUB-JOSHIMATH-02",
        target_id="UNIT-MANA-01",
        name="Joshimath-Badrinath-Mana Pass Axis",
        type="MOUNTAIN_PASS",
        distance_km=74.0,
        base_eta_hours=3.4,
        coordinates=[[30.5564, 79.5668], [30.7400, 79.4900], [30.9856, 79.4147]],
        terrain_risk=68.0,
        weather_risk=74.0,
        disruption_prob=71.0,
        resilience_score=43.5,
        capacity_trucks_day=14,
        bottleneck_warning="Landslide active at Lambagad & high snow at Mana"
    ),
    RouteSegment(
        id="RT-JOSHIMATH-NITI-AXIS",
        theater="CENTRAL_UTTARAKHAND",
        source_id="HUB-JOSHIMATH-02",
        target_id="UNIT-NITI-03",
        name="Joshimath-Malari-Niti Valley Strategic Road",
        type="MOUNTAIN_PASS",
        distance_km=88.0,
        base_eta_hours=3.6,
        coordinates=[[30.5564, 79.5668], [30.7000, 79.7200], [30.9634, 79.8652]],
        terrain_risk=54.0,
        weather_risk=60.0,
        disruption_prob=56.0,
        resilience_score=62.0,
        capacity_trucks_day=15
    ),
    RouteSegment(
        id="RT-PITHORAGARH-DHARCHULA",
        theater="CENTRAL_UTTARAKHAND",
        source_id="HUB-PITHORAGARH-03",
        target_id="UNIT-DHARCHULA-02",
        name="Tanakpur-Dharchula-Lipulekh Strategic Road",
        type="PRIMARY_HIGHWAY",
        distance_km=112.0,
        base_eta_hours=3.8,
        coordinates=[[29.5829, 80.2182], [29.8500, 80.5400], [30.2312, 81.0435]],
        terrain_risk=55.0,
        weather_risk=62.0,
        disruption_prob=58.0,
        resilience_score=56.0,
        capacity_trucks_day=16,
        bottleneck_warning="Kali River gorge debris falls & road erosion"
    )
]

THEATER_EAST_NODES: List[LogisticsNode] = [
    LogisticsNode(
        id="DEPOT-TEZPUR-01",
        theater="EASTERN_ARUNACHAL",
        name="Tezpur 4 Corps Strategic Logistics Base (Gajraj Corps)",
        type="DEPOT",
        lat=26.6528,
        lng=92.7926,
        elevation_m=73,
        readiness_index=97.5,
        operational_tempo="NORMAL",
        personnel_count=2600,
        current_inventory=NodeInventory(fuel=6800.0, ammunition=4600.0, rations=12500.0, medical=5200.0, spare_parts=3500.0),
        safety_stock=NodeInventory(fuel=2200.0, ammunition=1300.0, rations=3800.0, medical=1500.0, spare_parts=950.0),
        max_capacity=NodeCapacity(fuel=9000.0, ammunition=6000.0, rations=16000.0, medical=6500.0, spare_parts=4800.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=280,
        last_telemetry_time="Just now"
    ),
    LogisticsNode(
        id="HUB-BOMDILA-02",
        theater="EASTERN_ARUNACHAL",
        name="Bomdila Forward Staging Hub",
        type="HUB",
        lat=27.2644,
        lng=92.4159,
        elevation_m=2415,
        readiness_index=89.2,
        operational_tempo="HIGH",
        personnel_count=780,
        current_inventory=NodeInventory(fuel=2100.0, ammunition=1380.0, rations=4300.0, medical=1550.0, spare_parts=920.0),
        safety_stock=NodeInventory(fuel=800.0, ammunition=560.0, rations=1550.0, medical=520.0, spare_parts=350.0),
        max_capacity=NodeCapacity(fuel=3600.0, ammunition=2400.0, rations=7200.0, medical=2700.0, spare_parts=1700.0),
        weather_condition="RAIN",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=115,
        last_telemetry_time="5s ago"
    ),
    LogisticsNode(
        id="HUB-DINJAN-03",
        theater="EASTERN_ARUNACHAL",
        name="Dinjan / Chabua Air & Land Logistics Hub",
        type="HUB",
        lat=27.5380,
        lng=95.2750,
        elevation_m=120,
        readiness_index=94.0,
        operational_tempo="NORMAL",
        personnel_count=820,
        current_inventory=NodeInventory(fuel=2800.0, ammunition=1750.0, rations=5100.0, medical=1850.0, spare_parts=1150.0),
        safety_stock=NodeInventory(fuel=900.0, ammunition=620.0, rations=1700.0, medical=580.0, spare_parts=380.0),
        max_capacity=NodeCapacity(fuel=4200.0, ammunition=2800.0, rations=8000.0, medical=3000.0, spare_parts=1900.0),
        weather_condition="CLEAR",
        terrain_type="VALLEY",
        iot_sensors_active=140,
        last_telemetry_time="12s ago"
    ),
    LogisticsNode(
        id="UNIT-TAWANG-01",
        theater="EASTERN_ARUNACHAL",
        name="Tawang Sector Fortress & Brigade Base",
        type="FORWARD_UNIT",
        lat=27.5861,
        lng=91.8594,
        elevation_m=3048,
        readiness_index=62.4,
        operational_tempo="SURGE",
        personnel_count=490,
        current_inventory=NodeInventory(fuel=230.0, ammunition=140.0, rations=420.0, medical=110.0, spare_parts=52.0),
        safety_stock=NodeInventory(fuel=260.0, ammunition=170.0, rations=480.0, medical=145.0, spare_parts=70.0),
        max_capacity=NodeCapacity(fuel=800.0, ammunition=550.0, rations=1500.0, medical=500.0, spare_parts=250.0),
        weather_condition="HEAVY_STORM",
        terrain_type="MOUNTAINOUS",
        iot_sensors_active=48,
        last_telemetry_time="2s ago"
    ),
    LogisticsNode(
        id="UNIT-KIBITHU-02",
        theater="EASTERN_ARUNACHAL",
        name="Kibithu / Walong Easternmost Patrol Line",
        type="FORWARD_UNIT",
        lat=28.2325,
        lng=97.0189,
        elevation_m=1305,
        readiness_index=55.6,
        operational_tempo="SURGE",
        personnel_count=350,
        current_inventory=NodeInventory(fuel=150.0, ammunition=92.0, rations=295.0, medical=75.0, spare_parts=34.0),
        safety_stock=NodeInventory(fuel=180.0, ammunition=125.0, rations=340.0, medical=105.0, spare_parts=48.0),
        max_capacity=NodeCapacity(fuel=550.0, ammunition=380.0, rations=1000.0, medical=320.0, spare_parts=160.0),
        weather_condition="RAIN",
        terrain_type="JUNGLE_RIDGE",
        iot_sensors_active=32,
        last_telemetry_time="9s ago"
    ),
    LogisticsNode(
        id="UNIT-TUTING-03",
        theater="EASTERN_ARUNACHAL",
        name="Tuting / Gelling Siang River Frontier Post",
        type="FORWARD_UNIT",
        lat=29.0062,
        lng=94.9015,
        elevation_m=760,
        readiness_index=71.8,
        operational_tempo="HIGH",
        personnel_count=280,
        current_inventory=NodeInventory(fuel=185.0, ammunition=110.0, rations=360.0, medical=95.0, spare_parts=44.0),
        safety_stock=NodeInventory(fuel=160.0, ammunition=100.0, rations=300.0, medical=85.0, spare_parts=38.0),
        max_capacity=NodeCapacity(fuel=500.0, ammunition=340.0, rations=900.0, medical=280.0, spare_parts=140.0),
        weather_condition="RAIN",
        terrain_type="JUNGLE_RIDGE",
        iot_sensors_active=30,
        last_telemetry_time="14s ago"
    )
]

THEATER_EAST_ROUTES: List[RouteSegment] = [
    RouteSegment(
        id="RT-TEZPUR-BOMDILA-BCT",
        theater="EASTERN_ARUNACHAL",
        source_id="DEPOT-TEZPUR-01",
        target_id="HUB-BOMDILA-02",
        name="Balipara-Charduar-Tawang (BCT) Arterial",
        type="PRIMARY_HIGHWAY",
        distance_km=158.0,
        base_eta_hours=4.2,
        coordinates=[[26.6528, 92.7926], [27.0200, 92.6500], [27.2644, 92.4159]],
        terrain_risk=32.0,
        weather_risk=45.0,
        disruption_prob=38.0,
        resilience_score=81.0,
        capacity_trucks_day=40
    ),
    RouteSegment(
        id="RT-BOMDILA-TAWANG-SELAPASS",
        theater="EASTERN_ARUNACHAL",
        source_id="HUB-BOMDILA-02",
        target_id="UNIT-TAWANG-01",
        name="Sela Pass Summit Route (13,700 ft)",
        type="MOUNTAIN_PASS",
        distance_km=128.0,
        base_eta_hours=5.4,
        coordinates=[[27.2644, 92.4159], [27.5020, 92.1000], [27.5861, 91.8594]],
        terrain_risk=76.0,
        weather_risk=82.0,
        disruption_prob=79.0,
        resilience_score=38.0,
        capacity_trucks_day=12,
        bottleneck_warning="Severe blizzard & ice on Sela Pass ridge"
    ),
    RouteSegment(
        id="RT-BOMDILA-TAWANG-SELATUNNEL",
        theater="EASTERN_ARUNACHAL",
        source_id="HUB-BOMDILA-02",
        target_id="UNIT-TAWANG-01",
        name="Sela All-Weather Twin Tunnel Bypass",
        type="ALTERNATE_TACTICAL",
        distance_km=106.0,
        base_eta_hours=2.8,
        coordinates=[[27.2644, 92.4159], [27.4800, 92.1500], [27.5861, 91.8594]],
        terrain_risk=18.0,
        weather_risk=22.0,
        disruption_prob=16.0,
        resilience_score=93.5,
        capacity_trucks_day=36
    ),
    RouteSegment(
        id="RT-TEZPUR-DINJAN-NH15",
        theater="EASTERN_ARUNACHAL",
        source_id="DEPOT-TEZPUR-01",
        target_id="HUB-DINJAN-03",
        name="Assam Valley Trans-Highway (NH-15)",
        type="PRIMARY_HIGHWAY",
        distance_km=280.0,
        base_eta_hours=5.5,
        coordinates=[[26.6528, 92.7926], [27.1000, 94.0000], [27.5380, 95.2750]],
        terrain_risk=20.0,
        weather_risk=35.0,
        disruption_prob=22.0,
        resilience_score=87.0,
        capacity_trucks_day=45
    ),
    RouteSegment(
        id="RT-DINJAN-KIBITHU-LOHIT",
        theater="EASTERN_ARUNACHAL",
        source_id="HUB-DINJAN-03",
        target_id="UNIT-KIBITHU-02",
        name="Lohit Valley Strategic Highway to Kibithu",
        type="PRIMARY_HIGHWAY",
        distance_km=220.0,
        base_eta_hours=6.4,
        coordinates=[[27.5380, 95.2750], [27.9200, 96.2000], [28.2325, 97.0189]],
        terrain_risk=52.0,
        weather_risk=68.0,
        disruption_prob=60.0,
        resilience_score=53.0,
        capacity_trucks_day=18,
        bottleneck_warning="Monsoon river washouts along Lohit River gorge"
    ),
    RouteSegment(
        id="RT-DINJAN-TUTING-AIR",
        theater="EASTERN_ARUNACHAL",
        source_id="HUB-DINJAN-03",
        target_id="UNIT-TUTING-03",
        name="Chabua / Dinjan to Tuting Tactical Air Bridge",
        type="AIR_CORRIDOR",
        distance_km=195.0,
        base_eta_hours=0.9,
        coordinates=[[27.5380, 95.2750], [28.3000, 95.1000], [29.0062, 94.9015]],
        terrain_risk=12.0,
        weather_risk=42.0,
        disruption_prob=20.0,
        resilience_score=90.0,
        capacity_trucks_day=20
    )
]

THEATERS_METADATA = [
    {
        "id": "ALL",
        "name": "Pan-Frontier Integrated Command",
        "center": [31.5000, 84.0000],
        "zoom": 6,
        "description": "Integrated Tri-Theater digital twin covering Northern Kashmir/Ladakh, Central Uttarakhand, and Eastern Arunachal."
    },
    {
        "id": "NORTHERN_LADAKH",
        "name": "Northern Frontier (Kashmir, Ladakh, Siachen & Kargil)",
        "center": [34.4500, 76.5000],
        "zoom": 8,
        "description": "High-altitude glaciated passes (>18,000 ft), Kashmir Valley staging, and extreme sub-zero logistics corridors (Zojila, Khardung La, DS-DBO)."
    },
    {
        "id": "CENTRAL_UTTARAKHAND",
        "name": "Central Himalayas (Uttarakhand & Garhwal)",
        "center": [30.3500, 79.6000],
        "zoom": 8,
        "description": "Steep valley gorges, river crossing corridors, and high-altitude border passes (Joshimath, Mana, Lipulekh, Niti)."
    },
    {
        "id": "EASTERN_ARUNACHAL",
        "name": "Eastern Himalayas (Arunachal & North-East)",
        "center": [27.6000, 94.2000],
        "zoom": 7,
        "description": "Dense mountain jungle, heavy monsoon rain, Sela Tunnel all-weather bypass, and Lohit River corridor to Kibithu."
    }
]

NETWORK_VARIATIONS = [
    {
        "id": "STANDARD",
        "name": "Standard Echelon Resupply Backbone",
        "badge": "BASELINE",
        "description": "Baseline multi-echelon supply network. Standard daily consumption rates, primary national highways operational, nominal convoy scheduling.",
        "operational_posture": "PEACETIME_MAINTENANCE",
        "tempo_modifier": "NORMAL",
        "active_routes_ratio": "100%",
        "risk_profile": "MODERATE",
        "key_mechanic": "Fixed-cadence scheduled replenishment from base depots (Leh, Rishikesh, Tezpur) to frontline hubs."
    },
    {
        "id": "WINTER_FREEZE",
        "name": "High-Altitude Winter Freeze & Pass Blockades",
        "badge": "WEATHER SHOCK",
        "description": "Simulates heavy Himalayan winter blizzards. Khardung La, Zojila, Sela Pass summit, and Mana summit blocked. Traffic dynamically diverted through all-weather tunnels (Sela Tunnel, Wari La) and heavy cargo helicopter air bridges (Chinook / Mi-17).",
        "operational_posture": "EXTREME_CLIMATE_SURGE",
        "tempo_modifier": "HIGH",
        "active_routes_ratio": "72% (Passes Blocked)",
        "risk_profile": "CRITICAL",
        "key_mechanic": "Heating fuel burn rate increases +40% across high-altitude nodes; AI solver activates bypass tunnels & air corridors."
    },
    {
        "id": "TACTICAL_SURGE",
        "name": "High-Tempo Forward Crisis Posture",
        "badge": "TACTICAL SURGE",
        "description": "Simulates rapid operational escalation across northern & eastern frontiers. Forward units (Siachen, Dras, DBO, Mana, Tawang, Kibithu) shift to SURGE tempo with 1.9x ammunition and medical depletion.",
        "operational_posture": "ACTIVE_DEFENSE_SURGE",
        "tempo_modifier": "SURGE",
        "active_routes_ratio": "95%",
        "risk_profile": "HIGH",
        "key_mechanic": "Dynamic decentralized peer-buffer transfers and rapid Tatra convoy pre-positioning before safety stocks breach."
    },
    {
        "id": "CHOKEPOINT_STRESS",
        "name": "Multi-Chokepoint Disruption & Washout Stress Test",
        "badge": "STRESS TEST",
        "description": "Compound disaster scenario: Lambagad landslide on NH-07, Shyok river flash flood on DS-DBO, and Lohit river washout near Walong. Demonstrates automated AI constraint solver rerouting & airlift triage.",
        "operational_posture": "DISASTER_RESILIENCE_MODE",
        "tempo_modifier": "HIGH",
        "active_routes_ratio": "65% (3 Key Arterials Cut)",
        "risk_profile": "SEVERE",
        "key_mechanic": "Automated discovery of alternate tactical bypasses, airbridge lift dispatch, and deficit mitigation."
    }
]

HISTORICAL_CASES: List[Dict[str, Any]] = [
    {
        "id": "CASE_KARGIL_1999",
        "year": "1999",
        "title": "Operation Vijay: Artillery Surge & NH-1 Interdiction Push",
        "theater": "NORTHERN_LADAKH",
        "theater_name": "Northern Frontier (Kargil / Dras / Zojila)",
        "badge": "1999 KARGIL WAR",
        "conflict_name": "1999 Kargil Conflict (Tololing & Tiger Hill Operations)",
        "scenario_overview": "Pakistani infiltrators occupied dominating peaks across Tololing, Tiger Hill, and Jubar, bringing the vital NH-1 strategic highway (Srinagar-Sonamarg-Zojila-Dras-Kargil) under direct observed artillery shelling and sniper fire, cutting daylight convoy traffic.",
        "historical_failure_point": "Daylight convoy interdiction created critical supply bottlenecks at Dras and Kargil forward gun positions. Over 250,000 artillery shells (155mm Bofors & 105mm IFG) were fired in 60 days (~10,000 tons of ordnance), pushing manual supply chains near breakdown.",
        "supply_bottlenecks": [
            "NH-1 Zojila-Dras corridor subjected to direct observed artillery interdiction",
            "Unprecedented Class V (Ammunition) expenditure: 5,000+ shells/day during peak assaults",
            "Single-lane unpaved bypasses created extreme congestion and convoy stall times",
            "Severe sub-zero night freezing across Zojila Pass degrading vehicle brake systems"
        ],
        "historical_manual_outcome": {
            "stockout_delay_days": "14 Days near-critical ammunition buffer at Dras gun lines",
            "artillery_or_fuel_shortage": "Bofors gun positions rationed fire to 40 rounds/day before emergency night convoys",
            "convoys_attrition": "8+ Convoys stalled or damaged under direct pass shelling",
            "reactive_emergency_airdrop": "Heavy Mi-17 and Cheetah heli-drops required under enemy shoulder-fired SAM envelope"
        },
        "digital_twin_ai_solution": {
            "proactive_actions": [
                "Automated scheduling algorithm shifts 85% of movement to synchronized night-blackout Tatras",
                "Pre-positioning optimization dumps 4,200 tonnes of Class V ordnance at Dras & Minamarg 48h prior to assault",
                "Dynamic rerouting routes secondary supplies via Leh-Kargil reverse corridor (NH-1D)",
                "Airlift dispatch synchronizes C-130 / An-32 strategic flights to Leh airfield with forward helicopter staging"
            ],
            "simulated_readiness_gain": "+34.2% Forward Gun Readiness",
            "prevented_shortages_pct": "96.4% Stockout Avoidance",
            "lead_time_buffer_hours": "72 Hours Buffer Gained",
            "dynamic_rerouting_strategy": "Reverse-Arterial Reroute via Leh Hub (NH-1D) + Night Convoy Phasing"
        },
        "key_routes_involved": ["RT-SRINAGAR-KARGIL-ZOJILA", "RT-LEH-KARGIL-NH1D", "RT-KARGIL-DRAS-NH1"],
        "key_nodes_involved": ["DEPOT-SRINAGAR-01", "HUB-KARGIL-02", "UNIT-DRAS-01", "DEPOT-LEH-01"],
        "simulation_params": {
            "weather_condition": "CLEAR",
            "transport_availability_pct": 65,
            "demand_surge_pct": 75,
            "blocked_route_ids": ["RT-SRINAGAR-KARGIL-ZOJILA"]
        }
    },
    {
        "id": "CASE_REZANGLA_1962",
        "year": "1962",
        "title": "Battle of Rezang La & Chushul: Extreme Winter Isolation",
        "theater": "NORTHERN_LADAKH",
        "theater_name": "Eastern Ladakh (Chushul / Rezang La / Spanggur Gap)",
        "badge": "1962 REZANG LA",
        "conflict_name": "1962 Sino-Indian War (13 Kumaon Defense of Rezang La)",
        "scenario_overview": "Charlie Company 13 Kumaon held Rezang La ridge at an altitude of 5,050 meters in -30°C blizzard temperatures without road connectivity. Ground lines of communication to Leh were rudimentary dirt tracks completely blocked by unseasonal heavy snowfall.",
        "historical_failure_point": "Troops fought to the last man and last round. A critical lack of forward reserve ammunition pre-positioning and weapon lubricant freezing in -30°C extreme cold led to weapons jamming and supply exhaustion during Chinese human wave assaults.",
        "supply_bottlenecks": [
            "Complete physical road isolation at 5,000m altitude; pack mule tracks frozen over",
            "Standard weapon oils froze solid, requiring specialized low-temperature synthetic lubricants",
            "Zero pre-positioned safety buffer for high-angle mortar shells and .303 ammunition",
            "No dynamic air-drop tracking or multi-echelon buffer replenishment"
        ],
        "historical_manual_outcome": {
            "stockout_delay_days": "Complete Class V stockout in 6 hours of high-tempo combat",
            "artillery_or_fuel_shortage": "Mortar units exhausted final ammunition caches with zero resupply",
            "convoys_attrition": "Ground resupply columns frozen 40km away on the Tsaka La track",
            "reactive_emergency_airdrop": "Zero successful drops due to blizzard conditions and lack of telemetry"
        },
        "digital_twin_ai_solution": {
            "proactive_actions": [
                "Multivariate burn forecasting flags 3.9x demand surge 96h prior to pass freeze",
                "Pre-positioning solver moves 10 days of Class V arctic-lubricated munitions to Chushul Hub",
                "Thermal monitoring sensors trigger automated heating fuel replenishment before hypothermia threshold",
                "Multi-modal air-lift dispatch pairs An-12 / C-119 drops to designated high-altitude drop zones"
            ],
            "simulated_readiness_gain": "+48.5% Ridge Combat Survivability",
            "prevented_shortages_pct": "91.8% Ammunition Deficit Reduction",
            "lead_time_buffer_hours": "96 Hours Safety Buffer",
            "dynamic_rerouting_strategy": "Pre-Winter Forward Deposition + Strategic Air-Bridge to Chushul Airstrip"
        },
        "key_routes_involved": ["RT-LEH-PANGONG-CHANGLA", "RT-PANGONG-CHUSHUL-TACTICAL"],
        "key_nodes_involved": ["DEPOT-LEH-01", "UNIT-PANGONG-02"],
        "simulation_params": {
            "weather_condition": "SNOW_ICE",
            "transport_availability_pct": 40,
            "demand_surge_pct": 80,
            "blocked_route_ids": ["RT-LEH-PANGONG-CHANGLA"]
        }
    },
    {
        "id": "CASE_LADAKH_2020",
        "year": "2020",
        "title": "Operation Snow Leopard: Rapid 50,000-Troop Winter Mobilization",
        "theater": "NORTHERN_LADAKH",
        "theater_name": "Eastern Ladakh (Galwan / Depsang / DBO / Pangong South)",
        "badge": "2020 STANDOFF",
        "conflict_name": "2020 Eastern Ladakh Standoff (Galwan & Kailash Range)",
        "scenario_overview": "Following skirmishes along the LAC in Galwan and Pangong Tso, the Indian Armed Forces rapidly inducted over 50,000 frontline troops, T-90 Bhishma tanks, BMP-2s, and air defense systems ahead of the fast-approaching sub-zero winter freeze.",
        "historical_failure_point": "The logistical challenge required stocking over 200,000 tonnes of high-altitude clothing (ECC), arctic-grade winterized kerosene, prefabricated insulated shelters, and ammunition in a narrow 75-day window before Zojila and Rohtang passes were blocked by blizzards.",
        "supply_bottlenecks": [
            "200,000+ Tonnes required across DS-DBO and Manali-Leh axes in 75 days",
            "High-altitude engine power loss in tanks and heavy Tatras across Khardung La (5,359m)",
            "Chokepoints on the DS-DBO road bridge crossings vulnerable to sudden glacier melt flash floods",
            "Heavy strategic airlift density limits at high-density altitude Leh Air Force Station"
        ],
        "historical_manual_outcome": {
            "stockout_delay_days": "Intensive manual round-the-clock coordination avoided major shortages",
            "artillery_or_fuel_shortage": "High logistical friction and vehicle wear; heavy convoy turnaround times (48h+)",
            "convoys_attrition": "Frequent bridge washouts along Shyok river required emergency Bailey bridge repairs",
            "reactive_emergency_airdrop": "Continuous heavy airlift by C-17 Globemaster and IL-76 aircraft"
        },
        "digital_twin_ai_solution": {
            "proactive_actions": [
                "Continuous linear optimization balanced payload tonnage between C-17 airlifts and Tatra road convoys",
                "IoT ultrasonic sensor probes automated fuel tank monitoring across DBO, Galwan, and Nyoma",
                "Automated route resilience algorithm routed high-risk munitions through newly completed all-weather axes",
                "Predictive demand engine matched winterized fuel burn rates against real-time sub-zero temperature probes"
            ],
            "simulated_readiness_gain": "+28.7% Fleet Turnaround Efficiency",
            "prevented_shortages_pct": "98.9% Stockout Prevention Rate",
            "lead_time_buffer_hours": "120 Hours Lead-Time Buffer",
            "dynamic_rerouting_strategy": "Integrated Multi-Modal Air-Road Arterial + Continuous IoT Health Twin"
        },
        "key_routes_involved": ["RT-LEH-NUBRA-KHARDUNGLA", "RT-NUBRA-DBO-DSDBO", "RT-LEH-PANGONG-CHANGLA"],
        "key_nodes_involved": ["DEPOT-LEH-01", "HUB-NUBRA-03", "UNIT-DAULAT-03", "UNIT-PANGONG-02"],
        "simulation_params": {
            "weather_condition": "SNOW_ICE",
            "transport_availability_pct": 85,
            "demand_surge_pct": 50,
            "blocked_route_ids": ["RT-NUBRA-DBO-DSDBO"]
        }
    },
    {
        "id": "CASE_SELA_1962",
        "year": "1962",
        "title": "Eastern Frontier Sela Pass Cutoff & Tawang Resupply Crisis",
        "theater": "EASTERN_ARUNACHAL",
        "theater_name": "Eastern Frontier (Tezpur - Bomdila - Sela Pass - Tawang)",
        "badge": "1962 SELA PASS",
        "conflict_name": "1962 Sino-Indian War (Kameng Frontier Division Sector)",
        "scenario_overview": "In the Kameng sector of Arunachal Pradesh, the single unpaved mountain road connecting the Tezpur plains to Bomdila, Sela Pass (4,170m), and Tawang was infiltrated and severed by enemy bypass columns at Thembang and Sela, creating an operational cutoff.",
        "historical_failure_point": "The single-artery logistics dependence left forward formations with zero alternate ground corridors. When Sela Pass road was blocked, frontline units exhausted their 3-day basic load of ammunition and rations, leading to command disorganization and retreat.",
        "supply_bottlenecks": [
            "Single vulnerable corridor across 4,170m Sela Pass with steep cliffs and zero road redundancy",
            "Monsoon rains and early winter sleet turned unpaved tracks into impassable mud tracks",
            "Communication blackout between Tezpur base depot and forward battalions at Tawang",
            "No pre-positioned secondary supply dumps south of Sela Pass"
        ],
        "historical_manual_outcome": {
            "stockout_delay_days": "Critical Class I (Rations) and Class V (Ammo) stockout within 72 hours of cut",
            "artillery_or_fuel_shortage": "Forward mountain gun batteries ran out of ammunition; weapons abandoned",
            "convoys_attrition": "Supply convoys stranded at Bomdila with no bypass route",
            "reactive_emergency_airdrop": "Limited Dakota air drops failed due to thick cloud cover and terrain masks"
        },
        "digital_twin_ai_solution": {
            "proactive_actions": [
                "Chokepoint vulnerability solver flags single-axis reliance and forces multi-echelon forward staging",
                "Pre-positioning algorithm establishes 14-day decentralized micro-dumps in Tawang & Dirang",
                "Automated emergency airlift bridges activated from Chabua (C-130 / Mi-17) to forward helipads",
                "Tactical footprint model schedules emergency air-drop corridors with GPS-guided delivery tracking"
            ],
            "simulated_readiness_gain": "+42.1% Frontier Defense Resilience",
            "prevented_shortages_pct": "94.5% Cutoff Shortage Mitigation",
            "lead_time_buffer_hours": "84 Hours Critical Buffer",
            "dynamic_rerouting_strategy": "Chabua-Dinjan Heli-Bridge Air Corridor + Pre-Positioned Decentralized Dumps"
        },
        "key_routes_involved": ["RT-TEZPUR-BOMDILA-NH13", "RT-BOMDILA-TAWANG-SELAPASS", "RT-CHABUA-TAWANG-AIR"],
        "key_nodes_involved": ["DEPOT-TEZPUR-01", "HUB-BOMDILA-02", "UNIT-TAWANG-01", "HUB-DINJAN-03"],
        "simulation_params": {
            "weather_condition": "HEAVY_STORM",
            "transport_availability_pct": 50,
            "demand_surge_pct": 60,
            "blocked_route_ids": ["RT-BOMDILA-TAWANG-SELAPASS"]
        }
    }
]

def apply_network_variation(
    nodes: List[LogisticsNode],
    routes: List[RouteSegment],
    fleet: List[TransportAsset],
    variation: str
) -> tuple[List[LogisticsNode], List[RouteSegment], List[TransportAsset]]:
    """Applies scenario state mutations according to selected network variation"""
    nodes_copy = copy.deepcopy(nodes)
    routes_copy = copy.deepcopy(routes)
    fleet_copy = copy.deepcopy(fleet)

    if variation == "WINTER_FREEZE":

        for r in routes_copy:
            if r.id in ["RT-LEH-NUBRA-KHARDUNGLA", "RT-BOMDILA-TAWANG-SELAPASS", "RT-JOSHIMATH-MANA-PRIMARY", "RT-SRINAGAR-KARGIL-ZOJILA"]:
                r.is_blocked = True
                r.resilience_score = max(10.0, r.resilience_score - 40.0)
                r.disruption_prob = min(98.0, r.disruption_prob + 35.0)
                r.bottleneck_warning = "CORRIDOR CLOSED: Severe winter blizzard & avalanche block"

        for n in nodes_copy:
            if n.elevation_m >= 2500:
                n.weather_condition = "SNOW_ICE"
                n.readiness_index = max(35.0, n.readiness_index - 12.0)

                n.current_inventory.fuel = round(n.current_inventory.fuel * 0.78, 1)

    elif variation == "TACTICAL_SURGE":
        for n in nodes_copy:
            if n.type == "FORWARD_UNIT":
                n.operational_tempo = "SURGE"
                n.readiness_index = max(40.0, n.readiness_index - 15.0)
                n.current_inventory.ammunition = round(n.current_inventory.ammunition * 0.65, 1)
                n.current_inventory.medical = round(n.current_inventory.medical * 0.70, 1)

    elif variation == "CHOKEPOINT_STRESS":

        for r in routes_copy:
            if r.id in ["RT-RISHIKESH-JOSHIMATH-NH07", "RT-NUBRA-DBO-DSDBO", "RT-DINJAN-KIBITHU-LOHIT"]:
                r.is_blocked = True
                r.resilience_score = 15.0
                r.disruption_prob = 95.0
                r.bottleneck_warning = "CUT OFF: Landslide debris & flash flood river washout"

        for n in nodes_copy:
            if n.id in ["UNIT-MANA-01", "UNIT-DAULAT-03", "UNIT-KIBITHU-02"]:
                n.readiness_index = max(30.0, n.readiness_index - 25.0)
                n.current_inventory.fuel = round(n.current_inventory.fuel * 0.60, 1)
                n.current_inventory.rations = round(n.current_inventory.rations * 0.65, 1)

    return nodes_copy, routes_copy, fleet_copy

def get_nodes_by_theater(theater: Optional[str] = None, variation: Optional[str] = "STANDARD") -> List[LogisticsNode]:
    all_nodes = THEATER_NORTH_NODES + THEATER_CENTRAL_NODES + THEATER_EAST_NODES
    filtered = all_nodes if (not theater or theater == "ALL") else [n for n in all_nodes if n.theater == theater]

    routes = get_routes_by_theater(theater, "STANDARD")
    fleet = get_fleet_by_theater(theater, "STANDARD")
    mutated_nodes, _, _ = apply_network_variation(filtered, routes, fleet, variation or "STANDARD")
    return mutated_nodes

def get_routes_by_theater(theater: Optional[str] = None, variation: Optional[str] = "STANDARD") -> List[RouteSegment]:
    all_routes = THEATER_NORTH_ROUTES + THEATER_CENTRAL_ROUTES + THEATER_EAST_ROUTES
    filtered = all_routes if (not theater or theater == "ALL") else [r for r in all_routes if r.theater == theater]

    nodes = THEATER_NORTH_NODES + THEATER_CENTRAL_NODES + THEATER_EAST_NODES
    fleet = get_fleet_by_theater(theater, "STANDARD")
    _, mutated_routes, _ = apply_network_variation(nodes, filtered, fleet, variation or "STANDARD")
    return mutated_routes

def get_fleet_by_theater(theater: Optional[str] = None, variation: Optional[str] = "STANDARD") -> List[TransportAsset]:
    all_fleet = [
        TransportAsset(id="TRUCK-CONVOY-NORTH-01", theater="NORTHERN_LADAKH", name="14 Corps Heavy Tatra Convoy (8x All-Terrain)", type="HEAVY_CONVOY", assigned_node="DEPOT-LEH-01", capacity_tons=120.0, fuel_pct=94.0, status="AVAILABLE", lat=34.1526, lng=77.5771),
        TransportAsset(id="TRUCK-CONVOY-SRINAGAR-02", theater="NORTHERN_LADAKH", name="15 Chinar Corps Strategic Convoy", type="HEAVY_CONVOY", assigned_node="DEPOT-SRINAGAR-01", capacity_tons=115.0, fuel_pct=91.0, status="AVAILABLE", lat=34.0837, lng=74.7973),
        TransportAsset(id="TRUCK-TACT-NORTH-03", theater="NORTHERN_LADAKH", name="Nubra High-Altitude Tactical Lift 1", type="TACTICAL_TRUCK", assigned_node="HUB-NUBRA-03", capacity_tons=45.0, fuel_pct=88.0, status="AVAILABLE", lat=34.5428, lng=77.5619),
        TransportAsset(id="AIR-CHINOOK-NORTH-04", theater="NORTHERN_LADAKH", name="Heavy Cargo Helicopter Wing (Chinook/Mi-17)", type="AIR_TRANSPORT", assigned_node="DEPOT-LEH-01", capacity_tons=32.0, fuel_pct=96.0, status="AVAILABLE", lat=34.1526, lng=77.5771),
        TransportAsset(id="TRUCK-CONVOY-CENTRAL-01", theater="CENTRAL_UTTARAKHAND", name="Central Command Heavy Tatra Column", type="HEAVY_CONVOY", assigned_node="DEPOT-RISHIKESH-01", capacity_tons=110.0, fuel_pct=92.0, status="AVAILABLE", lat=30.0869, lng=78.2676),
        TransportAsset(id="TRUCK-TACT-CENTRAL-02", theater="CENTRAL_UTTARAKHAND", name="Garhwal Mountain Logistics Unit", type="TACTICAL_TRUCK", assigned_node="HUB-JOSHIMATH-02", capacity_tons=40.0, fuel_pct=82.0, status="AVAILABLE", lat=30.5564, lng=79.5668),
        TransportAsset(id="TRUCK-CONVOY-EAST-01", theater="EASTERN_ARUNACHAL", name="4 Corps Heavy Arterial Convoy", type="HEAVY_CONVOY", assigned_node="DEPOT-TEZPUR-01", capacity_tons=130.0, fuel_pct=95.0, status="AVAILABLE", lat=26.6528, lng=92.7926),
        TransportAsset(id="TRUCK-TACT-EAST-02", theater="EASTERN_ARUNACHAL", name="Tawang Rapid Resupply Column", type="TACTICAL_TRUCK", assigned_node="HUB-BOMDILA-02", capacity_tons=48.0, fuel_pct=86.0, status="AVAILABLE", lat=27.2644, lng=92.4159),
        TransportAsset(id="AIR-TRANSPORT-EAST-03", theater="EASTERN_ARUNACHAL", name="Chabua Air Bridge Flight (C-130J Super Hercules)", type="AIR_TRANSPORT", assigned_node="HUB-DINJAN-03", capacity_tons=28.0, fuel_pct=97.0, status="AVAILABLE", lat=27.5380, lng=95.2750)
    ]
    filtered = all_fleet if (not theater or theater == "ALL") else [f for f in all_fleet if f.theater == theater]
    return filtered
