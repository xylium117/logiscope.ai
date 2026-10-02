import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Recommendation } from '../types';
import { applyRecommendation } from '../services/api';

interface ExplainableModalProps {
  recommendation: Recommendation | null;
  onClose: () => void;
  onApplied?: (recId: string) => void;
}

export const ExplainableModal: React.FC<ExplainableModalProps> = ({
  recommendation,
  onClose,
  onApplied,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!recommendation) return null;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyRecommendation(recommendation.id);
      setAppliedSuccess(true);
      setTimeout(() => {
        if (onApplied) onApplied(recommendation.id);
        onClose();
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-command-card border border-cyan-500/50 rounded-2xl shadow-glow-cyan overflow-hidden p-6 md:p-8 font-mono">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <HelpCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                EXPLAINABLE AI REASONING
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                {recommendation.confidence_score}% CONFIDENCE
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {recommendation.title}
            </h2>
          </div>
        </div>

        {/* Action Summary Box */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-1 mb-5">
          <div className="text-[10px] uppercase font-bold text-cyan-400">RECOMMENDED ACTION:</div>
          <p className="font-sans leading-relaxed text-sm text-slate-100">{recommendation.action_summary}</p>
        </div>

        {/* "WHY?" Reasoning Section */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>WHY DID THE DECISION ENGINE RECOMMEND THIS?</span>
          </div>

          <div className="space-y-2 font-sans text-xs">
            {recommendation.explanation.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <span className="text-slate-300 leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Key Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center font-mono">
          {Object.entries(recommendation.explanation.key_metrics || {}).map(([key, val], idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
              <div className="text-[10px] text-slate-400 uppercase">{key}</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">{val}</div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">
            STATUS: <span className="text-amber-400 font-bold">{recommendation.urgency}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              disabled={isApplying || appliedSuccess}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-glow-cyan flex items-center space-x-2 disabled:opacity-50"
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>COMMITTED TO ORDERS</span>
                </>
              ) : isApplying ? (
                <span>DISPATCHING...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white fill-white" />
                  <span>EXECUTE OPERATIONAL ORDER</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
