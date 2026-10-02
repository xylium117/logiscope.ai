import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  CircleMarker,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import type { LogisticsNode, RouteSegment } from '../types';
import { 
  Layers, 
  Mountain, 
  Satellite, 
  Map as MapIcon,
  Navigation,
  Compass,
  Fuel,
  Target,
  Package,
  HeartPulse,
  AlertTriangle
} from 'lucide-react';

interface GISMapProps {
  nodes: LogisticsNode[];
  routes: RouteSegment[];
  onSelectNode?: (node: LogisticsNode) => void;
  selectedNodeId?: string;
  showWeatherOverlay?: boolean;
}

const MapController: React.FC<{ nodes: LogisticsNode[]; selectedNodeId?: string }> = ({ nodes, selectedNodeId }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedNodeId) {
      const selected = nodes.find((n) => n.id === selectedNodeId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], 9, { duration: 1.2 });
        return;
      }
    }

    if (nodes.length > 0) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9, duration: 1.0 });
    }
  }, [nodes, selectedNodeId, map]);

  return null;
};

const createNodeIcon = (node: LogisticsNode, isSelected: boolean) => {
  let color = '#00F0FF';
  let bgColor = 'rgba(0, 240, 255, 0.2)';
  let border = '#00F0FF';

  if (node.type === 'DEPOT') {
    color = '#38BDF8';
    bgColor = 'rgba(56, 189, 248, 0.35)';
    border = '#38BDF8';
  } else if (node.type === 'HUB') {
    color = '#F59E0B';
    bgColor = 'rgba(245, 158, 11, 0.35)';
    border = '#F59E0B';
  } else {
    if ((node.readiness_index ?? 100) < 65) {
      color = '#FF3366';
      bgColor = 'rgba(255, 51, 102, 0.4)';
      border = '#FF3366';
    } else {
      color = '#10B981';
      bgColor = 'rgba(16, 185, 129, 0.35)';
      border = '#10B981';
    }
  }

  const selectedRing = isSelected ? `box-shadow: 0 0 25px 6px ${color}; transform: scale(1.25);` : '';
  const nodeLabel = node.type === 'DEPOT' ? 'DEP' : (node.type === 'HUB' ? 'HUB' : (node.id ? node.id.replace('UNIT-', '') : 'FWD'));

  return L.divIcon({
    className: 'custom-c2-marker',
    html: `
      <div style="
        width: 34px; 
        height: 34px; 
        border-radius: 50%; 
        background: #0D1525; 
        border: 2.5px solid ${border}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: ${color}; 
        font-family: 'JetBrains Mono', monospace; 
        font-weight: 800; 
        font-size: 10px;
        box-shadow: 0 0 16px ${bgColor};
        transition: all 0.3s ease;
        ${selectedRing}
      ">
        ${nodeLabel}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

export const GISMap: React.FC<GISMapProps> = ({
  nodes,
  routes,
  onSelectNode,
  selectedNodeId,
}) => {
  const [activeLayer, setActiveLayer] = useState<'DEFAULT' | 'ESRI_SATELLITE' | 'ESRI_TOPO'>('DEFAULT');
  
  const centerPos: [number, number] = [31.5000, 84.0000];

  const getRouteColor = (route: RouteSegment) => {
    if (route.is_blocked) return '#FF3366';
    if (route.resilience_score >= 85) return '#00F0FF';
    if (route.resilience_score >= 65) return '#F59E0B';
    return '#FF3366';
  };

  const getTileConfig = () => {
    switch (activeLayer) {
      case 'ESRI_SATELLITE':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, Maxar, Earthstar Geographics'
        };
      case 'ESRI_TOPO':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, HERE, Garmin, Intermap'
        };
      case 'DEFAULT':
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, DeLorme, NAVTEQ'
        };
    }
  };

  const tileConfig = getTileConfig();

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-command-border shadow-2xl bg-[#070B12]">
      {/* Map Layer Switcher Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono shadow-xl">
        <button
          onClick={() => setActiveLayer('DEFAULT')}
          className={`px-2.5 py-1 rounded transition-colors flex items-center space-x-1 ${
            activeLayer === 'DEFAULT' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>DEFAULT</span>
        </button>
        <button
          onClick={() => setActiveLayer('ESRI_SATELLITE')}
          className={`px-2.5 py-1 rounded transition-colors flex items-center space-x-1 ${
            activeLayer === 'ESRI_SATELLITE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>SATELLITE</span>
        </button>
        <button
          onClick={() => setActiveLayer('ESRI_TOPO')}
          className={`px-2.5 py-1 rounded transition-colors flex items-center space-x-1 ${
            activeLayer === 'ESRI_TOPO' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>TERRAIN/TOPO</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-lg bg-slate-900/95 backdrop-blur-md border border-slate-700 text-[11px] font-mono space-y-1.5 shadow-xl">
        <div className="font-bold text-slate-300 text-[10px] tracking-wider uppercase border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>INDIAN FRONTIERS C2 GIS</span>
          <span className="text-[9px] text-cyan-400">ONLINE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Resilient Corridor (&gt;85%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-slate-300">Moderate Risk (65-84%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-slate-300">Choke-point / Cutoff (&lt;65%)</span>
        </div>
      </div>

      <MapContainer
        center={centerPos}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController nodes={nodes} selectedNodeId={selectedNodeId} />

        {/* Esri Tile Layer */}
        <TileLayer
          key={activeLayer}
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          maxZoom={18}
        />

        {/* Esri Reference Labels Layer (When on Dark Canvas) */}
        {activeLayer === 'DEFAULT' && (
          <TileLayer
            attribution=""
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        )}

        {/* Render Route Segments */}
        {routes?.map((route) => {
          if (!route || !route.coordinates || !Array.isArray(route.coordinates) || route.coordinates.length < 2) return null;
          const color = getRouteColor(route);
          const isSelected = selectedNodeId === route.source_id || selectedNodeId === route.target_id;
          const theaterLabel = (route.theater || '').replace(/_/g, ' ') || 'THEATER';
          const typeLabel = (route.type || '').replace(/_/g, ' ') || 'TACTICAL ROUTE';

          return (
            <Polyline
              key={route.id || `${route.source_id}-${route.target_id}`}
              positions={route.coordinates as [number, number][]}
              pathOptions={{
                color: color,
                weight: isSelected ? 5 : (route.type === 'PRIMARY_HIGHWAY' ? 4 : 2.5),
                dashArray: route.type === 'ALTERNATE_TACTICAL' || route.type === 'AIR_CORRIDOR' ? '6, 8' : undefined,
                opacity: route.is_blocked ? 0.9 : 0.85,
              }}
            >
              <Popup>
                <div className="p-2 font-mono text-xs space-y-1.5 min-w-[200px]">
                  <div className="font-bold text-cyan-300 border-b border-slate-700 pb-1">
                    {route.name || 'TACTICAL ROUTE'}
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>THEATER:</span> <span className="font-semibold text-white">{theaterLabel}</span>
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>TYPE:</span> <span className="font-semibold text-white">{typeLabel}</span>
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>DISTANCE:</span> <span className="text-white">{route.distance_km ?? 0} km</span>
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>EST. ETA:</span> <span className="text-white">{route.dynamic_eta_hours || route.base_eta_hours || '--'} hrs</span>
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>RESILIENCE:</span> 
                    <span className={(route.resilience_score ?? 0) > 75 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {route.resilience_score ?? 0}%
                    </span>
                  </div>
                  {route.bottleneck_warning && (
                    <div className="p-1.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] mt-1 flex items-start space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                      <span>{route.bottleneck_warning}</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render Digital Twin Nodes */}
        {nodes?.map((node) => {
          if (!node || typeof node.lat !== 'number' || typeof node.lng !== 'number') return null;
          const isSelected = selectedNodeId === node.id;
          const nodeTheater = (node.theater || '').replace(/_/g, ' ');

          return (
            <React.Fragment key={node.id}>
              {/* Radius pulse circle for degraded units */}
              {(node.readiness_index ?? 100) < 65 && (
                <CircleMarker
                  center={[node.lat, node.lng]}
                  radius={28}
                  pathOptions={{
                    color: '#FF3366',
                    fillColor: '#FF3366',
                    fillOpacity: 0.2,
                    weight: 1.5,
                    dashArray: '4, 4',
                  }}
                />
              )}

              <Marker
                position={[node.lat, node.lng]}
                icon={createNodeIcon(node, isSelected)}
                eventHandlers={{
                  click: () => onSelectNode && onSelectNode(node),
                }}
              >
                <Popup>
                  <div className="p-2 font-mono text-xs space-y-2 min-w-[220px]">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                      <div>
                        <div className="font-bold text-white text-sm">{node.name || node.id}</div>
                        {nodeTheater && <div className="text-[10px] text-cyan-400">{nodeTheater}</div>}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        (node.readiness_index ?? 0) > 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {node.readiness_index ?? 0}% READINESS
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span>TEMPO:</span> <span className="text-cyan-300">{node.operational_tempo || 'NORMAL'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ELEVATION:</span> <span>{node.elevation_m ?? 0}m ({node.terrain_type || 'STANDARD'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WEATHER:</span> <span className="text-amber-300">{node.weather_condition || 'CLEAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PERSONNEL:</span> <span>{node.personnel_count ?? 0} Troops</span>
                      </div>
                    </div>

                    {node.current_inventory && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Reserves:</div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="bg-slate-800/90 p-1.5 rounded flex items-center space-x-1.5">
                            <Fuel className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Fuel: <span className="font-bold text-white">{node.current_inventory.fuel ?? 0}kL</span></span>
                          </div>
                          <div className="bg-slate-800/90 p-1.5 rounded flex items-center space-x-1.5">
                            <Target className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Ammo: <span className="font-bold text-white">{node.current_inventory.ammunition ?? 0}T</span></span>
                          </div>
                          <div className="bg-slate-800/90 p-1.5 rounded flex items-center space-x-1.5">
                            <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Rations: <span className="font-bold text-white">{node.current_inventory.rations ?? 0}</span></span>
                          </div>
                          <div className="bg-slate-800/90 p-1.5 rounded flex items-center space-x-1.5">
                            <HeartPulse className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Medical: <span className="font-bold text-white">{node.current_inventory.medical ?? 0}</span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
