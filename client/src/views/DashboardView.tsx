import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Truck, 
  TrendingUp, 
  ArrowRight, 
  HelpCircle, 
  Activity, 
  MapPin, 
  Clock, 
  Layers,
  Zap
} from 'lucide-react';
import { LogisticsNode, RouteSegment, ShortageAlert, Recommendation } from '../types';
import { GISMap } from '../components/GISMap';

interface DashboardViewProps {
  overviewData: any;
  nodes: LogisticsNode[];
  routes: RouteSegment[];
  shortages: ShortageAlert[];
  recommendations: Recommendation[];
  onSelectNode: (node: LogisticsNode) => void;
  onOpenExplainable: (rec: Recommendation) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overviewData,
  nodes,
  routes,
  shortages,
  recommendations,
  onSelectNode,
  onOpenExplainable,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Tactical KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Network Readiness */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Network Readiness Index
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white">
              {overviewData?.network_readiness_avg || 84.8}%
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">+3.2% vs 24h</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${overviewData?.network_readiness_avg || 84.8}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Transport Capacity */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Fleet Lift Capacity
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white">
              {overviewData?.transport_capacity_pct || 86.4}%
            </span>
            <span className="text-xs text-slate-400 font-mono">7 Convoys Active</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${overviewData?.transport_capacity_pct || 86.4}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Predicted Shortages Countdown */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-rose-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              Predicted Shortages
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-rose-400">
              {shortages.length || 3}
            </span>
            <span className="text-xs text-rose-300 font-mono font-semibold">Earliest in 38h</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>

        {/* Card 4: 7-Day Forecast Demand Pressure */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              7-Day Demand Pressure
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white">91.2%</span>
            <span className="text-xs text-amber-400 font-mono font-semibold">+24% High Surge</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full w-[91%]"></div>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Map & Predicted Shortages Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Twin GIS Operations Preview */}
        <div className="lg:col-span-8 glass-panel p-4 rounded-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                LOGISTICS DIGITAL TWIN NETWORK
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>EXPAND FULL GIS MAP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 w-full rounded-lg overflow-hidden">
            <GISMap nodes={nodes} routes={routes} onSelectNode={onSelectNode} />
          </div>
        </div>

        {/* Right Column: Predictive Shortage List */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                PREDICTED SHORTAGES
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              AHEAD OF TIME
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {shortages.map((shortage) => (
              <div
                key={shortage.id}
                className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all font-mono text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white truncate max-w-[170px]">
                    {shortage.node_name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      shortage.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {shortage.severity}
                  </span>
                </div>

                <div className="text-slate-300 text-[11px] flex justify-between py-0.5">
                  <span className="text-slate-400">CATEGORY:</span>
                  <span className="font-semibold text-cyan-300 uppercase">
                    {shortage.supply_category}
                  </span>
                </div>

                <div className="text-slate-300 text-[11px] flex justify-between py-0.5">
                  <span className="text-slate-400">EST. TIME TO DEFICIT:</span>
                  <span className="font-bold text-rose-400">
                    {shortage.hours_to_stockout || shortage.hours_to_safety_breach} HOURS
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Burn: {shortage.daily_burn_rate} units/day</span>
                  <span className="text-cyan-400">Reserves: {shortage.current_stock}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('forecast')}
            className="mt-3 w-full py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>INSPECT 7-DAY DEPLETION CURVES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Explainable AI Recommendation Feed */}
      <div className="glass-panel p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              DYNAMIC PRE-POSITIONING & OPTIMIZATION RECOMMENDATIONS
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Explainable AI Solver • 3 Proactive Actions Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all font-mono flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {(rec.type || 'RECOMMENDATION').replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    {rec.confidence_score}% CONFIDENCE
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white line-clamp-2 mb-2 font-sans">
                  {rec.title}
                </h3>

                <p className="text-[11px] text-slate-300 font-sans line-clamp-3 mb-3 leading-relaxed">
                  {rec.action_summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenExplainable(rec)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>WHY? (REASONING)</span>
                </button>

                <button
                  onClick={() => onOpenExplainable(rec)}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors text-[10px] uppercase shadow-sm"
                >
                  DISPATCH
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
