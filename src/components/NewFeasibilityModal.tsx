import React, { useState } from 'react';
import {
  X,
  Calculator,
  Building2,
  MapPin,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { LandData, ProjectCostAssumptions, UserSubscription } from '../types/feasibility';
import { formatCurrencyTL, formatArea } from '../utils/formatters';

interface NewFeasibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: UserSubscription;
  onUpgradePrompt?: () => void;
  onCalculate: (data: {
    city: string;
    district: string;
    projectName: string;
    landAreaM2: number;
    acquisitionType: 'cash' | 'flat_for_land' | 'revenue_share';
    landPriceTL: number;
    landOwnerSharePercent: number;
    kaks: number;
    taks: number;
    maxFloors: number;
    unitSalesPricePerM2: number;
    constructionCostSegment: 'standard' | 'medium' | 'luxury';
  }) => void;
}

export const NewFeasibilityModal: React.FC<NewFeasibilityModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgradePrompt,
  onCalculate,
}) => {
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Kadıköy');
  const [projectName, setProjectName] = useState('Fenerbahçe Konut Projesi');
  const [landAreaM2, setLandAreaM2] = useState<number>(5000);
  const [acquisitionType, setAcquisitionType] = useState<'cash' | 'flat_for_land' | 'revenue_share'>('cash');
  const [landPriceTL, setLandPriceTL] = useState<number>(150_000_000);
  const [landOwnerSharePercent, setLandOwnerSharePercent] = useState<number>(45);
  const [kaks, setKaks] = useState<number>(2.0);
  const [taks, setTaks] = useState<number>(0.4);
  const [maxFloors, setMaxFloors] = useState<number>(10);
  const [unitSalesPricePerM2, setUnitSalesPricePerM2] = useState<number>(95000);
  const [constructionCostSegment, setConstructionCostSegment] = useState<'standard' | 'medium' | 'luxury'>('medium');

  if (!isOpen) return null;

  const isQuotaExceeded =
    subscription && subscription.plan === 'free' && subscription.usedCountThisMonth >= subscription.monthlyLimit;

  // Real-time quick preview math
  const estimatedFarAreaM2 = landAreaM2 * kaks;
  const estimatedTotalConstructionAreaM2 = estimatedFarAreaM2 * 1.3; // %30 emsal dışı
  const estimatedFootprintM2 = landAreaM2 * taks;
  const estimatedRevenue = estimatedFarAreaM2 * unitSalesPricePerM2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isQuotaExceeded) {
      if (onUpgradePrompt) onUpgradePrompt();
      return;
    }
    onCalculate({
      city,
      district,
      projectName: projectName.trim() || `${city} / ${district} Projesi`,
      landAreaM2: Math.max(100, landAreaM2),
      acquisitionType,
      landPriceTL: Math.max(0, landPriceTL),
      landOwnerSharePercent: Math.max(1, Math.min(90, landOwnerSharePercent)),
      kaks: Math.max(0.1, kaks),
      taks: Math.max(0.05, Math.min(1, taks)),
      maxFloors: Math.max(1, maxFloors),
      unitSalesPricePerM2: Math.max(1000, unitSalesPricePerM2),
      constructionCostSegment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Yeni Fizibilite Oluştur</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ARSAPRO Motoru
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Arsa imar ve fiyat parametrelerini girin, saniyeler içinde tam fizibilite raporunu alın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Banner */}
        {subscription && subscription.plan === 'free' && (
          <div className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
            isQuotaExceeded
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Ücretsiz Plan:</strong> Bu ay kalan fizibilite hakkınız:{' '}
                <strong>{Math.max(0, subscription.monthlyLimit - subscription.usedCountThisMonth)} / {subscription.monthlyLimit}</strong>
              </span>
            </div>
            {isQuotaExceeded ? (
              <button
                type="button"
                onClick={onUpgradePrompt}
                className="font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
              >
                Pro'ya Yükselt →
              </button>
            ) : (
              <button
                type="button"
                onClick={onUpgradePrompt}
                className="font-semibold text-amber-700 underline hover:text-amber-900 cursor-pointer"
              >
                Sınırsız Yap →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Lokasyon & Proje Adı */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>1. Arsa ve Proje Tanımı</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">İl</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul, Ankara vb."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">İlçe</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Kadıköy, Çankaya vb."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proje Adı</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Proje veya Parsel No"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. İmar Parametreleri (Emsal, TAKS, Kat Sınırı) */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. İmar Parametreleri</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arsa Alanı (m²)
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={landAreaM2}
                  onChange={(e) => setLandAreaM2(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emsal (KAKS)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.05"
                  value={kaks}
                  onChange={(e) => setKaks(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  TAKS (Taban Oturumu)
                </label>
                <input
                  type="number"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={taks}
                  onChange={(e) => setTaks(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kat Sınırı (Hmax)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxFloors}
                  onChange={(e) => setMaxFloors(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 3. Maliyet & Satış Fiyatı Parametreleri */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Fiyat ve Edinim Modeli</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Arsa Edinim Tipi</label>
                <select
                  value={acquisitionType}
                  onChange={(e) => setAcquisitionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="cash">Nakit Satın Alma</option>
                  <option value="flat_for_land">Kat Karşılığı (%)</option>
                  <option value="revenue_share">Hasılat Paylaşımı (%)</option>
                </select>
              </div>

              {acquisitionType === 'cash' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Arsa Satış Bedeli (TL)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={landPriceTL}
                    onChange={(e) => setLandPriceTL(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {formatCurrencyTL(landPriceTL)}
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Arsa Sahibi Payı (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={landOwnerSharePercent}
                    onChange={(e) => setLandOwnerSharePercent(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Müteahhit Payı: %{100 - landOwnerSharePercent}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Birim Satış Fiyatı (TL/m²)
                </label>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={unitSalesPricePerM2}
                  onChange={(e) => setUnitSalesPricePerM2(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-700"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {formatCurrencyTL(unitSalesPricePerM2)} / m²
                </span>
              </div>
            </div>

            {/* İnşaat Maliyet Segmenti */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                İnşaat Kalite ve Maliyet Segmenti
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setConstructionCostSegment('standard')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    constructionCostSegment === 'standard'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Standart</div>
                  <div className="text-[10px] text-slate-500 font-normal">24.500 TL/m²</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConstructionCostSegment('medium')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    constructionCostSegment === 'medium'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Orta (Önerilen)</div>
                  <div className="text-[10px] text-slate-500 font-normal">29.500 TL/m²</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConstructionCostSegment('luxury')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    constructionCostSegment === 'luxury'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-2xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Lüks / Prestij</div>
                  <div className="text-[10px] text-slate-500 font-normal">38.000 TL/m²</div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Pre-calculation Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Ön Hesaplama Özeti
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Gerçek İmar Matematiği</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Emsale Esas Alan</span>
                <strong className="text-slate-900 font-bold">{formatArea(estimatedFarAreaM2)}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Toplam İnşaat (+%30)</span>
                <strong className="text-slate-900 font-bold">{formatArea(estimatedTotalConstructionAreaM2)}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Taban Oturumu (TAKS)</span>
                <strong className="text-slate-900 font-bold">{formatArea(estimatedFootprintM2)}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Tahmini Brüt Ciro</span>
                <strong className="text-emerald-700 font-bold">{formatCurrencyTL(estimatedRevenue)}</strong>
              </div>
            </div>
          </div>

          {/* Action Button: FİZİBİLİTEYİ HESAPLA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              id="calculate-feasibility-btn"
              type="submit"
              className="px-6 py-3 text-sm font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>FİZİBİLİTEYİ HESAPLA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
