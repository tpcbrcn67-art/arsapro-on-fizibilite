import React, { useState } from 'react';
import { Printer, Copy, Check, X, Building2, AlertTriangle, Download } from 'lucide-react';
import {
  FeasibilityResult,
  FeasibilityScenario,
  LandData,
  ProjectCostAssumptions,
} from '../types/feasibility';
import { calculateFeasibility } from '../utils/calculator';
import {
  formatCurrencyTL,
  formatArea,
  formatNumber,
  formatPercent,
} from '../utils/formatters';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  land: LandData;
  assumptions: ProjectCostAssumptions;
  activeScenario: FeasibilityScenario;
  allScenarios: FeasibilityScenario[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  land,
  assumptions,
  activeScenario,
  allScenarios,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeResult = calculateFeasibility(land, assumptions, activeScenario);
  const comparisonResults = allScenarios.map((s) => ({
    scenario: s,
    result: calculateFeasibility(land, assumptions, s),
  }));

  const handleCopyText = () => {
    const text = `
=== ARSA VE PROJE ÖN FİZİBİLİTE RAPORU ===
Proje: ${land.projectName} (${land.location})
Tarih: ${new Date().toLocaleDateString('tr-TR')}

[1] ARSA VE İMAR PARAMETRELERİ
- Arsa Alanı: ${formatArea(activeResult.rawLandAreaM2)} (Terk: %${land.publicCessionPercent})
- Emsal (KAKS): ${land.kaks.toFixed(2)}
- TAKS (Taban Oturumu): %${Math.round(land.taks * 100)} (${formatArea(activeResult.maxFootprintAreaM2)})
- Kat Sınırı: ${land.maxFloors} Kat
- Emsale Esas İnşaat Alanı: ${formatArea(activeResult.farAllowedAreaM2)}
- Toplam Brüt İnşaat Alanı (Otopark & Bodrum Dahil): ${formatArea(activeResult.totalConstructionAreaM2)}
- Arsa Modeli: ${land.acquisitionType === 'cash' ? `Nakit Alım (${formatCurrencyTL(land.landCashPrice)})` : `Kat Karşılığı (%${land.landOwnerSharePercent} Arsa Payı)`}

[2] SEÇİLEN SENARYO: ${activeScenario.shortCode} - ${activeScenario.name}
- Toplam Bağımsız Bölüm: ${activeResult.totalUnitCount} Adet
- Ortalama Daire: ${formatNumber(activeResult.averageUnitGrossM2, 0)} m² Brüt
- Ünite Dağılımı:
${activeResult.units.map((u) => `  * ${u.name}: ${u.count} Adet (Ort. ${formatNumber(u.averageGrossM2)} m², Satış: ${formatCurrencyTL(u.salesPricePerM2)}/m²)`).join('\n')}

[3] FİNANSAL TABLO
- Tahmini Satış Geliri (Ciro): ${formatCurrencyTL(activeResult.totalGrossRevenue)}
- Arsa Maliyeti: ${formatCurrencyTL(activeResult.landCost)}
- Tahmini İnşaat Maliyeti: ${formatCurrencyTL(activeResult.directConstructionCost)} (${formatCurrencyTL(activeScenario.constructionCostPerM2)}/m²)
- Diğer Proje Giderleri (Ruhsat, Pazarlama, Yönetim): ${formatCurrencyTL(activeResult.otherExpensesTotal)}
- Toplam Proje Maliyeti: ${formatCurrencyTL(activeResult.totalProjectCost)}
- TAHMİNİ PROJE KÂRI: ${formatCurrencyTL(activeResult.grossProfit)} (Kâr Marjı: ${formatPercent(activeResult.profitMarginOnRevenue)}, ROI: ${formatPercent(activeResult.roiOnCost)})

[4] SENARYO KARŞILAŞTIRMASI
${comparisonResults.map(({ scenario, result }) => `${scenario.shortCode} (${result.totalUnitCount} Daire, Ort. ${formatNumber(result.averageUnitGrossM2, 0)} m²): Ciro: ${formatCurrencyTL(result.totalGrossRevenue, true)} | Maliyet: ${formatCurrencyTL(result.totalProjectCost, true)} | Kâr: ${formatCurrencyTL(result.grossProfit, true)} (%${formatNumber(result.profitMarginOnRevenue, 1)})`).join('\n')}

*** YASAL VE TEKNİK UYARI ***
Bu çalışma ön fizibilite niteliğindedir. Resmî imar durumu veya mimari proje yerine geçmez. Kesin yapılaşma şartları; ilgili belediyenin imar plan notları, terkler, çekme mesafeleri, otopark ve yangın yönetmeliklerine göre hazırlanacak mimari avan proje ile netleşir.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              Yönetici Özeti: Ön Fizibilite Raporu
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Resmî Olmayan Ön Değerlendirme Raporu
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {land.projectName || 'Arsa Geliştirme Projesi'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{land.location}</p>
            </div>
            <div className="text-xs text-slate-500 text-left sm:text-right">
              <div>Rapor Tarihi: <strong>{new Date().toLocaleDateString('tr-TR')}</strong></div>
              <div>Analiz Türü: <strong>Ön İmar & Kârlılık Senaryolaması</strong></div>
            </div>
          </div>

          {/* Legal Warning Header */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Önemli Uyarı:</strong> Bu çalışma ön fizibilite niteliğindedir. Resmî imar durumu veya mimari proje yerine geçmez. Kesin yapılaşma hakları ilgili belediyenin imar plan notları, terkler, otopark ve zemin etüdü neticesinde hazırlanacak mimari avan proje ile netleşir.
            </div>
          </div>

          {/* 1. Arsa İmar Verileri */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 border-b pb-1">
              1. Arsa ve İmar Parametreleri
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Arsa Alanı</span>
                <span className="font-bold text-slate-900 text-sm">{formatArea(activeResult.rawLandAreaM2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Emsal (KAKS)</span>
                <span className="font-bold text-slate-900 text-sm">{land.kaks.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">TAKS & Taban Alanı</span>
                <span className="font-bold text-slate-900 text-sm">%{Math.round(land.taks * 100)} ({formatArea(activeResult.maxFootprintAreaM2)})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Kat Sınırı / Gabari</span>
                <span className="font-bold text-slate-900 text-sm">{land.maxFloors} Kat</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50">
                <span className="text-emerald-800 block">Emsale Esas Alan</span>
                <span className="font-bold text-emerald-900 text-sm">{formatArea(activeResult.farAllowedAreaM2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Toplam Brüt İnşaat</span>
                <span className="font-bold text-slate-900 text-sm">{formatArea(activeResult.totalConstructionAreaM2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Arsa Edinme Modeli</span>
                <span className="font-bold text-slate-900 text-sm">
                  {land.acquisitionType === 'cash' ? formatCurrencyTL(land.landCashPrice, true) : `%${land.landOwnerSharePercent} Kat Karşılığı`}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Seçilen Senaryo Ünite Kırılımı */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 border-b pb-1">
              2. Proje Yapılaşma ve Bağımsız Bölüm Dağılımı ({activeScenario.shortCode})
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Tip</th>
                    <th className="p-2.5 text-center">Adet</th>
                    <th className="p-2.5 text-center">Ort. Net/Brüt m²</th>
                    <th className="p-2.5 text-right">Birim Satış (m²)</th>
                    <th className="p-2.5 text-right">Tahmini Ünite Satış</th>
                    <th className="p-2.5 text-right">Toplam Grup Geliri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeResult.units.map((u) => (
                    <tr key={u.unitTypeId}>
                      <td className="p-2.5 font-bold text-slate-900">{u.name}</td>
                      <td className="p-2.5 text-center font-extrabold">{u.count} Adet</td>
                      <td className="p-2.5 text-center">{formatNumber(u.averageNetM2)} / {formatNumber(u.averageGrossM2)} m²</td>
                      <td className="p-2.5 text-right">{formatCurrencyTL(u.salesPricePerM2)}</td>
                      <td className="p-2.5 text-right font-medium">{formatCurrencyTL(u.estimatedUnitSalesPrice, true)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrencyTL(u.totalRevenue, true)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2.5">TOPLAM</td>
                    <td className="p-2.5 text-center text-emerald-800 text-sm">{activeResult.totalUnitCount} Adet</td>
                    <td className="p-2.5 text-center">Ort: {formatNumber(activeResult.averageUnitGrossM2, 0)} m² Brüt</td>
                    <td className="p-2.5 text-right">-</td>
                    <td className="p-2.5 text-right">-</td>
                    <td className="p-2.5 text-right text-emerald-800 text-sm">{formatCurrencyTL(activeResult.totalGrossRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Finansal Özet */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 border-b pb-1">
              3. Finansal Bütçe ve Kârlılık Özeti
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 block">Tahmini Ciro</span>
                <span className="font-extrabold text-emerald-900 text-base">{formatCurrencyTL(activeResult.totalGrossRevenue, true)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">İnşaat Maliyeti</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrencyTL(activeResult.directConstructionCost, true)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Toplam Maliyet</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrencyTL(activeResult.totalProjectCost, true)}</span>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg border border-emerald-300">
                <span className="text-emerald-900 block font-bold">Tahmini Kâr</span>
                <span className="font-black text-emerald-800 text-base">{formatCurrencyTL(activeResult.grossProfit, true)}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block">Marj: {formatPercent(activeResult.profitMarginOnRevenue)}</span>
              </div>
            </div>
          </div>

          {/* 4. Senaryo Karşılaştırma Matrisi */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 border-b pb-1">
              4. Senaryo Karşılaştırma Özeti (Bu Arsaya Ne Yapılabilir?)
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Senaryo</th>
                    <th className="p-2.5 text-center">Daire Adedi</th>
                    <th className="p-2.5 text-center">Ort. m²</th>
                    <th className="p-2.5 text-right">Tahmini Ciro</th>
                    <th className="p-2.5 text-right">Toplam Maliyet</th>
                    <th className="p-2.5 text-right">Tahmini Kâr</th>
                    <th className="p-2.5 text-right">Marj (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonResults.map(({ scenario, result }) => (
                    <tr key={scenario.id} className={scenario.id === activeScenario.id ? 'bg-indigo-50/50 font-bold' : ''}>
                      <td className="p-2.5">
                        <div className="font-bold">{scenario.shortCode}: {scenario.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{scenario.badge}</div>
                      </td>
                      <td className="p-2.5 text-center font-bold">{result.totalUnitCount}</td>
                      <td className="p-2.5 text-center">{formatNumber(result.averageUnitGrossM2, 0)} m²</td>
                      <td className="p-2.5 text-right">{formatCurrencyTL(result.totalGrossRevenue, true)}</td>
                      <td className="p-2.5 text-right">{formatCurrencyTL(result.totalProjectCost, true)}</td>
                      <td className="p-2.5 text-right text-emerald-700 font-extrabold">{formatCurrencyTL(result.grossProfit, true)}</td>
                      <td className="p-2.5 text-right text-emerald-700">{formatPercent(result.profitMarginOnRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
