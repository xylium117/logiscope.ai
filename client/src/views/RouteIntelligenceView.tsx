import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Mountain, 
  Wind, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ShieldAlert, 
  Truck,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { RouteSegment } from '../types';
import { fetchRoutes } from '../services/api';

interface RouteIntelligenceViewProps {
  initialRoutes: RouteSegment[];
}

export const RouteIntelligenceView: React.FC<RouteIntelligenceViewProps> = ({
  initialRoutes,
}) => {
  const [routes, setRoutes] = useState<RouteSegment[]>(initialRoutes);
  const [weatherCondition, setWeatherCondition] = useState<string>('NORMAL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchRoutes(undefined, undefined, weatherCondition !== 'NORMAL' ? weatherCondition : undefined)
      .then((data) => setRoutes(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [weatherCondition]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header & Scenario Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between glass-panel p-5 rounded-xl gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              DYNAMIC TERRAIN & WEATHER ROUTE INTELLIGENCE
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Recommending tactical routes based on <span className="text-cyan-300 font-bold">resilience and terrain survivability</span> rather than pure distance alone.
          </p>
        </div>

        {/* Dynamic Weather Modifier */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-300 font-bold">WEATHER OVERLAY:</span>
          <div className="flex space-x-1.5">
            {['CLEAR', 'NORMAL', 'RAIN', 'HEAVY_STORM', 'SNOW_ICE'].map((w) => (
              <button
                key={w}
                onClick={() => setWeatherCondition(w)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  weatherCondition === w
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-glow-cyan'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Route Intelligence Matrix Table */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>TACTICAL ROUTE RELIABILITY MATRIX</span>
          <span className="text-slate-400 text-[11px] font-normal">
            Dynamic infrastructure-calibrated resilience for current weather ({weatherCondition})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {routes.map((route) => {
            const status = route.tactical_status || (
              route.is_blocked || route.resilience_score < 42 ? 'AVOID' :
              route.resilience_score >= 68 ? 'RECOMMENDED' : 'CAUTION'
            );
            const isOptimal = status === 'RECOMMENDED';
            const isHighRisk = status === 'AVOID';
            const isCaution = status === 'CAUTION';

            return (
              <div
                key={route.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isHighRisk
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/80'
                    : isOptimal
                    ? 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-500/80 shadow-glow-cyan'
                    : 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {(route.type || 'ROUTE').replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-sm font-black ${
                        isOptimal
                          ? 'text-cyan-400'
                          : isHighRisk
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {route.resilience_score}% RELIABLE
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-sans mb-3">
                    {route.name}
                  </h3>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-3">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[9px]">DISTANCE</div>
                      <div className="font-semibold text-white mt-0.5">{route.distance_km} km</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[9px]">DYNAMIC ETA</div>
                      <div className="font-semibold text-cyan-300 mt-0.5">
                        {route.dynamic_eta_hours || route.base_eta_hours} hrs
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[9px]">TERRAIN RISK</div>
                      <div
                        className={`font-semibold mt-0.5 ${
                          route.terrain_risk > 50 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {route.terrain_risk}%
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[9px]">WEATHER RISK</div>
                      <div
                        className={`font-semibold mt-0.5 ${
                          route.weather_risk > 50 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {route.weather_risk}%
                      </div>
                    </div>
                  </div>

                  {/* Bottleneck Callout / Operational Guidance */}
                  {route.bottleneck_warning && (
                    <div className={`p-2 rounded border text-[10px] mb-3 flex items-start space-x-1.5 ${
                      isHighRisk 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                        : isCaution 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    }`}>
                      {isHighRisk ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      ) : isCaution ? (
                        <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <span>{route.bottleneck_warning}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Capacity: {route.capacity_trucks_day} Trucks/Day
                  </span>
                  <span
                    className={`font-bold flex items-center space-x-1 ${
                      isOptimal ? 'text-emerald-400' : isHighRisk ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {isOptimal ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>RECOMMENDED</span>
                      </>
                    ) : isCaution ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>CAUTION / VIABLE</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>AVOID / HIGH RISK</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
