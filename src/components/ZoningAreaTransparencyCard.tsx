import React, { useState } from 'react';
import { Layers, HelpCircle, ChevronDown, ChevronUp, Info, Check, ShieldCheck } from 'lucide-react';
import { FeasibilityResult, LandData, ProjectCostAssumptions } from '../types/feasibility';
import { formatArea, formatPercent } from '../utils/formatters';

interface ZoningAreaTransparencyCardProps {
  result: FeasibilityResult;
  land: LandData;
  assumptions: ProjectCostAssumptions;
  onUpdateAssumptions?: (updated: ProjectCostAssumptions) => void;
}

export const ZoningAreaTransparencyCard: React.FC<ZoningAreaTransparencyCardProps> = ({
  result,
  land,
  assumptions,
  onUpdateAssumptions,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingRatios, setIsEditingRatios] = useState(false);

  const nonFar = result.nonFarBreakdown;

  const handleRatioChange = (
    field: 'parkingRatio' | 'shelterAndTechnicalRatio' | 'circulationAndShaftsRatio',
    val: number
  ) => {
    if (!onUpdateAssumptions) return;
    const updated = {
      ...assumptions,
      [field]: val,
    };
    // update total nonFarAreaRatio automatically
    updated.nonFarAreaRatio =
      (updated.parkingRatio || 0) +
      (updated.shelterAndTechnicalRatio || 0) +
      (updated.circulationAndShaftsRatio || 0);
    onUpdateAssumptions(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Şeffaf İmar & Alan Dağılımı Analizi
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                40.000 m² → 52.000 m² Dönüşümü
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Emsale esas alandan toplam inşaat alanına geçişteki %30 ortak alan ve bodrum varsayımının şeffaf gerekçeleri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
            Emsal Dışı: +%{assumptions.nonFarAreaRatio} ({formatArea(result.nonFarAreaM2)})
          </span>
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Detayları aç / kapat"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5 bg-slate-50/40">
          {/* Main Visual Conversion Equation */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                "40.000 m² Emsal Neden 52.000 m² Toplam İnşaata Dönüşür?"
              </span>
              <span className="text-[11px] text-slate-400">
                Planlı Alanlar İmar Yönetmeliği Esaslı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Box 1: Emsale Esas Alan */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="text-[11px] font-medium text-slate-500">1. Emsale Esas İnşaat Alanı</div>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {formatArea(result.farAllowedAreaM2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {formatArea(result.netLandAreaM2)} Arsa × {land.kaks.toFixed(2)} Emsal
                </div>
                <div className="mt-2 text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                  Satılabilir Konut / Ticari Alan Bazı
                </div>
              </div>

              {/* Plus Sign / Box 2: Emsal Dışı Alanlar */}
              <div className="bg-amber-50/80 rounded-lg p-3 border border-amber-200/80 relative">
                <div className="text-[11px] font-medium text-amber-900 flex items-center justify-between">
                  <span>2. Tahmini Emsal Dışı Alan</span>
                  <span className="font-bold text-amber-800">+{assumptions.nonFarAreaRatio}% Varsayım</span>
                </div>
                <div className="text-lg font-bold text-amber-950 mt-1">
                  +{formatArea(result.nonFarAreaM2)}
                </div>
                <div className="text-[11px] text-amber-800 mt-0.5">
                  Bodrum otoparklar, sığınak, yangın holleri vb.
                </div>
                <div className="mt-2 text-[10px] font-medium text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded inline-block">
                  İmar Yönetmeliği Zorunlu Donatıları
                </div>
              </div>

              {/* Equals / Box 3: Toplam İnşaat Alanı */}
              <div className="bg-slate-900 text-white rounded-lg p-3 border border-slate-800">
                <div className="text-[11px] font-medium text-slate-400">3. Tahmini Toplam İnşaat Alanı</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {formatArea(result.totalConstructionAreaM2)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Müteahhidin dökeceği toplam betonarme metrajı
                </div>
                <div className="mt-2 text-[10px] font-medium text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded inline-block border border-emerald-500/30">
                  İnşaat Maliyeti Tahakkuk Tabanı
                </div>
              </div>
            </div>
          </div>

          {/* Sub-breakdown of %30 assumption (Answering: "Bu %30 nereden geliyor?") */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Bu %{assumptions.nonFarAreaRatio} Emsal Dışı Katsayısı Nereden Geliyor? (Teknik Kırılım)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mimari projede emsale sayılmayan ancak fiilen beton dökülüp maliyet doğuran alanların yasal dağılımı
                </p>
              </div>

              {onUpdateAssumptions && (
                <button
                  type="button"
                  onClick={() => setIsEditingRatios(!isEditingRatios)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline cursor-pointer"
                >
                  {isEditingRatios ? 'Ayarları Kapat' : 'Katsayıları Özelleştir'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Item 1: Kapalı Otopark */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">1. Kapalı Otopark Alanları</span>
                  <span className="text-xs font-extrabold text-blue-700">
                    %{nonFar.parkingPercent} ({formatArea(nonFar.parkingM2)})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Otopark Yönetmeliği uyarınca her daireye en az 1-1.5 araçlık kapalı bodrum otoparkı ve araç rampaları zorunluluğundan kaynaklanır.
                </p>
                {isEditingRatios && onUpdateAssumptions && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="range"
                      min={5}
                      max={30}
                      value={assumptions.parkingRatio || 15}
                      onChange={(e) => handleRatioChange('parkingRatio', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800 w-8 text-right">
                      %{assumptions.parkingRatio || 15}
                    </span>
                  </div>
                )}
              </div>

              {/* Item 2: Sığınak & Teknik */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">2. Sığınak & Teknik Hacimler</span>
                  <span className="text-xs font-extrabold text-blue-700">
                    %{nonFar.shelterTechPercent} ({formatArea(nonFar.shelterTechM2)})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sığınak Yönetmeliği gereği zorunlu genel sığınak, hidrofor dairesi, jeneratör odası, trafo ve merkezi su deposu alanlarıdır.
                </p>
                {isEditingRatios && onUpdateAssumptions && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={assumptions.shelterAndTechnicalRatio || 8}
                      onChange={(e) => handleRatioChange('shelterAndTechnicalRatio', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800 w-8 text-right">
                      %{assumptions.shelterAndTechnicalRatio || 8}
                    </span>
                  </div>
                )}
              </div>

              {/* Item 3: Yangın Holleri & Sirkülasyon */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">3. Yangın Holü & Şaftlar</span>
                  <span className="text-xs font-extrabold text-blue-700">
                    %{nonFar.circulationPercent} ({formatArea(nonFar.circulationM2)})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Binaların Yangından Korunması Yönetmeliği gereği duman tahliyeli yangın güvenlik holleri, asansör kuyu boşlukları ve tesisat şaftlarıdır.
                </p>
                {isEditingRatios && onUpdateAssumptions && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={assumptions.circulationAndShaftsRatio || 7}
                      onChange={(e) => handleRatioChange('circulationAndShaftsRatio', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-800 w-8 text-right">
                      %{assumptions.circulationAndShaftsRatio || 7}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Audit Note */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/70 text-[11px] text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Profesyonel Fizibilite Notu:</strong> Gelir hesabında bağımsız bölümler <strong>{formatArea(result.totalSalableGrossAreaM2)}</strong> (Emsale esas alan) üzerinden satılırken, inşaat bütçesi müteahhidin dökeceği toplam metraj olan <strong>{formatArea(result.totalConstructionAreaM2)}</strong> ({formatCurrencyTL(assumptions.constructionCostPerM2)}/m² ile) üzerinden hesaplanmaktadır. Bu sayede maliyetler asla eksik hesaplanmaz.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatCurrencyTL(val: number): string {
  return `${Math.round(val).toLocaleString('tr-TR')} TL`;
}
