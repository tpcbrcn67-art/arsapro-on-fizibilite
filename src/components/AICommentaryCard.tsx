import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  FeasibilityResult,
  LandData,
  ProjectCostAssumptions,
  FeasibilityScenario,
} from '../types/feasibility';
import { generateAIProjectCommentary } from '../utils/calculator';

interface AICommentaryCardProps {
  land: LandData;
  assumptions: ProjectCostAssumptions;
  scenario: FeasibilityScenario;
  result: FeasibilityResult;
}

export const AICommentaryCard: React.FC<AICommentaryCardProps> = ({
  land,
  assumptions,
  scenario,
  result,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentary, setCommentary] = useState<string>(() =>
    generateAIProjectCommentary(land, assumptions, scenario, result)
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRefreshCommentary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCommentary(generateAIProjectCommentary(land, assumptions, scenario, result));
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg border border-indigo-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-amber-300 border border-indigo-400/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                ARSAPRO AI Proje Danışmanı &amp; Risk Yorumu
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Matematik: Deterministik • Yorum: AI
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Maliyet riskleri, satış fiyatı hassasiyeti ve senaryo farklarını otomatik yorumlar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefreshCommentary}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-400/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Yeniden Yorumla</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="text-xs text-slate-200 space-y-3 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-indigo-500/20">
          {commentary}
        </div>
      )}
    </div>
  );
};
