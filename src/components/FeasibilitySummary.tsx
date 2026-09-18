import React from 'react';
import {
  Building2,
  TrendingUp,
  Coins,
  Layers,
  Home,
  PieChart,
  CheckCircle2,
  Info,
  Sliders,
} from 'lucide-react';
import {
  FeasibilityResult,
  FeasibilityScenario,
  LandData,
  ProjectCostAssumptions,
} from '../types/feasibility';
import {
  formatCurrencyTL,
  formatArea,
  formatNumber,
  formatPercent,
} from '../utils/formatters';
import { ZoningAreaTransparencyCard } from './ZoningAreaTransparencyCard';
import { ProfitAuditTrailCard } from './ProfitAuditTrailCard';

interface FeasibilitySummaryProps {
  result: FeasibilityResult;
  scenario: FeasibilityScenario;
  land: LandData;
  assumptions: ProjectCostAssumptions;
  onUpdateAssumptions?: (updated: ProjectCostAssumptions) => void;
  onEditScenario?: () => void;
  onOpenReport?: () => void;
  onSaveProject?: () => void;
  onShareProject?: () => void;
}

export const FeasibilitySummary: React.FC<FeasibilitySummaryProps> = ({
  result,
  scenario,
  land,
  assumptions,
  onUpdateAssumptions,
  onEditScenario,
  onOpenReport,
  onSaveProject,
  onShareProject,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header with Title and Active Scenario */}
      <div className="bg-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROJE ÖN FİZİBİLİTESİ
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {land.projectName || 'Arsa Değerlendirme'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white tracking-tight">
              {scenario.shortCode}: {scenario.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {scenario.description}
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shrink-0">
            <div className="text-xs text-slate-400">Öngörülen Net Proje Kârı</div>
            <div className={`text-xl sm:text-2xl font-extrabold ${result.grossProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrencyTL(result.grossProfit, true)}
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5 justify-start sm:justify-end">
              <span className="text-slate-300">Kâr Marjı: </span>
              <span className="font-semibold text-emerald-300">
                {formatPercent(result.profitMarginOnRevenue)}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">ROI: </span>
              <span className="font-semibold text-emerald-300">
                {formatPercent(result.roiOnCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* İmar & Yapılaşma Esasları Barı (Exact match with user prompt: Arsa, Emsal, Emsale Esas Alan) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <div className="text-xs text-slate-500 font-medium">Arsa Alanı</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatArea(result.rawLandAreaM2)}
            </div>
            <div className="text-[11px] text-slate-500">
              {land.publicCessionPercent > 0 ? `Net: ${formatArea(result.netLandAreaM2)}` : 'Tam parsel'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Emsal (KAKS)</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {land.kaks.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500">
              TAKS: %{Math.round(land.taks * 100)} (Taban {formatArea(result.maxFootprintAreaM2)})
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Emsale Esas İnşaat Alanı</div>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              {formatArea(result.farAllowedAreaM2)}
            </div>
            <div className="text-[11px] text-slate-500">
              Satılabilir Brüt: {formatArea(result.totalSalableGrossAreaM2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Toplam Brüt İnşaat Alanı</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatArea(result.totalConstructionAreaM2)}
            </div>
            <div className="text-[11px] text-slate-500">
              +{formatArea(result.nonFarAreaM2)} bodrum & otopark
            </div>
          </div>
        </div>

        {/* 40.000 m² Neden 52.000 m² Oldu? Şeffaf İmar & Alan Analizi */}
        <ZoningAreaTransparencyCard
          result={result}
          land={land}
          assumptions={assumptions}
          onUpdateAssumptions={onUpdateAssumptions}
        />

        {/* Kat & Kitle İmar Durumu Notu */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold text-blue-950">Mimari Kitle ve Gabari Kontrolü: </span>
            {result.heightZoningNote}
          </div>
        </div>

        {/* TAHMİNİ PROJE: BAĞIMSIZ BÖLÜM DAĞILIMI (User prompt: 350 adet 1+1, 100 adet 2+1, 50 adet 3+1 -> Toplam 500) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tahmini Bağımsız Bölüm Dağılımı ({result.totalUnitCount} Adet)
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Ortalama Daire: {formatNumber(result.averageUnitGrossM2, 0)} m² Brüt ({formatNumber(result.averageUnitNetM2, 0)} m² Net)
            </span>
          </div>

          {/* Unit Proportion Progress Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden mb-4 shadow-inner">
            {result.units.map((unit) => {
              const pct = (unit.totalGrossM2 / (result.totalSalableGrossAreaM2 || 1)) * 100;
              return (
                <div
                  key={unit.unitTypeId}
                  style={{ width: `${pct}%`, backgroundColor: unit.color }}
                  title={`${unit.name}: ${unit.count} Adet (%${pct.toFixed(1)})`}
                  className="h-full transition-all duration-300"
                />
              );
            })}
          </div>

          {/* Unit Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.units.map((unit) => {
              return (
                <div
                  key={unit.unitTypeId}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: unit.color }}
                      />
                      <span className="text-xs font-bold text-slate-900">{unit.name}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 px-2 py-0.5 bg-white rounded-md border border-slate-200">
                      {unit.count} Adet
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ort. Net / Brüt:</span>
                      <span className="font-medium text-slate-800">
                        {formatNumber(unit.averageNetM2)} m² / {formatNumber(unit.averageGrossM2)} m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Birim Satış (m²):</span>
                      <span className="font-medium text-slate-800">
                        {formatCurrencyTL(unit.salesPricePerM2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Birim Daire Fiyatı:</span>
                      <span className="font-semibold text-slate-900">
                        ~{formatCurrencyTL(unit.estimatedUnitSalesPrice, true)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-slate-200 font-semibold text-slate-900">
                      <span>Grup Ciro:</span>
                      <span className="text-emerald-700">{formatCurrencyTL(unit.totalRevenue, true)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs px-2 text-slate-500">
            <span>Toplam Bağımsız Bölüm: <strong className="text-slate-900">{result.totalUnitCount} Adet</strong></span>
            <span>Toplam Satılabilir Alan: <strong className="text-slate-900">{formatArea(result.totalSalableGrossAreaM2)}</strong></span>
          </div>
        </div>

        {/* Kâr Ayrıştırma ve Hesaplama Cetveli (Audit Trail) */}
        <ProfitAuditTrailCard
          result={result}
          scenario={scenario}
          land={land}
        />

        {/* FİNANSAL TABLO (Exact user prompt breakdown: Satış geliri, İnşaat maliyeti, Arsa maliyeti, Diğer giderler, Proje kârı) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Finansal Ön Fizibilite Tablosu
            </h3>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Gelir ve Maliyet Kalemi</th>
                  <th className="py-2.5 px-3 sm:px-4">Hesaplama Dayanağı / Birim</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Tutar (TL)</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Ciro Payı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Satış Geliri */}
                <tr className="bg-emerald-50/40 font-semibold text-emerald-950">
                  <td className="py-3 px-3 sm:px-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Tahmini Satış Geliri (Toplam Ciro)</span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600 font-normal">
                    {result.totalUnitCount} bağımsız bölüm satışı
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-bold text-emerald-700 text-sm">
                    {formatCurrencyTL(result.totalGrossRevenue)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-semibold text-emerald-700">
                    %100
                  </td>
                </tr>

                {/* Arsa Maliyeti */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className="font-medium text-slate-900">Arsa Maliyeti</span>
                    <div className="text-[11px] text-slate-500">
                      {land.acquisitionType === 'cash'
                        ? 'Nakit arsa satın alma bedeli'
                        : land.acquisitionType === 'flat_for_land'
                        ? `Kat Karşılığı: Arsa sahibine %${land.landOwnerSharePercent} pay`
                        : `Hasılat Paylaşımı: Cironun %${land.revenueSharePercent}'i`}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500">
                    {land.acquisitionType === 'cash'
                      ? `${formatArea(land.landAreaM2)} için peşin bedel`
                      : 'Arsa sahibine devredilen pay'}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-semibold text-slate-900">
                    {formatCurrencyTL(result.landCost)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-500">
                    {formatPercent((result.landCost / (result.totalGrossRevenue || 1)) * 100)}
                  </td>
                </tr>

                {/* İnşaat Maliyeti */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className="font-medium text-slate-900">Tahmini İnşaat Maliyeti</span>
                    <div className="text-[11px] text-slate-500">
                      Kaba, ince, mekanik, elektrik, peyzaj ve altyapı
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500">
                    {formatArea(result.totalConstructionAreaM2)} × {formatCurrencyTL(scenario.constructionCostPerM2)}/m²
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-semibold text-slate-900">
                    {formatCurrencyTL(result.directConstructionCost)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-500">
                    {formatPercent((result.directConstructionCost / (result.totalGrossRevenue || 1)) * 100)}
                  </td>
                </tr>

                {/* Diğer Giderler */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className="font-medium text-slate-900">Diğer Proje Giderleri</span>
                    <div className="text-[11px] text-slate-500">
                      Ruhsat harçları, mimari-statik projeler, pazarlama ve yönetim
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500">
                    Ruhsat: {formatCurrencyTL(result.permitAndProjectCost, true)} | Pzr: {formatCurrencyTL(result.marketingCost, true)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-semibold text-slate-900">
                    {formatCurrencyTL(result.otherExpensesTotal)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-500">
                    {formatPercent((result.otherExpensesTotal / (result.totalGrossRevenue || 1)) * 100)}
                  </td>
                </tr>

                {/* Toplam Maliyet */}
                <tr className="bg-slate-50 font-semibold text-slate-900">
                  <td className="py-2.5 px-3 sm:px-4">Toplam Proje Maliyeti</td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 font-normal">Arsa + İnşaat + Giderler</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold">
                    {formatCurrencyTL(result.totalProjectCost)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-600">
                    {formatPercent((result.totalProjectCost / (result.totalGrossRevenue || 1)) * 100)}
                  </td>
                </tr>

                {/* TAHMİNİ PROJE KÂRI */}
                <tr className="bg-emerald-100/50 font-bold text-slate-950 text-sm">
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                      <TrendingUp className="w-4 h-4 text-emerald-700" />
                      <span>Tahmini Proje Kârı</span>
                    </div>
                    <div className="text-[11px] font-normal text-emerald-800">
                      {land.acquisitionType === 'cash' ? 'Ciro - Toplam Maliyet' : 'Müteahhit Payı - İnşaat Maliyeti'}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-xs font-medium text-emerald-900">
                    ROI: {formatPercent(result.roiOnCost)} | Satılabilir m² Başı Kâr: {formatCurrencyTL(result.profitPerSalableM2)}/m²
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-black text-emerald-800 text-base">
                    {formatCurrencyTL(result.grossProfit)}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-black text-emerald-800">
                    {formatPercent(result.profitMarginOnRevenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Likidite ve Satış Hızı Öngörüsü */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Satış Hızı & Likidite Değerlendirmesi:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold ${
                result.liquidityScore === 'Yüksek'
                  ? 'bg-emerald-100 text-emerald-800'
                  : result.liquidityScore === 'Dengeli'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {result.liquidityScore} Likidite
              </span>
            </div>
            <p className="text-slate-600 mt-1">{result.liquidityReason}</p>
          </div>
          <div className="shrink-0 text-slate-500 font-medium">
            Ortalama Daire Başına Kâr: <strong className="text-slate-900">{formatCurrencyTL(result.profitPerUnit, true)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
