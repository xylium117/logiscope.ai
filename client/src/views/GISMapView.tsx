import React, { useState } from 'react';
import { 
  LogisticsNode, 
  RouteSegment, 
  TransportAsset 
} from '../types';
import { GISMap } from '../components/GISMap';
import { 
  MapPin, 
  Layers, 
  Mountain, 
  Wind, 
  Truck, 
  Activity, 
  ShieldAlert, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

interface GISMapViewProps {
  nodes: LogisticsNode[];
  routes: RouteSegment[];
  fleet: TransportAsset[];
  selectedNode: LogisticsNode | null;
  onSelectNode: (node: LogisticsNode) => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({
  nodes,
  routes,
  fleet,
  selectedNode,
  onSelectNode,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNodes = filterType === 'ALL' 
    ? nodes 
    : nodes.filter((n) => n.type === filterType);

  const activeNode = selectedNode || nodes[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8.5rem)] animate-in fade-in duration-300">
      {/* Main Full GIS Map Display */}
      <div className="lg:col-span-8 flex flex-col h-full space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3 font-mono">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              FILTER NODES:
            </span>
            <div className="flex space-x-1.5">
              {['ALL', 'DEPOT', 'HUB', 'FORWARD_UNIT'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    filterType === type
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-cyan-400">
            {nodes.length} Nodes • {routes.length} Corridors
          </div>
        </div>

        <div className="flex-1 w-full rounded-xl overflow-hidden shadow-2xl border border-command-border">
          <GISMap
            nodes={filteredNodes}
            routes={routes}
            selectedNodeId={activeNode?.id}
            onSelectNode={onSelectNode}
          />
        </div>
      </div>

      {/* Right Sidebar: Selected Node & Corridor Inspector */}
      <div className="lg:col-span-4 flex flex-col h-full space-y-4 overflow-y-auto">
        {/* Node Detail Card */}
        {activeNode && (
          <div className="glass-panel p-5 rounded-xl font-mono space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {activeNode.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5 font-sans">
                  {activeNode.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  ID: {activeNode.id} • {activeNode.personnel_count} Troops
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">READINESS</div>
                <div
                  className={`text-xl font-black ${
                    activeNode.readiness_index > 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {activeNode.readiness_index}%
                </div>
              </div>
            </div>

            {/* Environmental & Tactical Conditions */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">TERRAIN / ELEVATION</div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  {activeNode.terrain_type} ({activeNode.elevation_m}m)
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">WEATHER CONDITION</div>
                <div className="text-amber-400 font-semibold mt-0.5">
                  {activeNode.weather_condition}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">OPERATIONAL TEMPO</div>
                <div className="text-cyan-400 font-semibold mt-0.5">
                  {activeNode.operational_tempo}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">ACTIVE IOT PROBES</div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  {activeNode.iot_sensors_active} Connected
                </div>
              </div>
            </div>

            {/* Current Inventory vs Safety Threshold */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase mb-2">
                RESERVE INVENTORY LEVELS:
              </div>
              <div className="space-y-2 text-xs">
                {Object.entries(activeNode.current_inventory).map(([key, val]) => {
                  const safetyVal = (activeNode.safety_stock as any)[key] || 0;
                  const maxVal = (activeNode.max_capacity as any)[key] || val * 1.5;
                  const pct = Math.min(100, Math.round((val / maxVal) * 100));
                  const isLow = val <= safetyVal * 1.15;

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="capitalize text-slate-300">{key.replace('_', ' ')}</span>
                        <span className={isLow ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {val} / {maxVal} {key === 'fuel' ? 'kL' : (key === 'ammunition' ? 'T' : 'units')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isLow ? 'bg-rose-500' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Connected Routes Corridor Card */}
        <div className="glass-panel p-4 rounded-xl font-mono space-y-3 flex-1">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>CONNECTED RESILIENCE CORRIDORS</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-60 pr-1">
            {routes
              .filter(
                (r) =>
                  !activeNode ||
                  r.source_id === activeNode.id ||
                  r.target_id === activeNode.id
              )
              .map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-white">
                    <span className="truncate max-w-[190px]">{r.name}</span>
                    <span
                      className={
                        r.resilience_score > 75 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {r.resilience_score}% RESIL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Dist: {r.distance_km} km</span>
                    <span>ETA: {r.dynamic_eta_hours || r.base_eta_hours}h</span>
                  </div>
                  {r.bottleneck_warning && (
                    <div className="text-[10px] text-amber-400 pt-1 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{r.bottleneck_warning}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
