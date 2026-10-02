# LOGISCOPE: Predictive, Terrain-Aware Logistics Intelligence Platform

> **"Don't react to shortages. Predict where, when, and why they will occur—and dynamically reposition supplies before they happen."**

**LOGISCOPE** is an advanced AI-driven command-and-control logistics platform that builds a continuously synchronized digital twin of a multi-echelon supply network. By combining spatio-temporal multivariate forecasting, GIS terrain & weather intelligence, IoT sensor telemetry, and constraint-based optimization, LOGISCOPE predicts supply deficits before they happen and recommends resilient routing and pre-positioning actions.

---

## 🚀 Key Modules & Capabilities

1. **Command & Control Dashboard**: Real-time network readiness index, fleet capacity tracker, countdown to earliest deficit, and live AI recommendation feed.
2. **GIS Operations Digital Twin**: Multi-layer tactical map displaying depots, forward operating hubs, frontline formations, terrain elevation gradients, and dynamic resilience-scored corridors.
3. **Predictive Demand & Shortage Engine**: Multi-horizon 7-day multivariate demand curves with 95% confidence interval bands, burn rates, and automated warnings whenever projected reserves cross safety thresholds.
4. **Terrain & Weather Route Intelligence**: Dynamically evaluates route resilience vs. distance, assessing chokepoints, elevation difficulty, and weather degradations.
5. **"What-If" Logistics Simulation Lab**: Interactive decision sandbox allowing planners to inject weather shocks, fleet attrition, demand spikes, and route cutoffs to compare *Without Mitigation* vs. *AI Optimized Plan*.
6. **IoT Telemetry & Statistical Anomaly Radar**: Real-time simulated telemetry (ultrasonic fuel tanks, cold-chain temperature probes, RFID transit gates, GPS tracking) with Z-score outlier detection.
7. **Explainable AI**: "Why did AI recommend this?" breakdown cards displaying confidence scores, root cause factors, and single-click order execution.
8. **Flagship `RUN 7-DAY FORECAST` Feature**: Simulated forward-horizon network sweep across all locations, routes, and demand curves.

---

## 🛠️ Architecture & Tech Stack

```text
  ┌────────────────────────────────────────────────────────┐
  │                 REACT + TYPESCRIPT CLIENT              │
  │   Tailwind CSS • Leaflet GIS • Recharts • Lucide C2    │
  └───────────────────────────┬────────────────────────────┘
                              │ HTTP / REST
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 FASTAPI PYTHON BACKEND                 │
  │   Digital Twin Engine • Spatio-Temporal Forecaster     │
  │   Shortage Predictor • Route Scorer • Scenario Solver  │
  └────────────────────────────────────────────────────────┘
```

- **Frontend (`/client`)**: React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS, Recharts, Lucide Icons.
- **Backend (`/server`)**: FastAPI, Uvicorn, Pydantic, NumPy, Statistical Solvers.

---

## ⚡ Quickstart & Running Locally

### 1. Start Backend Server (FastAPI)
```bash
cd server
pip install -r requirements.txt
python main.py
```
*API will run at `http://localhost:8000` (Swagger UI at `http://localhost:8000/docs`).*

### 2. Start Frontend Client (Vite React)
```bash
cd client
npm install
npm run dev
```
*App will run at `http://localhost:5173`.*
