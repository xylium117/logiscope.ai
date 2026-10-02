import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  TrendingDown, 
  Compass, 
  Sliders, 
  RadioTower, 
  Cpu,
  History,
  ChevronRight 
} from 'lucide-react';

export type TabType = 'dashboard' | 'map' | 'forecast' | 'routes' | 'simulation' | 'historical' | 'telemetry' | 'synthetic';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  shortagesCount: number;
  anomalyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  shortagesCount,
  anomalyCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Command Dashboard',
      description: 'C2 Overview & Actionable Plan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'map' as TabType,
      label: 'GIS Operations Map',
      description: 'Frontier Network & Live GIS',
      icon: Map,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'forecast' as TabType,
      label: 'Demand & Shortages',
      description: 'Multivariate 7-Day Burn Curve',
      icon: TrendingDown,
      badge: shortagesCount > 0 ? `${shortagesCount} RISK` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'routes' as TabType,
      label: 'Route & Terrain Intel',
      description: 'Resilience vs Distance Scoring',
      icon: Compass,
      badge: null,
    },
    {
      id: 'simulation' as TabType,
      label: 'What-If Simulation Lab',
      description: 'Disruption & Scenario Sandbox',
      icon: Sliders,
      badge: 'SOLVER',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'historical' as TabType,
      label: 'Historical Battle Cases',
      description: '1999 Kargil, 1962 Rezang La, 2020',
      icon: History,
      badge: 'CASES',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'telemetry' as TabType,
      label: 'IoT & Anomaly Radar',
      description: 'RFID, Scale & Temp Telemetry',
      icon: RadioTower,
      badge: anomalyCount > 0 ? `${anomalyCount} ANOM` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'synthetic' as TabType,
      label: 'Synthetic Engine & Math',
      description: 'Formulations & Physics Sandbox',
      icon: Cpu,
      badge: 'WHITEBOX',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  ];

  return (
    <aside className="w-72 lg:w-80 border-r border-command-border bg-[#0B111E]/95 backdrop-blur-md flex flex-col justify-between py-4 select-none shrink-0 z-20">
      <div className="space-y-1.5 px-3.5">
        <div className="px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <span className="text-cyan-400 font-bold">8 ACTIVE</span>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-cyan-950/70 border border-command-accent/60 text-cyan-300 shadow-glow-cyan'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                <div
                  className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? 'bg-command-accent text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/90 text-slate-300 group-hover:text-cyan-300 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold font-mono tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 pl-1">
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                    isActive ? 'text-cyan-400 transform translate-x-0.5' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer System Diagnostic Box */}
      <div className="px-4 pt-4 border-t border-command-border mx-3 mt-4">
        <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 text-[11px] font-mono space-y-2 shadow-inner">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">THEATER GRID:</span>
            <span className="text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px]">
              PAN-FRONTIER
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">HIGH-ALT STATUS:</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span>
              C2 ONLINE
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">PHYSICS ENGINE:</span>
            <span className="text-purple-300 font-bold">SYNTHETIC TWIN</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
