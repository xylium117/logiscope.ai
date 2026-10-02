import React, { useState, useEffect } from 'react';
import { useIsLandscapeSmall } from '../hooks/useIsLandscape';
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
  const isLS = useIsLandscapeSmall();

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
    <header className="h-16 lm:h-12 border-b border-command-border bg-command-card/95 backdrop-blur-md px-4 lm:px-3 ls:px-2 flex items-center justify-between z-30 sticky top-0 font-mono">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3.5 lm:space-x-2">
        <div className="relative flex items-center justify-center w-9 h-9 lm:w-7 lm:h-7 rounded-lg bg-cyan-950/80 border border-command-accent text-command-accent shadow-glow-cyan shrink-0">
          <Radio className="w-4 h-4 lm:w-3 lm:h-3 animate-pulse text-cyan-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg lm:text-sm font-black tracking-wider text-white font-mono">
              LOGISCOPE<span className="text-command-accent">.AI</span>
            </h1>
            <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">
              INDIA C2 v2.8
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden xl:block">
            Predictive Terrain-Aware Logistics Digital Twin
          </p>
        </div>
      </div>

      {/* Center Tactical Selectors: Region Theater & Network Variation */}
      <div className="flex items-center space-x-2 lm:space-x-1.5">
        {/* Theater Switcher Dropdown */}
        <div className="flex items-center space-x-1.5 px-2.5 lm:px-1.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">THEATER:</span>
          <select
            value={selectedTheater}
            onChange={(e) => onSelectTheater(e.target.value)}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1 max-w-[90px] lm:max-w-[70px]"
          >
            <option value="ALL" className="bg-slate-900 text-white">Pan-Frontier</option>
            <option value="NORTHERN_LADAKH" className="bg-slate-900 text-white">Northern (Ladakh)</option>
            <option value="CENTRAL_UTTARAKHAND" className="bg-slate-900 text-white">Central (Uttarakhand)</option>
            <option value="EASTERN_ARUNACHAL" className="bg-slate-900 text-white">Eastern (Arunachal)</option>
          </select>
        </div>

        {/* Network Variation Switcher Dropdown */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 lm:px-1.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs">
          <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden lg:inline">NETWORK POSTURE:</span>
          <select
            value={selectedVariation}
            onChange={(e) => onSelectVariation(e.target.value)}
            className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer pr-1 max-w-[90px] lm:max-w-[70px]"
          >
            <option value="STANDARD" className="bg-slate-900 text-slate-200">Standard</option>
            <option value="WINTER_FREEZE" className="bg-slate-900 text-amber-300">Winter Freeze</option>
            <option value="TACTICAL_SURGE" className="bg-slate-900 text-rose-300">Tactical Surge</option>
            <option value="CHOKEPOINT_STRESS" className="bg-slate-900 text-purple-300">Chokepoint Stress</option>
          </select>
          {activeVariationObj && (
            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded hidden xl:inline-block ${
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
      <div className="flex items-center space-x-3 lm:space-x-2">
        {/* Compact badge for landscape-small */}
        {isLS && (
          activeRiskCount > 0 ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{activeRiskCount}</span>
            </div>
          ) : (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            >
              <ShieldCheck className="w-3 h-3" />
            </div>
          )
        )}

        {/* Full badge for xl+ screens */}
        {!isLS && (activeRiskCount > 0 ? (
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{activeRiskCount} DEFICITS</span>
          </div>
        ) : (
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NOMINAL</span>
          </div>
        ))}

        {/* Flagship Button */}
        {isLS ? (
          /* Icon-only square on landscape-small */
          <button
            onClick={onTriggerForecast}
            disabled={isForecastRunning}
            title={isForecastRunning ? 'Simulating...' : 'Simulate 7D Forecast'}
            style={{
              width: '2.25rem',
              height: '2.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5rem',
              flexShrink: 0,
            }}
            className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan transition-all disabled:opacity-50"
          >
            {isForecastRunning
              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              : <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
          </button>
        ) : (
          /* Full button on normal screens */
          <button
            onClick={onTriggerForecast}
            disabled={isForecastRunning}
            className="relative group overflow-hidden px-3.5 lm:px-2.5 py-2 lm:py-1 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shrink-0"
          >
            {isForecastRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>SIMULATING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>SIMULATE 7D</span>
              </>
            )}
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>
        )}
      </div>
    </header>
  );
};
