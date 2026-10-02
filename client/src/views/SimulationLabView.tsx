import React, { useState, useEffect } from 'react';
import { useIsLandscapeSmall } from '../hooks/useIsLandscape';
import { 
  Sliders, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CloudRain, 
  TrendingUp, 
  Ban,
  Sparkles
} from 'lucide-react';
import { RouteSegment, SimulationResult } from '../types';
import { runSimulation } from '../services/api';

interface SimulationLabViewProps {
  routes: RouteSegment[];
  initialParams?: {
    weather_condition: string;
    transport_availability_pct: number;
    demand_surge_pct: number;
    blocked_route_ids: string[];
    case_title?: string;
  };
}

export const SimulationLabView: React.FC<SimulationLabViewProps> = ({
  routes,
  initialParams,
}) => {
  const [weatherCondition, setWeatherCondition] = useState<string>(initialParams?.weather_condition || 'HEAVY_STORM');
  const [transportAvailability, setTransportAvailability] = useState<number>(initialParams?.transport_availability_pct ?? 70);
  const [demandSurge, setDemandSurge] = useState<number>(initialParams?.demand_surge_pct ?? 25);
  const [selectedBlockedRoutes, setSelectedBlockedRoutes] = useState<string[]>(
    initialParams?.blocked_route_ids || ['RT-LEH-NUBRA-KHARDUNGLA']
  );
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const isLS = useIsLandscapeSmall();

  useEffect(() => {
    if (initialParams) {
      if (initialParams.weather_condition) setWeatherCondition(initialParams.weather_condition);
      if (typeof initialParams.transport_availability_pct === 'number') setTransportAvailability(initialParams.transport_availability_pct);
      if (typeof initialParams.demand_surge_pct === 'number') setDemandSurge(initialParams.demand_surge_pct);
      if (initialParams.blocked_route_ids) setSelectedBlockedRoutes(initialParams.blocked_route_ids);
    }
  }, [initialParams]);

  const handleToggleRouteBlock = (routeId: string) => {
    setSelectedBlockedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId]
    );
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await runSimulation({
        weather_condition: weatherCondition,
        transport_availability_pct: transportAvailability,
        demand_surge_pct: demandSurge,
        blocked_route_ids: selectedBlockedRoutes,
      });
      setSimResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Simulation Sandbox Control Deck */}
      <div className="glass-panel p-6 rounded-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                "WHAT-IF?" LOGISTICS SCENARIO SANDBOX
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Inject disruptions, weather shocks & vehicle attrition to test supply chain resilience.
            </p>
          </div>

          {isLS ? (
            /* Icon-only square button for landscape-small */
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              title={isSimulating ? 'Computing...' : 'Simulate Scenario'}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                flexShrink: 0,
              }}
              className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan transition-all disabled:opacity-50"
            >
              {isSimulating
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Play className="w-4 h-4 fill-white" />}
            </button>
          ) : (
            /* Full button for normal screens */
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider text-xs shadow-glow-cyan flex items-center space-x-2 transition-all disabled:opacity-50 shrink-0"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>COMPUTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>SIMULATE</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* 4 Interactive Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ls:grid-cols-2 gap-5 ls:gap-3">
          {/* Weather Shock Selector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>WEATHER SHOCK:</span>
            </div>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="CLEAR">CLEAR (Nominal)</option>
              <option value="RAIN">MODERATE RAIN (+15% Burn)</option>
              <option value="HEAVY_STORM">HEAVY MONSOON/STORM (+30% Burn, 50% Speed)</option>
              <option value="SNOW_ICE">SEVERE BLIZZARD / ICE (+40% Burn)</option>
            </select>
          </div>

          {/* Transport Availability Slider */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>FLEET CAPACITY:</span>
              </span>
              <span className="text-cyan-400">{transportAvailability}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={transportAvailability}
              onChange={(e) => setTransportAvailability(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Severe Attrition (20%)</span>
              <span>Full (100%)</span>
            </div>
          </div>

          {/* Demand Surge Slider */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>DEMAND SURGE:</span>
              </span>
              <span className="text-amber-400">+{demandSurge}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={demandSurge}
              onChange={(e) => setDemandSurge(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Normal (+0%)</span>
              <span>Combat Surge (+80%)</span>
            </div>
          </div>

          {/* Route Blockade Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Ban className="w-4 h-4 text-rose-400" />
              <span>ROUTE CHOKEPOINTS:</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-[10px]">
              {routes.map((r) => {
                const isBlocked = selectedBlockedRoutes.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => handleToggleRouteBlock(r.id)}
                    className={`w-full text-left p-1 rounded truncate transition-colors flex items-center justify-between ${
                      isBlocked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    <span className="ml-1 font-bold">{isBlocked ? 'BLOCKED' : 'OPEN'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results Side-by-Side Comparison */}
      {simResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: WITHOUT MITIGATION */}
            <div className="glass-panel p-6 rounded-xl border-rose-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>WITHOUT AI MITIGATION (REACTIVE)</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  CRITICAL DEFICIT
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Readiness</div>
                  <div className="text-xl font-black text-rose-400 mt-1">
                    {simResult.without_mitigation.network_readiness_index}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Stockouts</div>
                  <div className="text-xl font-black text-rose-400 mt-1">
                    {simResult.without_mitigation.critical_shortages_count} Sites
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Mission Risk</div>
                  <div className="text-xl font-black text-rose-400 mt-1">
                    {simResult.without_mitigation.mission_failure_risk}
                  </div>
                </div>
              </div>

              {/* Shortage breakdown */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  UNMITIGATED SHORTAGE TIMELINE:
                </div>
                {simResult.without_mitigation.shortage_details.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{s.node_name}</span>
                      <span className="text-slate-400 block text-[10px]">
                        Category: {s.supply_category.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-rose-400 font-bold font-mono">
                      SHORTAGE IN {s.hours_to_stockout || s.hours_to_safety_breach}h
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: WITH AI MITIGATION */}
            <div className="glass-panel p-6 rounded-xl border-emerald-500/40 shadow-glow-success space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>WITH AI MITIGATION (PREDICTIVE PRE-POSITIONING)</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {simResult.with_ai_mitigation.shortages_avoided_count} DEFICITS AVOIDED
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Mitigated Readiness</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {simResult.with_ai_mitigation.network_readiness_index}%
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    +{simResult.with_ai_mitigation.readiness_gain}% Gain
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Deficits Avoided</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {simResult.with_ai_mitigation.shortages_avoided_count} Avoided
                  </div>
                  <div className="text-[10px] text-emerald-300">100% Buffer</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Mission Success</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {simResult.with_ai_mitigation.mission_success_rate}
                  </div>
                  <div className="text-[10px] text-emerald-300">Secured</div>
                </div>
              </div>

              {/* Avoided Shortages list */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  SYNTHESIZED AI MITIGATION ACTIONS:
                </div>
                {simResult.with_ai_mitigation.avoided_shortages.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{a.node_name}</span>
                      <span className="text-slate-300 block text-[10px]">
                        {a.action_taken} ({a.supply_category.toUpperCase()})
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{a.mitigated_status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
