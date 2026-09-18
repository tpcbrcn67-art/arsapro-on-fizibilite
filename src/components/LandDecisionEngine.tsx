import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  PieChart,
  Target,
  Scale,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  FeasibilityResult,
  FeasibilityScenario,
  LandData,
  ProjectCostAssumptions,
  StressTestState,
} from '../types/feasibility';
import { calculateStressTest } from '../utils/calculator';
import { formatCurrencyTL, formatNumber } from '../utils/formatters';

interface LandDecisionEngineProps {
  result: FeasibilityResult;
  scenario: FeasibilityScenario;
  land: LandData;
  assumptions: ProjectCostAssumptions;
}

export const LandDecisionEngine: React.FC<LandDecisionEngineProps> = ({
  result,
  scenario,
  land,
  assumptions,
}) => {
  // Stress Test Interactive State
  const [stress, setStress] = useState<StressTestState>({
    salesPriceDeltaPercent: -15, // Default requested: -15%
    constructionCostDeltaPercent: 20, // Default requested: +20%
    delayMonths: 12, // Default requested: 18 ay yerine 30 ay = +12 ay
  });

  // Calculate Stressed Result Live
  const stressResult = useMemo(() => {
    return calculateStressTest(result, assumptions, stress);
  }, [result, assumptions, stress]);

  const resetStress = () => {
    setStress({
      salesPriceDeltaPercent: 0,
      constructionCostDeltaPercent: 0,
      delayMonths: 0,
    });
  };

  const applyPresetStress = (sales: number, cost: number, delay: number) => {
    setStress({
      salesPriceDeltaPercent: sales,
      constructionCostDeltaPercent: cost,
      delayMonths: delay,
    });
  };

  const isStressActive =
    stress.salesPriceDeltaPercent !== 0 ||
    stress.constructionCostDeltaPercent !== 0 ||
    stress.delayMonths !== 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                ARSA KARAR MOTORU & STRES TESTİ
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  result.suitabilityScore === 'Çok Uygun'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : result.suitabilityScore === 'Uygun'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : result.suitabilityScore === 'Dengeli'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {result.suitabilityScore}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Yatırım uygunluğu, başabaş güvenlik marjı ve zorlu piyasa koşullarına karşı dayanıklılık simülasyonu
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Analiz Edilen Senaryo: <strong className="text-slate-900">{scenario.name}</strong>
        </div>
      </div>

      {/* PART 1: 🟢 PROJE UYGUNLUĞU VE KARAR GÖSTERGELERİ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🟢</span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Proje Uygunluğu & Temel Yatırım Göstergeleri
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Güvenlik Marjı: %{result.breakEvenSafetyMargin.toFixed(1)}
          </span>
        </div>

        {/* 6 Essential Metrics Grid requested by user */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Metric 1: Toplam Yatırım */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Toplam Yatırım</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatCurrencyTL(result.totalProjectCost, true)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Arsa + İnşaat + Gider</div>
          </div>

          {/* Metric 2: Tahmini Gelir */}
          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/70">
            <div className="text-[11px] font-medium text-blue-800">Tahmini Gelir</div>
            <div className="text-sm font-extrabold text-blue-950 mt-1">
              {formatCurrencyTL(result.totalGrossRevenue, true)}
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">
              {result.totalUnitCount} Adet Bağımsız Bölüm
            </div>
          </div>

          {/* Metric 3: Tahmini Kâr */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-medium text-emerald-800">Tahmini Kâr</div>
            <div className="text-sm font-extrabold text-emerald-950 mt-1">
              {formatCurrencyTL(result.grossProfit, true)}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              Kâr Marjı: %{result.profitMarginOnRevenue.toFixed(1)}
            </div>
          </div>

          {/* Metric 4: Başabaş Satış Fiyatı */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Başabaş Satış Fiyatı</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatNumber(Math.round(result.breakEvenPricePerM2))} TL/m²
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Fark: +%{result.breakEvenSafetyMargin.toFixed(1)} Güvenli
            </div>
          </div>

          {/* Metric 5: Arsa Maliyetinin Payı */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Arsa Payı (Oranı)</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              %{result.landCostSharePercent.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {formatCurrencyTL(result.landCost, true)}
            </div>
          </div>

          {/* Metric 6: İnşaat Maliyetinin Payı */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">İnşaat Payı (Oranı)</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              %{result.constructionCostSharePercent.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {formatCurrencyTL(result.directConstructionCost, true)}
            </div>
          </div>
        </div>

        {/* Karar Değerlendirme Raporu Notu */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Arsa Karar Değerlendirmesi: {result.suitabilityScore}
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {result.suitabilityAssessment}
            </p>
          </div>
        </div>
      </div>

      {/* PART 2: ⚠️ RİSK VE STRES TESTİ SİMÜLATÖRÜ */}
      <div className="pt-3 border-t border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Risk ve Stres Testi Simülatörü (Dinamik Senaryo)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {isStressActive && (
              <button
                type="button"
                onClick={resetStress}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Normal Duruma Dön
              </button>
            )}
            <button
              type="button"
              onClick={() => applyPresetStress(-15, 20, 12)}
              className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
            >
              Kullanıcı Stres Paketi (%-15 Satış / %+20 Maliyet / +12 Ay)
            </button>
          </div>
        </div>

        {/* 3 Stress Test Question Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stres Soru 1: Satış Fiyatı Düşüşü */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                Satış Fiyatı Değişimi
              </span>
              <span
                className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                  stress.salesPriceDeltaPercent < 0
                    ? 'bg-rose-100 text-rose-800'
                    : stress.salesPriceDeltaPercent > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {stress.salesPriceDeltaPercent > 0 ? '+' : ''}
                {stress.salesPriceDeltaPercent}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              "Projenin satış fiyatı %{Math.abs(stress.salesPriceDeltaPercent)} {stress.salesPriceDeltaPercent < 0 ? 'düşerse' : 'artarsa'} sonuç ne olur?"
            </p>

            <input
              type="range"
              min={-30}
              max={15}
              step={1}
              value={stress.salesPriceDeltaPercent}
              onChange={(e) =>
                setStress({ ...stress, salesPriceDeltaPercent: Number(e.target.value) })
              }
              className="w-full accent-rose-600"
            />

            {/* Quick Pills */}
            <div className="flex justify-between gap-1 pt-1">
              {[0, -10, -15, -20, -25].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStress({ ...stress, salesPriceDeltaPercent: val })}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                    stress.salesPriceDeltaPercent === val
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {val === 0 ? 'Normal' : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Stres Soru 2: İnşaat Maliyeti Artışı */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                İnşaat Maliyeti Artışı
              </span>
              <span
                className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                  stress.constructionCostDeltaPercent > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                +{stress.constructionCostDeltaPercent}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              "İnşaat maliyeti demir, beton, işçilikle %{stress.constructionCostDeltaPercent} artarsa?"
            </p>

            <input
              type="range"
              min={0}
              max={50}
              step={2}
              value={stress.constructionCostDeltaPercent}
              onChange={(e) =>
                setStress({ ...stress, constructionCostDeltaPercent: Number(e.target.value) })
              }
              className="w-full accent-amber-600"
            />

            {/* Quick Pills */}
            <div className="flex justify-between gap-1 pt-1">
              {[0, 10, 20, 30, 40].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStress({ ...stress, constructionCostDeltaPercent: val })}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                    stress.constructionCostDeltaPercent === val
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {val === 0 ? '0%' : `+${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Stres Soru 3: Proje Süresi / Gecikme */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Süre Gecikmesi (+Ay)
              </span>
              <span
                className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                  stress.delayMonths > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                +{stress.delayMonths} Ay
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              "Proje 18 ay yerine {18 + stress.delayMonths} ayda tamamlanırsa (+
              {formatCurrencyTL(stressResult.delayExtraCost, true)} ek şantiye)?"
            </p>

            <input
              type="range"
              min={0}
              max={24}
              step={3}
              value={stress.delayMonths}
              onChange={(e) => setStress({ ...stress, delayMonths: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />

            {/* Quick Pills */}
            <div className="flex justify-between gap-1 pt-1">
              {[0, 6, 12, 18, 24].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStress({ ...stress, delayMonths: val })}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                    stress.delayMonths === val
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {val === 0 ? '0 Ay' : `+${val} Ay`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Stress Test Outcome Card */}
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-all ${
            !stressResult.isProfitable
              ? 'bg-rose-50 border-rose-300'
              : stressResult.riskBadge === 'Yüksek Risk'
              ? 'bg-amber-50/80 border-amber-300'
              : stressResult.riskBadge === 'Orta Risk'
              ? 'bg-blue-50/60 border-blue-200'
              : 'bg-emerald-50/60 border-emerald-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Stres Testi Sonuç Özeti
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  !stressResult.isProfitable
                    ? 'bg-rose-600 text-white'
                    : stressResult.riskBadge === 'Yüksek Risk'
                    ? 'bg-amber-600 text-white'
                    : stressResult.riskBadge === 'Orta Risk'
                    ? 'bg-blue-700 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {stressResult.riskBadge}
              </span>
            </div>

            <div className="text-xs font-medium text-slate-600">
              Uygulanan: Satış %{stress.salesPriceDeltaPercent} | Maliyet +%
              {stress.constructionCostDeltaPercent} | Gecikme +{stress.delayMonths} Ay
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
            {/* Box 1: Stresli Gelir */}
            <div className="bg-white/80 p-3 rounded-lg border border-black/5">
              <div className="text-[11px] text-slate-500 font-medium">Stres Testi Geliri</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {formatCurrencyTL(stressResult.stressedRevenue, true)}
              </div>
              <div className="text-[10px] text-slate-400">
                Orijinal: {formatCurrencyTL(result.totalGrossRevenue, true)}
              </div>
            </div>

            {/* Box 2: Stresli Toplam Maliyet */}
            <div className="bg-white/80 p-3 rounded-lg border border-black/5">
              <div className="text-[11px] text-slate-500 font-medium">Stres Testi Maliyeti</div>
              <div className="text-sm font-extrabold text-rose-900 mt-0.5">
                {formatCurrencyTL(stressResult.stressedTotalCost, true)}
              </div>
              <div className="text-[10px] text-slate-400">
                İnşaat: {formatCurrencyTL(stressResult.stressedConstructionCost, true)}
              </div>
            </div>

            {/* Box 3: Stres Testi Kârı */}
            <div className="bg-white/80 p-3 rounded-lg border border-black/5">
              <div className="text-[11px] text-slate-500 font-medium">Stres Testi Kârı</div>
              <div
                className={`text-sm font-black mt-0.5 ${
                  stressResult.isProfitable ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatCurrencyTL(stressResult.stressedProfit, true)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                Yeni Marj: %{stressResult.stressedMarginPercent.toFixed(1)}
              </div>
            </div>

            {/* Box 4: Kâr Değişimi (Delta) */}
            <div className="bg-white/80 p-3 rounded-lg border border-black/5">
              <div className="text-[11px] text-slate-500 font-medium">Kârdaki Erime / Değişim</div>
              <div
                className={`text-sm font-extrabold mt-0.5 ${
                  stressResult.profitDeltaTL < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {stressResult.profitDeltaTL < 0 ? '− ' : '+ '}
                {formatCurrencyTL(Math.abs(stressResult.profitDeltaTL), true)}
              </div>
              <div className="text-[10px] text-slate-500">
                %{Math.abs(stressResult.profitDeltaPercent).toFixed(1)} erime
              </div>
            </div>
          </div>

          {/* Actionable Strategy Comment */}
          <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-black/5">
            <strong>Stres Değerlendirmesi:</strong> {stressResult.statusText}
          </div>
        </div>
      </div>
    </div>
  );
};
