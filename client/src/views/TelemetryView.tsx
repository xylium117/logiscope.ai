import React, { useState, useEffect } from 'react';
import { 
  RadioTower, 
  Activity, 
  AlertTriangle, 
  Thermometer, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  Layers,
  Radio,
  Clock
} from 'lucide-react';
import { Anomaly, IoTEvent } from '../types';
import { fetchAnomalies, fetchIoTStream } from '../services/api';

export const TelemetryView: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [sensors, setSensors] = useState<IoTEvent[]>([]);
  const [lastPing, setLastPing] = useState<string>('Just now');
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchAnomalies(), fetchIoTStream()])
      .then(([anomData, sensorData]) => {
        setAnomalies(anomData);
        setSensors(sensorData);
        setLastPing(new Date().toLocaleTimeString());
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between glass-panel p-5 rounded-xl gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <RadioTower className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              REAL-TIME IOT TELEMETRY & STATISTICAL ANOMALY RADAR
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Automated sensor ingestion (RFID, ultrasonic tank levels, cold-chain probes) paired with Z-score outlier detection.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">LAST SYNC: <span className="text-cyan-400 font-bold">{lastPing}</span></span>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Consumption & Telemetry Anomaly Alerts */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              ACTIVE STATISTICAL CONSUMPTION & SENSOR ANOMALIES ({anomalies.length})
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
            Z-SCORE &gt; 2.0σ OUTLIERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    anom.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {anom.severity} ANOMALY
                </span>
                <span className="text-[10px] text-slate-400">{anom.timestamp}</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white font-sans line-clamp-1">
                  {anom.node_name}
                </h3>
                <div className="text-[11px] text-cyan-300 font-bold uppercase mt-0.5">
                  Type: {(anom.type || 'ANOMALY').replace(/_/g, ' ')} ({anom.supply_category || 'GENERAL'})
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                {anom.details}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Z-Score: <span className="text-amber-400 font-bold">+{anom.deviation_z_score}σ</span></span>
                <span className="text-cyan-400 hover:underline cursor-pointer">Investigate →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Ingested IoT Sensors Grid */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>CONNECTED IOT DEPOT & FLEET SENSORS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.sensor_id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-white text-xs">{sensor.sensor_id}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans">{sensor.node_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{sensor.type}</div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm font-bold text-cyan-300 font-mono">{sensor.value}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Batt: {sensor.battery} • {sensor.temp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
