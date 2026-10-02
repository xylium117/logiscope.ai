import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  Fuel, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  SlidersHorizontal 
} from 'lucide-react';
import { LogisticsNode, NodeForecast } from '../types';
import { fetchNodeForecast } from '../services/api';

interface ForecastViewProps {
  nodes: LogisticsNode[];
  selectedNode: LogisticsNode | null;
  onSelectNode: (node: LogisticsNode) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
}) => {
  const activeNode = selectedNode || nodes[3] || nodes[0];
  const [selectedCategory, setSelectedCategory] = useState<string>('fuel');
  const [forecastData, setForecastData] = useState<NodeForecast | null>(null);
  const [tempoOverride, setTempoOverride] = useState<string>('');
  const [weatherOverride, setWeatherOverride] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!activeNode) return;
    setLoading(true);
    fetchNodeForecast(activeNode.id, tempoOverride || undefined, weatherOverride || undefined)
      .then((data) => setForecastData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeNode, tempoOverride, weatherOverride]);

  const categories = [
    { id: 'fuel', name: 'Class III: Fuel (kL)', icon: Fuel },
    { id: 'ammunition', name: 'Class V: Ammunition (Tons)', icon: ShieldAlert },
    { id: 'rations', name: 'Class I: Rations (Pallets)', icon: Activity },
    { id: 'medical', name: 'Class VIII: Medical (Kits)', icon: ShieldCheck },
    { id: 'spare_parts', name: 'Class IX: Spare Parts (Crates)', icon: SlidersHorizontal },
  ];

  const chartData = forecastData?.days.map((day, idx) => {
    const catData = forecastData.categories[selectedCategory];
    if (!catData) return { name: day };
    const stock = catData.projected_stock[idx];
    const lb = catData.lower_bound_95[idx];
    const ub = catData.upper_bound_95[idx];
    const burn = catData.forecast_demand[idx];
    
    return {
      name: (day || '').replace(' (Now)', ''),
      projected_stock: stock,
      upper_bound: ub,
      lower_bound: lb,
      ci_range: [lb, ub],
      safety_stock: catData.safety_stock,
      daily_burn: burn,
    };
  }) || [];

  const currentCatData = forecastData?.categories[selectedCategory];
  const isShortage = currentCatData?.hours_to_safety_breach !== null || currentCatData?.hours_to_stockout !== null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Node Selector Ribbon */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            FORMATION / NODE:
          </span>
          <div className="flex space-x-2">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  node.id === activeNode.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-glow-cyan'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {(node.name || node.id || '').replace('Forward Tactical ', '').replace('Perimeter Defense ', '')}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Tempo:</span>
          <select
            value={tempoOverride || activeNode.operational_tempo}
            onChange={(e) => setTempoOverride(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-cyan-400 font-bold focus:outline-none"
          >
            <option value="LOW">LOW (0.75x)</option>
            <option value="NORMAL">NORMAL (1.0x)</option>
            <option value="HIGH">HIGH (1.45x)</option>
            <option value="SURGE">SURGE (1.90x)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const catInfo = forecastData?.categories[cat.id];
          const hasShortage = catInfo?.hours_to_safety_breach !== null;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-glow-cyan text-white'
                  : 'bg-command-card border-command-border text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                {hasShortage && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center space-x-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>DEFICIT</span>
                  </span>
                )}
              </div>
              <div className="text-xs font-bold truncate">{cat.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>Stock: <span className="text-cyan-300 font-semibold">{catInfo?.current_stock || 0}</span></span>
                <span>Burn: <span className="text-amber-300 font-semibold">{catInfo?.daily_burn_rate || 0}/d</span></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Depletion Projection Chart Card */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        {/* Banner Alert if Shortage is Predicted */}
        {isShortage ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  PREDICTIVE SHORTAGE ALERT: SAFETY THRESHOLD BREACH IMMINENT
                </div>
                <div className="text-sm font-bold text-white mt-0.5 font-sans">
                  Projected stock crosses minimum reserve in{' '}
                  <span className="text-rose-400 font-mono text-base underline decoration-rose-500">
                    {currentCatData?.hours_to_safety_breach} hours
                  </span>
                  {currentCatData?.hours_to_stockout && (
                    <span> (Complete stockout in {currentCatData?.hours_to_stockout} hours)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-400">Baseline Consumption Burn:</div>
              <div className="text-sm font-bold text-rose-300">
                {currentCatData?.daily_burn_rate} units / day
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>RESERVES SECURE ACROSS 7-DAY HORIZON</span>
            </div>
            <span className="text-slate-400">
              Current Stock: {currentCatData?.current_stock} &gt; Safety Buffer ({currentCatData?.safety_stock})
            </span>
          </div>
        )}

        {/* Chart Header & Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              PROJECTED INVENTORY DEPLETION CURVE (7-DAY HORIZON)
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Multivariate Autoregressive Burn Model with Physics-Calibrated 95% Confidence Interval Cone
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
              <span className="text-slate-300">Mean Stock</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-400/50 inline-block rounded-sm"></span>
              <span className="text-slate-300">95% CI Cone</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed inline-block"></span>
              <span className="text-rose-400">Safety Buffer</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Plot with True Floating Confidence Ribbon */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-[#0D1525]/95 border border-cyan-500/50 rounded-lg shadow-xl font-mono text-xs space-y-1">
                        <div className="font-bold text-cyan-300 border-b border-slate-700 pb-1">{label}</div>
                        <div className="flex justify-between space-x-4 text-slate-300">
                          <span>Projected Stock:</span>
                          <span className="font-bold text-cyan-400">{data.projected_stock}</span>
                        </div>
                        <div className="flex justify-between space-x-4 text-slate-400 text-[11px]">
                          <span>95% CI Range:</span>
                          <span className="text-slate-200">[{data.lower_bound} - {data.upper_bound}]</span>
                        </div>
                        {data.daily_burn > 0 && (
                          <div className="flex justify-between space-x-4 text-slate-400 text-[11px]">
                            <span>Daily Burn:</span>
                            <span className="text-amber-400">{data.daily_burn}</span>
                          </div>
                        )}
                        <div className="flex justify-between space-x-4 text-slate-400 text-[11px]">
                          <span>Safety Buffer:</span>
                          <span className="text-rose-400">{data.safety_stock}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* True 95% Confidence Interval Ribbon bounded by [lower_bound, upper_bound] */}
              <Area
                type="monotone"
                dataKey="ci_range"
                stroke="#38BDF8"
                strokeWidth={1}
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                fill="url(#confidenceBand)"
                name="95% Confidence Interval"
              />
              {/* Main Depletion Trajectory */}
              <Area
                type="monotone"
                dataKey="projected_stock"
                stroke="#00F0FF"
                strokeWidth={3}
                fill="url(#stockGradient)"
                name="Projected Reserves"
              />
              {/* Safety Reference Line */}
              {currentCatData?.safety_stock && (
                <ReferenceLine
                  y={currentCatData.safety_stock}
                  label={{
                    value: `SAFETY BUFFER: ${currentCatData.safety_stock}`,
                    fill: '#FF3366',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                  stroke="#FF3366"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
