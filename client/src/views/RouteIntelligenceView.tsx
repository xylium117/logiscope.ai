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
  Eye,
  Activity,
  Cpu,
  Route,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  RefreshCw,
  Search,
  ChevronRight,
  Flame,
  CloudSnow,
  Navigation
} from 'lucide-react';
import { 
  RouteSegment, 
  LogisticsNode, 
  GNNRoutePrediction, 
  GNNDisruptionResponse, 
  GNNOptimalRouteResult, 
  GNNArchitectureSpecs 
} from '../types';
import { 
  fetchGnnDisruptions, 
  computeGnnOptimalRoute, 
  fetchGnnArchitectureSpecs,
  fetchNodes
} from '../services/api';
import { LatexMath } from '../components/LatexMath';

interface RouteIntelligenceViewProps {
  initialRoutes: RouteSegment[];
}

export const RouteIntelligenceView: React.FC<RouteIntelligenceViewProps> = ({
  initialRoutes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'predictor' | 'solver' | 'whitebox'>('predictor');
  
  const [weatherCondition, setWeatherCondition] = useState<string>('NORMAL');
  const [threatLevel, setThreatLevel] = useState<string>('NORMAL');
  const [seismicTrigger, setSeismicTrigger] = useState<boolean>(false);
  const [selectedHorizon, setSelectedHorizon] = useState<'t_plus_1h' | 't_plus_6h' | 't_plus_12h' | 't_plus_24h' | 't_plus_48h'>('t_plus_6h');
  
  const [gnnData, setGnnData] = useState<GNNDisruptionResponse | null>(null);
  const [gnnSpecs, setGnnSpecs] = useState<GNNArchitectureSpecs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheaterFilter, setSelectedTheaterFilter] = useState<string>('ALL');

  const [nodesList, setNodesList] = useState<LogisticsNode[]>([]);
  const [sourceNodeId, setSourceNodeId] = useState<string>('DEPOT-LEH-01');
  const [targetNodeId, setTargetNodeId] = useState<string>('UNIT-DAULAT-03');
  const [routeResult, setRouteResult] = useState<GNNOptimalRouteResult | null>(null);
  const [solverLoading, setSolverLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNodes()
      .then((data) => {
        setNodesList(data);
        if (data.length >= 2) {
          const defaultSrc = data.find(n => n.type === 'DEPOT') || data[0];
          const defaultDst = data.find(n => n.type === 'FORWARD_UNIT') || data[data.length - 1];
          setSourceNodeId(defaultSrc.id);
          setTargetNodeId(defaultDst.id);
        }
      })
      .catch((err) => console.error(err));

    fetchGnnArchitectureSpecs()
      .then((specs) => setGnnSpecs(specs))
      .catch((err) => console.error(err));
  }, []);

  const loadGnnPredictions = () => {
    setLoading(true);
    fetchGnnDisruptions({
      weather_condition: weatherCondition,
      threat_level: threatLevel,
      seismic_trigger: seismicTrigger,
    })
      .then((data) => setGnnData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGnnPredictions();
  }, [weatherCondition, threatLevel, seismicTrigger]);

  const handleSolveRoute = () => {
    if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return;
    setSolverLoading(true);
    computeGnnOptimalRoute({
      source_node_id: sourceNodeId,
      target_node_id: targetNodeId,
      weather_condition: weatherCondition,
      threat_level: threatLevel,
    })
      .then((res) => setRouteResult(res))
      .catch((err) => console.error(err))
      .finally(() => setSolverLoading(false));
  };

  useEffect(() => {
    if (activeSubTab === 'solver' && sourceNodeId && targetNodeId && sourceNodeId !== targetNodeId && !routeResult) {
      handleSolveRoute();
    }
  }, [activeSubTab, sourceNodeId, targetNodeId]);

  const filteredPredictions = (gnnData?.predictions || []).filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.route_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheater = selectedTheaterFilter === 'ALL' || r.theater === selectedTheaterFilter;
    return matchesSearch && matchesTheater;
  });

  const horizonLabels: Record<string, string> = {
    t_plus_1h: '+1 Hour (Immediate)',
    t_plus_6h: '+6 Hours (Convoy Window)',
    t_plus_12h: '+12 Hours (Night Transition)',
    t_plus_24h: '+24 Hours (Next Day)',
    t_plus_48h: '+48 Hours (Strategic)'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between glass-panel p-5 rounded-xl gap-4 border-cyan-500/20 shadow-glow-cyan">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                ST-GNN ROUTING
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Terrain-aware disruption prediction &amp; path optimization
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('predictor')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'predictor'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>DISRUPTION PREDICTOR</span>
          </button>
          <button
            onClick={() => setActiveSubTab('solver')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'solver'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>MULTI-HOP SOLVER</span>
          </button>
          <button
            onClick={() => setActiveSubTab('whitebox')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'whitebox'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>GNN ARCHITECTURE</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'predictor' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>SPATIAL-TEMPORAL SCENARIO INJECTION ENGINE</span>
              </span>
              <button
                onClick={loadGnnPredictions}
                disabled={loading}
                className="flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>RE-RUN GNN INFERENCE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block text-[11px]">WEATHER FRONT:</label>
                <div className="flex flex-wrap gap-1">
                  {['CLEAR', 'NORMAL', 'RAIN', 'HEAVY_STORM', 'SNOW_ICE'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeatherCondition(w)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                        weatherCondition === w
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block text-[11px]">THREAT TIER:</label>
                <div className="flex gap-1.5">
                  {['NORMAL', 'HIGH', 'SURGE'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setThreatLevel(t)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all ${
                        threatLevel === t
                          ? t === 'SURGE' ? 'bg-rose-500/20 text-rose-300 border border-rose-400 font-bold' :
                            t === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold' :
                            'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block text-[11px]">SEISMIC / SLIP EVENT:</label>
                <button
                  onClick={() => setSeismicTrigger(!seismicTrigger)}
                  className={`w-full py-1.5 px-3 rounded text-[11px] font-bold border transition-all flex items-center justify-center space-x-2 ${
                    seismicTrigger
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-glow-rose'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{seismicTrigger ? 'TRIGGER ACTIVE (+35% FAULT SLIP)' : 'STABLE GEOLOGY'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block text-[11px]">PREDICTION HORIZON:</label>
                <select
                  value={selectedHorizon}
                  onChange={(e) => setSelectedHorizon(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-cyan-300 font-bold text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="t_plus_1h">T+1 Hour (Immediate Convoy)</option>
                  <option value="t_plus_6h">T+6 Hours (Operational Resupply)</option>
                  <option value="t_plus_12h">T+12 Hours (Night Crossing)</option>
                  <option value="t_plus_24h">T+24 Hours (Next Day Horizon)</option>
                  <option value="t_plus_48h">T+48 Hours (Strategic Movement)</option>
                </select>
              </div>
            </div>
          </div>

          {gnnData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">PREDICTED HIGH RISK SEGMENTS</div>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {gnnData.network_vulnerability_summary.high_risk_routes_count}
                  <span className="text-xs text-slate-400 font-normal ml-1.5">/ {gnnData.edges_processed_count} Segments</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Disruption Probability &gt; 55%</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">SAFE ALL-WEATHER CORRIDORS</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {gnnData.network_vulnerability_summary.safe_all_weather_corridors_count}
                </div>
                <div className="text-[10px] text-emerald-500/80 mt-0.5">Resilience Index &ge; 68.0</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">MEAN NETWORK RESILIENCE</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">
                  {gnnData.network_vulnerability_summary.mean_network_resilience}%
                </div>
                <div className="text-[10px] text-cyan-500/80 mt-0.5">Graph Topology Mean Index</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">CRITICAL BOTTLENECK CHOKEPOINT</div>
                <div className="text-sm font-bold text-amber-300 mt-1.5 truncate">
                  {gnnData.network_vulnerability_summary.worst_chokepoint_segment}
                </div>
                <div className="text-[10px] text-amber-500/80 mt-0.5">Primary GNN Disruption Target</div>
              </div>
            </div>
          )}

          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>GNN MULTI-HORIZON DISRUPTION MATRIX & FACTOR ATTRIBUTION</span>
                  <span className="text-cyan-400 font-bold">({horizonLabels[selectedHorizon]})</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Spatial-attention edge weights, dynamic velocity damping, and integrated risk factor decomposition.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search route or corridor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <select
                  value={selectedTheaterFilter}
                  onChange={(e) => setSelectedTheaterFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="ALL">All Theaters</option>
                  <option value="NORTHERN_LADAKH">Northern Ladakh</option>
                  <option value="UTTARAKHAND_CENTRAL">Uttarakhand Central</option>
                  <option value="EASTERN_ARUNACHAL">Eastern Arunachal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredPredictions.map((pred) => {
                const currentDisrupt = pred.disruption_prob_horizons[selectedHorizon];
                const isHighRisk = currentDisrupt > 55.0 || pred.is_blocked;
                const isOptimal = pred.resilience_score >= 68.0 && !isHighRisk;
                const isCaution = !isHighRisk && !isOptimal;

                const attr = pred.attribution_breakdown;

                return (
                  <div
                    key={pred.route_id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isHighRisk
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/80 shadow-glow-rose'
                        : isOptimal
                        ? 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-500/80 shadow-glow-cyan'
                        : 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {pred.type.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-slate-400">DISRUPTION:</span>
                          <span
                            className={`text-sm font-black ${
                              isHighRisk ? 'text-rose-400' : isOptimal ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {currentDisrupt}%
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white font-sans mb-1">
                        {pred.name}
                      </h4>
                      <div className="text-[10px] text-slate-400 mb-3 flex items-center space-x-2">
                        <span>{pred.distance_km} km</span>
                        <span>•</span>
                        <span>ETA: <strong className="text-cyan-300">{pred.gnn_eta_hours || pred.base_eta_hours} hrs</strong></span>
                        <span>•</span>
                        <span>Resilience: <strong className="text-slate-200">{pred.resilience_score}%</strong></span>
                      </div>

                      <div className="space-y-1.5 p-2.5 rounded bg-slate-900/90 border border-slate-800 mb-3">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>MULTI-HORIZON DISRUPTION PROJECTION</span>
                          <span className="text-cyan-400 font-mono">T+1h to T+48h</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-center font-mono">
                          {[
                            { key: 't_plus_1h', label: '+1h' },
                            { key: 't_plus_6h', label: '+6h' },
                            { key: 't_plus_12h', label: '+12h' },
                            { key: 't_plus_24h', label: '+24h' },
                            { key: 't_plus_48h', label: '+48h' },
                          ].map(({ key, label }) => {
                            const val = pred.disruption_prob_horizons[key as keyof typeof pred.disruption_prob_horizons];
                            const isSelected = selectedHorizon === key;
                            return (
                              <div
                                key={key}
                                onClick={() => setSelectedHorizon(key as any)}
                                className={`p-1 rounded cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                                }`}
                              >
                                <div className="text-[8px] text-slate-500">{label}</div>
                                <div className={`text-[10px] ${val > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
                                  {val}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1 p-2.5 rounded bg-slate-900/90 border border-slate-800 mb-3 text-[10px]">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>GNN ATTRIBUTION FACTORS</span>
                          <span className="text-rose-400 font-bold">{pred.dominant_failure_mode.replace(/_/g, ' ')}</span>
                        </div>
                        
                        <div className="space-y-1 text-[9px] text-slate-300">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Avalanche / Glacial:</span>
                            <span className="font-bold text-cyan-300">{attr.avalanche_glacial_hazard}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-cyan-400 h-full" style={{ width: `${attr.avalanche_glacial_hazard}%` }} />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Blizzard / Freezing Precip:</span>
                            <span className="font-bold text-blue-300">{attr.blizzard_freezing_precip}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-blue-400 h-full" style={{ width: `${attr.blizzard_freezing_precip}%` }} />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Landslide / Slope Shear:</span>
                            <span className="font-bold text-amber-300">{attr.landslide_slope_shear}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-amber-400 h-full" style={{ width: `${attr.landslide_slope_shear}%` }} />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Altitude Oxygen / Viscosity:</span>
                            <span className="font-bold text-purple-300">{attr.altitude_oxygen_engine_strain}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-purple-400 h-full" style={{ width: `${attr.altitude_oxygen_engine_strain}%` }} />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Hostile Threat & Chokepoint:</span>
                            <span className="font-bold text-rose-300">{Math.round(attr.hostile_interdiction_threat + attr.chokepoint_throughput_bottleneck)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-rose-400 h-full" style={{ width: `${attr.hostile_interdiction_threat + attr.chokepoint_throughput_bottleneck}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Status: <strong className="text-white">{pred.tactical_status}</strong>
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
                            <span>MONITORED</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>AVOID PASS</span>
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
      )}

      {activeSubTab === 'solver' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>ST-GNN DYNAMIC MULTI-HOP RESILIENT ROUTING SOLVER</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Computes the mission-critical optimal path over the GNN-predicted dynamic risk cost surface.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-bold">ORIGIN:</span>
                  <select
                    value={sourceNodeId}
                    onChange={(e) => setSourceNodeId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                  >
                    {nodesList.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.theater.replace(/_/g, ' ')}) [{n.elevation_m}m]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-bold">DESTINATION:</span>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                  >
                    {nodesList.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.theater.replace(/_/g, ' ')}) [{n.elevation_m}m]
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSolveRoute}
                  disabled={solverLoading || sourceNodeId === targetNodeId}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all shadow-glow-cyan disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>{solverLoading ? 'SOLVING GNN GRAPH...' : 'COMPUTE RESILIENT PATH'}</span>
                </button>
              </div>
            </div>

            {sourceNodeId === targetNodeId && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                Please select different origin and destination nodes to calculate a multi-hop tactical route.
              </div>
            )}
          </div>

          {routeResult && (
            <div className="space-y-6">
              {routeResult.tactical_advantage_analysis && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-emerald-950/40 border border-cyan-500/40 shadow-glow-cyan flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                      <ShieldCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        TACTICAL ADVANTAGE VERDICT
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {routeResult.tactical_advantage_analysis.mission_survivability_verdict === 'TACTICALLY_SUPERIOR'
                          ? 'ST-GNN ROUTE IS MISSION-CRITICAL & SUPERIOR TO NAIVE DISTANCE'
                          : 'DIRECT NAIVE ROUTE MEETS ST-GNN SAFETY TOLERANCE'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs font-mono">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">RISK REDUCTION</div>
                      <div className="text-base font-black text-emerald-400">
                        -{routeResult.tactical_advantage_analysis.risk_reduction_pct}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">RESILIENCE BOOST</div>
                      <div className="text-base font-black text-cyan-300">
                        +{routeResult.tactical_advantage_analysis.resilience_boost_pct}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400">ETA DELTA</div>
                      <div className="text-base font-black text-amber-300">
                        {routeResult.tactical_advantage_analysis.eta_tradeoff_hours > 0
                          ? `+${routeResult.tactical_advantage_analysis.eta_tradeoff_hours}h`
                          : `${routeResult.tactical_advantage_analysis.eta_tradeoff_hours}h`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-cyan-500/40 shadow-glow-cyan space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        ST-GNN OPTIMAL RESILIENT PATH (RECOMMENDED)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      MINIMAL CUMULATIVE RISK
                    </span>
                  </div>

                  {routeResult.gnn_resilient_path ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">TOTAL DISTANCE</div>
                          <div className="font-bold text-white mt-0.5">
                            {routeResult.gnn_resilient_path.total_distance_km} km
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">ESTIMATED ETA</div>
                          <div className="font-bold text-cyan-300 mt-0.5">
                            {routeResult.gnn_resilient_path.total_eta_hours} hrs
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">COMPOSITE RISK</div>
                          <div className="font-bold text-emerald-400 mt-0.5">
                            {routeResult.gnn_resilient_path.composite_risk_score}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          WAYPOINT EXECUTION TIMELINE ({routeResult.gnn_resilient_path.hops_count} HOPS)
                        </div>
                        <div className="space-y-2">
                          {routeResult.gnn_resilient_path.waypoints.map((wp, idx) => (
                            <div key={wp.node_id} className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-white">{wp.name}</div>
                                  <div className="text-[10px] text-slate-400 font-sans">
                                    Alt: {wp.elevation_m}m • {wp.incoming_segment || 'Departure Point'}
                                  </div>
                                </div>
                              </div>
                              {wp.leg_distance_km > 0 && (
                                <div className="text-right text-[10px]">
                                  <div className="text-slate-300 font-bold">+{wp.leg_distance_km} km</div>
                                  <div className={wp.leg_disruption_risk > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                                    Risk: {wp.leg_disruption_risk}%
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-rose-400">
                      No safe viable route found between selected points under current hazard conditions.
                    </div>
                  )}
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        NAIVE SHORTEST DISTANCE PATH (STATIC ROUTE)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      HIGH RISK OF ATTRITION
                    </span>
                  </div>

                  {routeResult.naive_distance_path ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">TOTAL DISTANCE</div>
                          <div className="font-bold text-white mt-0.5">
                            {routeResult.naive_distance_path.total_distance_km} km
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">ESTIMATED ETA</div>
                          <div className="font-bold text-slate-300 mt-0.5">
                            {routeResult.naive_distance_path.total_eta_hours} hrs
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[9px] text-slate-500">COMPOSITE RISK</div>
                          <div className="font-bold text-rose-400 mt-0.5">
                            {routeResult.naive_distance_path.composite_risk_score}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          STATIC ROUTE SEGMENTS ({routeResult.naive_distance_path.hops_count} HOPS)
                        </div>
                        <div className="space-y-2">
                          {routeResult.naive_distance_path.segments.map((seg) => (
                            <div key={seg.id} className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-200">{seg.name}</div>
                                <div className="text-[10px] text-slate-400 font-sans">
                                  {seg.distance_km} km • Status: <span className={seg.disruption_prob > 50 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{seg.tactical_status}</span>
                                </div>
                              </div>
                              <div className="text-right text-[10px]">
                                <span className={`font-bold ${seg.disruption_prob > 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                                  {seg.disruption_prob}% Risk
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No static route available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'whitebox' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4 border-purple-500/20 shadow-glow-purple">
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                MATHEMATICAL FOUNDATIONS & SPATIAL-TEMPORAL GNN ARCHITECTURE
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Logiscope utilizes an inductive Spatio-Temporal Graph Attention Network (ST-GAT) coupled with Temporal Gated Recurrent Units (T-GRU). 
              The spatial attention heads learn terrain-conditioned convolution kernels across mountain passes, while the temporal recurrent cell models moving meteorological fronts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-xl space-y-4 border border-slate-800">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>FORMAL NEURAL FORMULATIONS</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">1. Spatial Graph Attention Mechanism (Edge Conditioned)</div>
                  <LatexMath
                    displayMode={true}
                    math="\alpha_{uv}^{(k)} = \frac{\exp\left(\text{LeakyReLU}\left(\mathbf{a}_{\text{src}}^T \mathbf{W}_v \mathbf{h}_u + \mathbf{a}_{\text{dst}}^T \mathbf{W}_v \mathbf{h}_v + \mathbf{a}_{\text{edge}}^T \mathbf{W}_e \mathbf{e}_{uv}\right)\right)}{\sum_{w \in \mathcal{N}(u)} \exp\left(\text{LeakyReLU}\left(\mathbf{a}_{\text{src}}^T \mathbf{W}_v \mathbf{h}_u + \mathbf{a}_{\text{dst}}^T \mathbf{W}_v \mathbf{h}_w + \mathbf{a}_{\text{edge}}^T \mathbf{W}_e \mathbf{e}_{uw}\right)\right)}"
                  />
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">2. Temporal Gated Recurrent Dynamic Update (T-GRU)</div>
                  <LatexMath
                    displayMode={true}
                    math="\mathbf{z}_t = \sigma(\mathbf{W}_z \mathbf{H}_t + \mathbf{U}_z \mathbf{S}_{t-1}), \quad \mathbf{r}_t = \sigma(\mathbf{W}_r \mathbf{H}_t + \mathbf{U}_r \mathbf{S}_{t-1})"
                  />
                  <LatexMath
                    displayMode={true}
                    math="\mathbf{S}_t = (1 - \mathbf{z}_t) \odot \mathbf{S}_{t-1} + \mathbf{z}_t \odot \tanh(\mathbf{W}_h \mathbf{H}_t + \mathbf{U}_h (\mathbf{r}_t \odot \mathbf{S}_{t-1}))"
                  />
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">3. Dynamic Cost Surface Objective for Dijkstra Optimization</div>
                  <LatexMath
                    displayMode={true}
                    math="C_{uv}(t) = d_{uv} \cdot \left( 1.0 + \lambda_1 \cdot \hat{P}_{\text{disrupt}}(e_{uv}, t) + \lambda_2 \cdot \frac{|\Delta h_{uv}|}{d_{uv}} + \lambda_3 \cdot \Omega_{\text{weather}}(t) \right)"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-4 border border-slate-800">
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>VALIDATION BENCHMARKS & TOPOLOGY METRICS</span>
              </div>

              {gnnSpecs && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">DISRUPTION ROC-AUC</div>
                      <div className="text-xl font-black text-emerald-400 mt-1">
                        {gnnSpecs.validation_benchmark_metrics.disruption_classification_roc_auc}
                      </div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">DISRUPTION F1-SCORE</div>
                      <div className="text-xl font-black text-cyan-300 mt-1">
                        {gnnSpecs.validation_benchmark_metrics.disruption_f1_score}
                      </div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">GNN ETA MAE ERROR</div>
                      <div className="text-xl font-black text-emerald-400 mt-1">
                        {gnnSpecs.validation_benchmark_metrics.mean_absolute_eta_error_hours} hrs
                      </div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">CLASSICAL DIJKSTRA ERROR</div>
                      <div className="text-xl font-black text-rose-400 mt-1">
                        {gnnSpecs.validation_benchmark_metrics.classical_dijkstra_baseline_eta_error_hours} hrs
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      GRAPH TOPOLOGY SPECIFICATION
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Node Feature Vector (X_v):</span>
                        <span className="font-mono text-cyan-300">{gnnSpecs.graph_topology.node_feature_dimensions} Dimensions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Edge Feature Tensor (E_e):</span>
                        <span className="font-mono text-cyan-300">{gnnSpecs.graph_topology.edge_feature_dimensions} Dimensions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Spatial Attention Heads:</span>
                        <span className="font-mono text-white">{gnnSpecs.graph_topology.spatial_attention_heads} Heads</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hidden Embedding Space:</span>
                        <span className="font-mono text-white">{gnnSpecs.graph_topology.hidden_embedding_size} Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chebyshev Filter Order:</span>
                        <span className="font-mono text-white">K = {gnnSpecs.graph_topology.chebyshev_polynomial_order}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
