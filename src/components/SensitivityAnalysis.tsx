import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Activity,
  Calendar,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import {
  FeasibilityResult,
  LandData,
  ProjectCostAssumptions,
  FeasibilityScenario,
} from '../types/feasibility';
import { calculateFeasibility } from '../utils/calculator';
import { formatCurrencyTL, formatPercent } from '../utils/formatters';

interface SensitivityAnalysisProps {
  land: LandData;
  assumptions: ProjectCostAssumptions;
  scenario: FeasibilityScenario;
  baseResult: FeasibilityResult;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
  land,
  assumptions,
  scenario,
  baseResult,
}) => {
  // Custom sensitivity parameters
  const [salesDeltaPct, setSalesDeltaPct] = useState<number>(-10);
  const [costDeltaPct, setCostDeltaPct] = useState<number>(15);
  const [landCostDeltaPct, setLandCostDeltaPct] = useState<number>(20);
  const [delayMonths, setDelayMonths] = useState<number>(6);

  // 1. Base Scenario
  const baseProfit = baseResult.grossProfit;
  const baseMargin = baseResult.profitMarginOnRevenue;

  // 2. Sales price drop (-10%)
  const salesDropScenario: FeasibilityScenario = {
    ...scenario,
    unitTypes: scenario.unitTypes.map((u) => ({
      ...u,
      unitSalesPricePerM2: u.unitSalesPricePerM2 * (1 + salesDeltaPct / 100),
    })),
  };
  const salesDropResult = calculateFeasibility(land, assumptions, salesDropScenario);

  // 3. Construction cost rise (+15%)
  const costRiseAssumptions: ProjectCostAssumptions = {
    ...assumptions,
    constructionCostPerM2: assumptions.constructionCostPerM2 * (1 + costDeltaPct / 100),
  };
  const costRiseResult = calculateFeasibility(land, costRiseAssumptions, scenario);

  // 4. Land price rise (+20%)
  const landRiseData: LandData = {
    ...land,
    landCashPrice: land.landCashPrice * (1 + landCostDeltaPct / 100),
    landOwnerSharePercent: Math.min(80, land.landOwnerSharePercent + 5),
  };
  const landRiseResult = calculateFeasibility(landRiseData, assumptions, scenario);

  // 5. Project delay (+6 months)
  const currentFinanceCost = assumptions.financeCostPercent || assumptions.financialCostPercent || 0;
  const currentUnforeseen = assumptions.unforeseenExpensesPercent || 0;
  const delayAssumptions: ProjectCostAssumptions = {
    ...assumptions,
    projectDurationMonths: (assumptions.projectDurationMonths || 24) + delayMonths,
    financeCostPercent: currentFinanceCost + (delayMonths * 0.4),
    financialCostPercent: currentFinanceCost + (delayMonths * 0.4),
    unforeseenExpensesPercent: currentUnforeseen + 1.5,
  };
  const delayResult = calculateFeasibility(land, delayAssumptions, scenario);

  // 6. Worst Case Scenario (Stress Test - all combined!)
  const worstCaseLand: LandData = {
    ...land,
    landCashPrice: land.landCashPrice * (1 + landCostDeltaPct / 100),
  };
  const worstCaseAssumptions: ProjectCostAssumptions = {
    ...assumptions,
    constructionCostPerM2: assumptions.constructionCostPerM2 * (1 + costDeltaPct / 100),
    projectDurationMonths: (assumptions.projectDurationMonths || 24) + delayMonths,
    financeCostPercent: currentFinanceCost + (delayMonths * 0.4),
    financialCostPercent: currentFinanceCost + (delayMonths * 0.4),
  };
  const worstCaseResult = calculateFeasibility(worstCaseLand, worstCaseAssumptions, salesDropScenario);

  const scenariosList = [
    {
      title: 'Temel Senaryo',
      subtitle: 'Mevcut piyasa ve maliyet kabulleri',
      profit: baseProfit,
      margin: baseMargin,
      tag: 'Referans',
      tagColor: 'bg-slate-100 text-slate-800',
      isBase: true,
    },
    {
      title: `Satış Fiyatı %${Math.abs(salesDeltaPct)} Düşerse`,
      subtitle: 'Talep daralması veya fiyat indirimi',
      profit: salesDropResult.grossProfit,
      margin: salesDropResult.profitMarginOnRevenue,
      tag: `${salesDeltaPct}% Satış`,
      tagColor: 'bg-amber-100 text-amber-800',
      isBase: false,
    },
    {
      title: `İnşaat Maliyeti %${costDeltaPct} Artarsa`,
      subtitle: 'Demir, beton veya işçilik enflasyonu',
      profit: costRiseResult.grossProfit,
      margin: costRiseResult.profitMarginOnRevenue,
      tag: `+${costDeltaPct}% Maliyet`,
      tagColor: 'bg-orange-100 text-orange-800',
      isBase: false,
    },
    {
      title: `Arsa Maliyeti %${landCostDeltaPct} Artarsa`,
      subtitle: 'Pazarlık payı veya tapu/harç artışı',
      profit: landRiseResult.grossProfit,
      margin: landRiseResult.profitMarginOnRevenue,
      tag: `+${landCostDeltaPct}% Arsa`,
      tagColor: 'bg-blue-100 text-blue-800',
      isBase: false,
    },
    {
      title: `Proje ${delayMonths} Ay Gecikirse`,
      subtitle: 'Ruhsat gecikmesi & finansman yükü',
      profit: delayResult.grossProfit,
      margin: delayResult.profitMarginOnRevenue,
      tag: `+${delayMonths} Ay`,
      tagColor: 'bg-purple-100 text-purple-800',
      isBase: false,
    },
    {
      title: 'Kötü Senaryo (Stres Testi)',
      subtitle: 'Tüm olumsuzlukların aynı anda gerçekleşmesi',
      profit: worstCaseResult.grossProfit,
      margin: worstCaseResult.profitMarginOnRevenue,
      tag: 'Kritik Risk',
      tagColor: 'bg-rose-100 text-rose-800',
      isBase: false,
      isStressTest: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Hassasiyet Analizi &amp; Stres Testi
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Risk Değerlendirmesi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              &quot;Eğer piyasa kötüye giderse ne olur?&quot; — Projenin kriz koşullarına ve maliyet şoklarına dayanıklılığı
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Sliders for Custom Sensitivity */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 font-semibold">Satış Fiyatı Değişimi:</span>
            <span className={`font-bold ${salesDeltaPct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              %{salesDeltaPct}
            </span>
          </div>
          <input
            type="range"
            min={-30}
            max={20}
            step={5}
            value={salesDeltaPct}
            onChange={(e) => setSalesDeltaPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 font-semibold">İnşaat Maliyeti Artışı:</span>
            <span className="font-bold text-orange-600">+{costDeltaPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={5}
            value={costDeltaPct}
            onChange={(e) => setCostDeltaPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 font-semibold">Arsa Maliyet Artışı:</span>
            <span className="font-bold text-blue-600">+{landCostDeltaPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={landCostDeltaPct}
            onChange={(e) => setLandCostDeltaPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 font-semibold">Gecikme Süresi:</span>
            <span className="font-bold text-purple-600">+{delayMonths} Ay</span>
          </div>
          <input
            type="range"
            min={0}
            max={18}
            step={3}
            value={delayMonths}
            onChange={(e) => setDelayMonths(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>

      {/* Sensitivity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {scenariosList.map((item, idx) => {
          const isProfitable = item.profit > 0;
          const deltaFromBase = item.profit - baseProfit;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                item.isStressTest
                  ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                  : item.isBase
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.isBase ? 'bg-slate-800 text-slate-300' : item.tagColor
                  }`}>
                    {item.tag}
                  </span>
                  {!item.isBase && (
                    <span className={`text-[11px] font-bold ${
                      deltaFromBase >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {deltaFromBase >= 0 ? '+' : ''}
                      {formatCurrencyTL(deltaFromBase, true)}
                    </span>
                  )}
                </div>

                <h3 className={`text-xs font-bold leading-tight ${item.isBase ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-[11px] mt-0.5 ${item.isBase ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/30 flex items-end justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-semibold ${item.isBase ? 'text-slate-400' : 'text-slate-400'}`}>
                    Tahmini Net Kâr
                  </span>
                  <div className={`text-lg font-black leading-tight ${
                    !isProfitable
                      ? 'text-rose-600'
                      : item.isBase
                      ? 'text-emerald-400'
                      : item.isStressTest
                      ? 'text-rose-700'
                      : 'text-slate-900'
                  }`}>
                    {formatCurrencyTL(item.profit, true)}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] uppercase font-semibold ${item.isBase ? 'text-slate-400' : 'text-slate-400'}`}>
                    Kâr Marjı
                  </span>
                  <div className={`text-sm font-bold ${
                    item.margin < 10
                      ? 'text-rose-600'
                      : item.isBase
                      ? 'text-white'
                      : 'text-emerald-700'
                  }`}>
                    {formatPercent(item.margin)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resilience Summary Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {worstCaseResult.grossProfit > 0 ? (
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900">
              {worstCaseResult.grossProfit > 0
                ? 'Güçlü Risk Dayanıklılığı (Pozitif Kâr Güvencesi)'
                : 'Yüksek Risk Uyarısı (Zarar Tehlikesi)'}
            </div>
            <p className="text-[11px] text-slate-500">
              {worstCaseResult.grossProfit > 0
                ? `Proje en kötü senaryoda (Satış -%${Math.abs(salesDeltaPct)}, Maliyet +%${costDeltaPct}, Gecikme +${delayMonths} ay) dahi pozitif kâr (${formatCurrencyTL(worstCaseResult.grossProfit, true)}) üretmeye devam etmektedir.`
                : 'Kötü senaryoda kâr marjı sıfırın altına inmektedir. Arsa maliyeti veya inşaat m² maliyeti yeniden müzakere edilmelidir.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-[11px] font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Stres Marjı: %{worstCaseResult.profitMarginOnRevenue.toFixed(1)}
        </div>
      </div>
    </div>
  );
};
