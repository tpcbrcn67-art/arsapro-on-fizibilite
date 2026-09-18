import React from 'react';
import { Calculator, ArrowRight, TrendingUp, DollarSign, Building2, PieChart } from 'lucide-react';
import { FeasibilityResult, FeasibilityScenario, LandData } from '../types/feasibility';
import { formatCurrencyTL, formatArea, formatNumber } from '../utils/formatters';

interface ProfitAuditTrailCardProps {
  result: FeasibilityResult;
  scenario: FeasibilityScenario;
  land: LandData;
}

export const ProfitAuditTrailCard: React.FC<ProfitAuditTrailCardProps> = ({
  result,
  scenario,
  land,
}) => {
  const audit = result.auditTrail;
  const isCash = land.acquisitionType === 'cash';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Kâr Ayrıştırma ve Hesaplama Cetveli (Audit Trail)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {scenario.shortCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kârın nasıl oluştuğunun adım adım şeffaf denetim tablosu: [Gelir − Gider = Tahmini Net Kâr]
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Kâr Marjı</span>
          <span className="text-sm font-extrabold text-emerald-600">
            %{result.profitMarginOnRevenue.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Step-by-Step 3 Column Layout matching user explicit specification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STEP 1: GELİR (REVENUE) */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="text-xs font-bold text-blue-900 tracking-wider">1. GELİR</span>
                <span className="text-[11px] font-semibold text-blue-700">Satış Hasılatı</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Bağımsız Bölüm:</span>
                  <strong className="text-slate-900">{audit.unitCount} Daire</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Satılabilir Brüt Alan:</span>
                  <strong className="text-slate-900">{formatArea(audit.salableGrossAreaM2)}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Ortalama Satış Fiyatı:</span>
                  <strong className="text-blue-700">
                    {formatNumber(Math.round(audit.avgSalesPricePerM2))} TL / m²
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100">
              <div className="text-[10px] uppercase font-bold text-blue-600">Toplam Tahmini Ciro</div>
              <div className="text-lg font-black text-blue-950 mt-0.5">
                {formatCurrencyTL(audit.totalRevenue, true)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {formatCurrencyTL(audit.totalRevenue)}
              </div>
            </div>
          </div>

          {/* STEP 2: GİDER (EXPENSES) */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-xs font-bold text-rose-900 tracking-wider">2. GİDER</span>
                <span className="text-[11px] font-semibold text-rose-700">Toplam Proje Maliyeti</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Arsa Bedeli ({isCash ? 'Nakit' : 'Paylaşım'}):</span>
                  <strong className="text-slate-900">
                    {formatCurrencyTL(audit.landCost, true)}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Toplam İnşaat ({formatArea(audit.constructionM2)}):</span>
                  <strong className="text-rose-700">
                    {formatNumber(audit.constructionUnitCost)} TL/m²
                  </strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Direkt İnşaat Toplamı:</span>
                  <strong className="text-slate-900">
                    {formatCurrencyTL(audit.directConstructionCost, true)}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Ruhsat, Satış & Diğer Gider:</span>
                  <strong className="text-slate-900">
                    {formatCurrencyTL(audit.projectExpenses, true)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-100">
              <div className="text-[10px] uppercase font-bold text-rose-600">Toplam Yatırım & Maliyet</div>
              <div className="text-lg font-black text-rose-950 mt-0.5">
                {formatCurrencyTL(audit.totalCost, true)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {formatCurrencyTL(audit.totalCost)}
              </div>
            </div>
          </div>

          {/* STEP 3: TAHMİNİ SONUÇ (NET PROFIT) */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="text-xs font-bold text-emerald-900 tracking-wider">3. TAHMİNİ SONUÇ</span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Gelir − Gider = Kâr
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2 rounded bg-white/80 border border-emerald-100 text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ciro:</span>
                    <span>{formatCurrencyTL(audit.totalRevenue, true)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Maliyet:</span>
                    <span>− {formatCurrencyTL(audit.totalCost, true)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-slate-700 pt-1">
                  <span className="text-slate-500">Maliyet Kârlılığı (ROI):</span>
                  <strong className="text-emerald-700">%{result.roiOnCost.toFixed(1)}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Daire Başına Net Kâr:</span>
                  <strong className="text-slate-900">{formatCurrencyTL(result.profitPerUnit, true)}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 bg-emerald-100/40 -mx-4 -mb-4 p-4 rounded-b-xl">
              <div className="text-[10px] uppercase font-extrabold text-emerald-800">
                Tahmini Net Proje Kârı
              </div>
              <div className="text-xl font-black text-emerald-950 mt-0.5">
                {formatCurrencyTL(audit.netProfit, true)}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                Net Kâr Marjı: %{audit.marginPercent.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Break-even & Cost Share Footnote */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Başabaş Satış Fiyatı (Break-even)</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {formatNumber(Math.round(result.breakEvenPricePerM2))} TL / m²
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              Güvenlik Marjı: +%{result.breakEvenSafetyMargin.toFixed(1)}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Arsa Maliyetinin Projedeki Payı</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              %{result.landCostSharePercent.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {formatCurrencyTL(result.landCost, true)} / {formatCurrencyTL(result.totalProjectCost, true)}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">İnşaat Maliyetinin Projedeki Payı</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              %{result.constructionCostSharePercent.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {formatCurrencyTL(result.directConstructionCost, true)} direkt inşaat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
