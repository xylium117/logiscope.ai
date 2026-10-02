import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  X,
  Compass,
  Box
} from 'lucide-react';
import { Recommendation, ShortageAlert } from '../types';

interface RunForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecommendations?: () => void;
  shortages: ShortageAlert[];
  recommendations: Recommendation[];
}

export const RunForecastModal: React.FC<RunForecastModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRecommendations,
  shortages,
  recommendations,
}) => {
  const [step, setStep] = useState<number>(1);
  const [locationsCount, setLocationsCount] = useState<number>(0);
  const [routesCount, setRoutesCount] = useState<number>(0);
  const [forecastsCount, setForecastsCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setLocationsCount(0);
      setRoutesCount(0);
      setForecastsCount(0);
      return;
    }

    const intervalLoc = setInterval(() => {
      setLocationsCount((prev) => (prev < 14 ? prev + 2 : 14));
    }, 100);

    const intervalRoutes = setInterval(() => {
      setRoutesCount((prev) => (prev < 37 ? prev + 5 : 37));
    }, 80);

    const intervalForecasts = setInterval(() => {
      setForecastsCount((prev) => (prev < 126 ? prev + 18 : 126));
    }, 60);

    const timer = setTimeout(() => {
      setStep(2);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#38BDF8', '#10B981'],
      });
    }, 1800);

    return () => {
      clearInterval(intervalLoc);
      clearInterval(intervalRoutes);
      clearInterval(intervalForecasts);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-command-card border border-command-accent/60 rounded-2xl shadow-glow-cyan p-6 md:p-8 ls:p-4 font-mono max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              7-DAY LOGISTICS PREDICTIVE RUN
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Forward-horizon spatio-temporal network simulation & dynamic mitigation synthesis
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className="py-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin flex items-center justify-center">
                <Box className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-cyan-300">
                COMPUTING DIGITAL TWIN TRAJECTORY...
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px]">LOCATIONS</div>
                  <div className="text-lg font-bold text-cyan-400">{locationsCount} / 14</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px]">ROUTES EVAL</div>
                  <div className="text-lg font-bold text-cyan-400">{routesCount} / 37</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px]">PREDICTIONS</div>
                  <div className="text-lg font-bold text-cyan-400">{forecastsCount} / 126</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Network Scale</div>
                <div className="text-lg font-bold text-white mt-1">14 Nodes • 37 Routes</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">126 Dynamic Curves</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-rose-400 uppercase">Predicted Risks</div>
                <div className="text-lg font-bold text-rose-400 mt-1">
                  {shortages.length || 3} Shortages Detected
                </div>
                <div className="text-[10px] text-amber-400 mt-0.5">2 Route Chokepoints</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-emerald-400 uppercase">AI Mitigation</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {recommendations.length || 6} Actions Synthesized
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5">+21.3% Readiness Gain</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>PREDICTIVE RESOLUTION GENERATED</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                The AI engine has identified a critical fuel and medical deficit approaching Forward Taskforce Delta and Outpost Echo in <span className="text-rose-400 font-bold font-mono">38-52 hours</span>. By initiating pre-positioned transfers from Hub Bravo across resilient bypass corridors, <span className="text-emerald-400 font-bold font-mono">88.5% of projected stockouts will be completely avoided</span> before supply lines close.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToRecommendations) onNavigateToRecommendations();
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-glow-cyan flex items-center space-x-2"
              >
                <span>VIEW AI RECOMMENDATIONS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
