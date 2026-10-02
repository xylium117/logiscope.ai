import React, { useState, useEffect } from 'react';
import { 
  HistoricalCase, 
  LogisticsNode, 
  RouteSegment 
} from '../types';
import { fetchHistoricalCases } from '../services/api';
import { 
  History, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Mountain, 
  Truck, 
  Zap, 
  Compass, 
  Layers, 
  Play, 
  RotateCcw,
  Clock,
  MapPin
} from 'lucide-react';

interface HistoricalCasesViewProps {
  onLoadScenarioIntoSimulation?: (caseItem: HistoricalCase) => void;
  onNavigateToMapWithNodes?: (theater: string, nodeIds: string[]) => void;
}

export const HistoricalCasesView: React.FC<HistoricalCasesViewProps> = ({
  onLoadScenarioIntoSimulation,
  onNavigateToMapWithNodes,
}) => {
  const [cases, setCases] = useState<HistoricalCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE_KARGIL_1999');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const data = await fetchHistoricalCases();
        setCases(data);
        if (data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load historical cases:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  if (loading || !activeCase) {
    return (
      <div className="flex items-center justify-center h-96 font-mono text-cyan-400">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 animate-spin" />
          <span>LOADING HISTORICAL MILITARY LOGISTICS BENCHMARKS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-amber-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                <History className="w-3 h-3 text-amber-400" />
                <span>HISTORICAL DOCTRINE</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                REAL HIGH-ALTITUDE COMBAT LOGISTICS BENCHMARKS
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
              HISTORICAL FRONTIER LOGISTICS CASE STUDIES
            </h2>
            <p className="text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
              Demonstrating LOGISCOPE's digital twin and predictive constraint-solver against watershed Indian military logistics crises (1999 Kargil, 1962 Rezang La, 2020 Ladakh Standoff, 1962 Sela Pass). Compare manual historical breakdowns with proactive AI pre-positioning.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onLoadScenarioIntoSimulation && (
              <button
                onClick={() => onLoadScenarioIntoSimulation(activeCase)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-glow-cyan"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>INJECT CASE INTO SIMULATOR</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Case Selector Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cases.map((c) => {
          const isSelected = c.id === activeCase.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`p-4 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/70 border-2 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isSelected ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-slate-800 text-amber-300 border-slate-700'
                  }`}>
                    {c.year} • {c.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{c.theater_name.split(' ')[0]}</span>
                </div>
                <h3 className="text-xs font-bold text-white font-sans line-clamp-2 mt-1">
                  {c.title}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{c.key_routes_involved.length} Corridors</span>
                <span className={isSelected ? 'text-cyan-300 font-bold flex items-center space-x-1' : 'text-slate-500'}>
                  <span>{isSelected ? 'ACTIVE CASE' : 'Inspect'}</span>
                  {isSelected && <ArrowRight className="w-3 h-3" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Case In-Depth Analysis Dossier */}
      <div className="space-y-6">
        {/* Case Header Card */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {activeCase.conflict_name}
                </span>
                <span className="text-xs text-slate-400">THEATER: {activeCase.theater_name}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white font-sans mt-2">
                {activeCase.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {onNavigateToMapWithNodes && (
                <button
                  onClick={() => onNavigateToMapWithNodes(activeCase.theater, activeCase.key_nodes_involved)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VIEW ON GIS MAP</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {activeCase.scenario_overview}
          </p>
        </div>

        {/* Side-by-Side: Historical Manual Breakdown vs. AI Digital Twin Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Historical Manual Outcome */}
          <div className="glass-panel p-6 rounded-xl border-rose-500/40 space-y-4 bg-gradient-to-b from-rose-950/20 to-transparent">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>1. HISTORICAL MANUAL LOGISTICS BREAKDOWN</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                REACTIVE FRICTION
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-900/60 text-xs text-rose-200 font-sans leading-relaxed">
              <span className="text-rose-400 font-bold font-mono block text-[10px] uppercase mb-1">
                HISTORICAL CRITICAL FAILURE POINT:
              </span>
              {activeCase.historical_failure_point}
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">CRITICAL STOCKOUT DELAY:</span>
                <span className="text-rose-400 font-bold">{activeCase.historical_manual_outcome.stockout_delay_days}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">FORWARD FIRING / FUEL RATIONING:</span>
                <span className="text-amber-400 font-bold">{activeCase.historical_manual_outcome.artillery_or_fuel_shortage}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">CONVOY STALL / ATTRITION:</span>
                <span className="text-rose-300 font-bold">{activeCase.historical_manual_outcome.convoys_attrition}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">EMERGENCY AIRDROP INTERVENTION:</span>
                <span className="text-slate-300">{activeCase.historical_manual_outcome.reactive_emergency_airdrop}</span>
              </div>
            </div>

            {/* Bottlenecks List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                ROOT TERRAIN & OPERATIONAL BOTTLENECKS:
              </span>
              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                {activeCase.supply_bottlenecks.map((bn, bIdx) => (
                  <div key={bIdx} className="flex items-start space-x-2 p-2 rounded bg-rose-950/20 border border-rose-900/40">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{bn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Digital Twin AI Solution */}
          <div className="glass-panel p-6 rounded-xl border-cyan-500/40 space-y-4 bg-gradient-to-b from-cyan-950/20 to-transparent">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>2. LOGISCOPE PREDICTIVE AI DIGITAL TWIN SOLUTION</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PROACTIVE MITIGATION
              </span>
            </div>

            {/* Impact Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Readiness Gain</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {activeCase.digital_twin_ai_solution.simulated_readiness_gain}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Shortages Avoided</div>
                <div className="text-lg font-black text-cyan-300 mt-1">
                  {activeCase.digital_twin_ai_solution.prevented_shortages_pct}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Lead-Time Buffer</div>
                <div className="text-lg font-black text-purple-300 mt-1">
                  {activeCase.digital_twin_ai_solution.lead_time_buffer_hours}
                </div>
              </div>
            </div>

            {/* Tactical Actions Generated */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                OPTIMAL C2 ACTIONS SOLVED BY SYSTEM:
              </span>
              <div className="space-y-2 text-xs font-sans text-slate-200">
                {activeCase.digital_twin_ai_solution.proactive_actions.map((act, aIdx) => (
                  <div key={aIdx} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Strategy */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs">
              <span className="text-cyan-400 font-bold font-mono text-[10px] uppercase block mb-1">
                DYNAMIC CORRIDOR REROUTING STRATEGY:
              </span>
              <span className="text-slate-300 font-sans leading-relaxed">
                {activeCase.digital_twin_ai_solution.dynamic_rerouting_strategy}
              </span>
            </div>

            {/* Affected Nodes & Routes */}
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CRITICAL NODES:</span>
                <span className="text-white font-bold">{activeCase.key_nodes_involved.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">KEY CORRIDORS:</span>
                <span className="text-cyan-300 font-bold">{activeCase.key_routes_involved.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalCasesView;
