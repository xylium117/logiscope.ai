import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  Sliders, 
  Layers, 
  Globe 
} from 'lucide-react';
import { TheaterMetadata, NetworkVariation } from '../types';

interface NavbarProps {
  theaters: TheaterMetadata[];
  selectedTheater: string;
  onSelectTheater: (theaterId: string) => void;
  variations: NetworkVariation[];
  selectedVariation: string;
  onSelectVariation: (variationId: string) => void;
  onTriggerForecast: () => void;
  isForecastRunning: boolean;
  activeRiskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theaters,
  selectedTheater,
  onSelectTheater,
  variations,
  selectedVariation,
  onSelectVariation,
  onTriggerForecast,
  isForecastRunning,
  activeRiskCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'ZULU'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeVariationObj = variations.find((v) => v.id === selectedVariation);

  return (
    <header className="h-16 border-b border-command-border bg-command-card/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 font-mono">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/80 border border-command-accent text-command-accent shadow-glow-cyan">
          <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-black tracking-wider text-white font-mono">
              LOGISCOPE<span className="text-command-accent">.AI</span>
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">
              INDIA C2 v2.8
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden xl:block">
            Predictive Terrain-Aware Logistics Digital Twin
          </p>
        </div>
      </div>

      {/* Center Tactical Selectors: Region Theater & Network Variation */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Theater Switcher Dropdown */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">THEATER:</span>
          <select
            value={selectedTheater}
            onChange={(e) => onSelectTheater(e.target.value)}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="ALL" className="bg-slate-900 text-white">Pan-Frontier Integrated</option>
            <option value="NORTHERN_LADAKH" className="bg-slate-900 text-white">Northern (Kashmir / Ladakh)</option>
            <option value="CENTRAL_UTTARAKHAND" className="bg-slate-900 text-white">Central (Uttarakhand)</option>
            <option value="EASTERN_ARUNACHAL" className="bg-slate-900 text-white">Eastern (Arunachal / NE)</option>
          </select>
        </div>

        {/* Network Variation Switcher Dropdown */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs">
          <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">NETWORK POSTURE:</span>
          <select
            value={selectedVariation}
            onChange={(e) => onSelectVariation(e.target.value)}
            className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="STANDARD" className="bg-slate-900 text-slate-200">Standard Resupply Backbone</option>
            <option value="WINTER_FREEZE" className="bg-slate-900 text-amber-300">Winter Freeze & Pass Blocks</option>
            <option value="TACTICAL_SURGE" className="bg-slate-900 text-rose-300">Tactical Crisis Surge</option>
            <option value="CHOKEPOINT_STRESS" className="bg-slate-900 text-purple-300">Chokepoint Stress Test</option>
          </select>
          {activeVariationObj && (
            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded hidden lg:inline-block ${
              activeVariationObj.risk_profile === 'CRITICAL' || activeVariationObj.risk_profile === 'SEVERE'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
            }`}>
              {activeVariationObj.badge}
            </span>
          )}
        </div>
      </div>

      {/* Right Action: Threats Badge & Signature Flagship Button */}
      <div className="flex items-center space-x-3">
        {activeRiskCount > 0 ? (
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{activeRiskCount} DEFICITS</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NOMINAL</span>
          </div>
        )}

        {/* Flagship Button */}
        <button
          onClick={onTriggerForecast}
          disabled={isForecastRunning}
          className="relative group overflow-hidden px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shrink-0"
        >
          {isForecastRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span className="hidden sm:inline">SIMULATING 7D...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>RUN 7D FORECAST</span>
            </>
          )}
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        </button>
      </div>
    </header>
  );
};
