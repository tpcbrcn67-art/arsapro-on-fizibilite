import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck, FileText } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Yasal ve Teknik Uyarı"
      id="disclaimer-banner"
      className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs transition-all"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
        </div>

        <div className="flex-1 text-sm text-amber-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-amber-900 tracking-tight">
              Yasal ve Teknik Ön Fizibilite Uyarısı
            </h2>
            <button
              id="toggle-disclaimer-btn"
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
            >
              <span>{isExpanded ? 'Detayları Gizle' : 'Mevzuat & Değişken Detayları'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="mt-1 text-amber-900 leading-relaxed font-medium">
            <strong>Bu çalışma ön fizibilite niteliğindedir. Resmî imar durumu veya mimari proje yerine geçmez.</strong>
          </p>

          <p className="mt-1 text-amber-800 text-xs sm:text-sm leading-relaxed">
            Burada üretilen bağımsız bölüm adetleri ve finansal tablolar birer varsayımsal senaryodur. Kesin yapılaşma ve ruhsat şartları; ilgili belediyenin güncel imar plan notları, çekme mesafeleri, terkler, otopark, yangın yönetmelikleri ve zemin etüdü neticesinde hazırlanacak mimari avan proje ile belirlenir.
          </p>

          {isExpanded && (
            <div className="mt-4 pt-3 border-t border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Plan Notları ve Terkler:</span> Belediyenin parsel bazındaki yol, yeşil alan veya kamu terk oranları emsale esas arsa alanını doğrudan değiştirebilir.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Otopark ve Yangın Mevzuatı:</span> Otopark yönetmeliği (daire başı min. 1 araç) ve yangın merdiveni/sığınak zorunlulukları bodrum kat adetlerini ve toplam inşaat maliyetini etkiler.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
