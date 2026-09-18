import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Building,
  Sparkles,
} from 'lucide-react';
import {
  FeasibilityResult,
  LandData,
  ProjectCostAssumptions,
  ReverseFeasibilityResult,
} from '../types/feasibility';
import { calculateReverseFeasibility } from '../utils/calculator';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface ReverseFeasibilityCardProps {
  baseResult: FeasibilityResult;
  land: LandData;
  assumptions: ProjectCostAssumptions;
}

export const ReverseFeasibilityCard: React.FC<ReverseFeasibilityCardProps> = ({
  baseResult,
  land,
  assumptions,
}) => {
  // Target profit or margin inputs
  const [calculationMode, setCalculationMode] = useState<'profitTL' | 'marginPercent'>('profitTL');
  const [targetProfitMillions, setTargetProfitMillions] = useState<number>(() => {
    return Math.round(baseResult.grossProfit / 1_000_000);
  });
  const [targetMargin, setTargetMargin] = useState<number>(() => {
    return Math.round(baseResult.profitMarginOnRevenue);
  });

  // Calculate reverse result
  const targetProfitTL = calculationMode === 'profitTL' ? targetProfitMillions * 1_000_000 : 0;
  const targetMarginPct = calculationMode === 'marginPercent' ? targetMargin : 0;

  const reverseResult: ReverseFeasibilityResult = calculateReverseFeasibility(
    baseResult,
    land,
    assumptions,
    targetProfitTL,
    targetMarginPct
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Geriye Dönük Hesap (Tersine Fizibilite)
            </h2>
            <p className="text-xs text-slate-500">
              &quot;Bu projenin hedeflenen kârla yapılabilmesi için satış fiyatı en az kaç TL/m² olmalıdır?&quot;
            </p>
          </div>
        </div>

        {/* Calculation mode selector */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCalculationMode('profitTL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calculationMode === 'profitTL'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hedef Net Kâr (TL)
          </button>
          <button
            type="button"
            onClick={() => setCalculationMode('marginPercent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calculationMode === 'marginPercent'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hedef Kâr Marjı (%)
          </button>
        </div>
      </div>

      {/* Target input slider / field */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        {calculationMode === 'profitTL' ? (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Hedeflenen Net Kâr:</span>
              <span className="text-base font-extrabold text-indigo-700">
                {targetProfitMillions.toLocaleString('tr-TR')} Milyon TL
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={1500}
              step={10}
              value={targetProfitMillions}
              onChange={(e) => setTargetProfitMillions(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10 M TL</span>
              <span>500 M TL</span>
              <span>1.000 M TL</span>
              <span>1.500 M TL</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Hedeflenen Kâr Marjı:</span>
              <span className="text-base font-extrabold text-indigo-700">
                %{targetMargin}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={1}
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>%5 (Hassas)</span>
              <span>%25 (Sektör Standardı)</span>
              <span>%40 (Yüksek Kâr)</span>
              <span>%60</span>
            </div>
          </div>
        )}
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Gerekli Satış Fiyatı */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Gerekli Minimum Ortalama Satış Fiyatı
          </div>
          <div className="text-2xl font-black text-slate-900">
            {Math.round(reverseResult.requiredMinSalesPricePerM2).toLocaleString('tr-TR')} TL/m²
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
            <span>Şu anki varsayılan satış fiyatı:</span>
            <strong className="text-slate-800">
              {Math.round(reverseResult.currentActualSalesPricePerM2).toLocaleString('tr-TR')} TL/m²
            </strong>
          </div>

          <div className="pt-2">
            {reverseResult.isFeasibleAtCurrentMarket ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Mevcut piyasa fiyatı hedef kârı karşılamaktadır (%{Math.abs(reverseResult.salesPriceDeltaPercent).toFixed(1)} tampon mevcuttur).
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  Hedef kâr için satış fiyatı %{Math.abs(reverseResult.salesPriceDeltaPercent).toFixed(1)} artırılmalıdır.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Kabul Edilebilir Maksimum Arsa Fiyatı */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Kabul Edilebilir Maksimum Arsa Bedeli
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatCurrency(reverseResult.maxAcceptableLandPriceTL)}
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
            <span>Kat Karşılığı denk gelen azami arsa sahibi payı:</span>
            <strong className="text-slate-900">
              %{reverseResult.maxAcceptableLandOwnerSharePercent.toFixed(1)}
            </strong>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
            Hedef kârı yakalamak için arsa sahibine ödenebilecek maksimum nakit bedeldir. Bu tutarın üzerinde bir arsa alımı kâr marjını eritecektir.
          </p>
        </div>
      </div>
    </div>
  );
};
