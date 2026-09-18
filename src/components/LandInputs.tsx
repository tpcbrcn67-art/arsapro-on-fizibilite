import React from 'react';
import { MapPin, Sliders, DollarSign, Building } from 'lucide-react';
import { LandData } from '../types/feasibility';
import { formatArea, formatNumber } from '../utils/formatters';

interface LandInputsProps {
  land: LandData;
  onChange: (updated: LandData) => void;
}

export const LandInputs: React.FC<LandInputsProps> = ({ land, onChange }) => {
  const updateField = <K extends keyof LandData>(key: K, value: LandData[K]) => {
    onChange({ ...land, [key]: value });
  };

  const netLandArea = land.landAreaM2 * (1 - (land.publicCessionPercent || 0) / 100);
  const tabanAlani = netLandArea * (land.taks || 0);
  const emsalAlani = netLandArea * (land.kaks || 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Arsa ve İmar Parametreleri</h3>
            <p className="text-xs text-slate-500">Resmî tapu ve imar durum belgesi verilerini girin</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
          Adım 1
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Proje Adı ve Konum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="project-name-input" className="block text-xs font-medium text-slate-700 mb-1">
              Proje / Parsel Adı
            </label>
            <input
              id="project-name-input"
              type="text"
              value={land.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              placeholder="Örn: Sakarya Serdivan Konut Projesi"
            />
          </div>
          <div>
            <label htmlFor="location-input" className="block text-xs font-medium text-slate-700 mb-1">
              İl / İlçe
            </label>
            <input
              id="location-input"
              type="text"
              value={land.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              placeholder="Örn: Sakarya / Serdivan"
            />
          </div>
        </div>

        {/* Mahalle, Ada, Parsel */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="neighborhood-input" className="block text-xs font-medium text-slate-700 mb-1">
              Mahalle
            </label>
            <input
              id="neighborhood-input"
              type="text"
              value={land.neighborhood || ''}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              placeholder="Örn: İstiklal Mah."
            />
          </div>
          <div>
            <label htmlFor="ada-input" className="block text-xs font-medium text-slate-700 mb-1">
              Ada No
            </label>
            <input
              id="ada-input"
              type="text"
              value={land.ada || ''}
              onChange={(e) => updateField('ada', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              placeholder="Örn: 1420"
            />
          </div>
          <div>
            <label htmlFor="parsel-input" className="block text-xs font-medium text-slate-700 mb-1">
              Parsel No
            </label>
            <input
              id="parsel-input"
              type="text"
              value={land.parsel || ''}
              onChange={(e) => updateField('parsel', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              placeholder="Örn: 8"
            />
          </div>
        </div>

        {/* Arsa Alanı & Terk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="land-area-input" className="text-xs font-medium text-slate-700">
                Arsa Alanı (Tapu)
              </label>
              <span className="text-xs font-semibold text-emerald-700">
                {formatArea(land.landAreaM2)}
              </span>
            </div>
            <div className="relative">
              <input
                id="land-area-input"
                type="number"
                min={100}
                max={500000}
                step={500}
                value={land.landAreaM2 || ''}
                onChange={(e) => updateField('landAreaM2', Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">m²</span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={land.landAreaM2}
              onChange={(e) => updateField('landAreaM2', Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="public-cession-input" className="text-xs font-medium text-slate-700">
                Yol / Park Terk Oranı
              </label>
              <span className="text-xs font-medium text-slate-500">
                %{land.publicCessionPercent || 0} ({formatArea(land.landAreaM2 * (land.publicCessionPercent / 100))})
              </span>
            </div>
            <div className="relative">
              <input
                id="public-cession-input"
                type="number"
                min={0}
                max={45}
                value={land.publicCessionPercent}
                onChange={(e) => updateField('publicCessionPercent', Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={land.publicCessionPercent}
              onChange={(e) => updateField('publicCessionPercent', Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Emsal (KAKS), TAKS, Kat Sınırı */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="kaks-input" className="text-xs font-medium text-slate-700">
                Emsal (KAKS)
              </label>
              <span className="text-xs font-semibold text-emerald-700">{land.kaks.toFixed(2)}</span>
            </div>
            <input
              id="kaks-input"
              type="number"
              step={0.1}
              min={0.1}
              max={5.0}
              value={land.kaks}
              onChange={(e) => updateField('kaks', Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
            <input
              type="range"
              step={0.05}
              min={0.2}
              max={4.0}
              value={land.kaks}
              onChange={(e) => updateField('kaks', Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="taks-input" className="text-xs font-medium text-slate-700">
                TAKS (Taban %)
              </label>
              <span className="text-xs font-semibold text-slate-700">%{Math.round(land.taks * 100)}</span>
            </div>
            <input
              id="taks-input"
              type="number"
              step={0.05}
              min={0.05}
              max={0.8}
              value={land.taks}
              onChange={(e) => updateField('taks', Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
            <input
              type="range"
              step={0.05}
              min={0.1}
              max={0.6}
              value={land.taks}
              onChange={(e) => updateField('taks', Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="max-floors-input" className="text-xs font-medium text-slate-700">
                Kat Sınırı
              </label>
              <span className="text-xs font-semibold text-slate-700">{land.maxFloors} Kat</span>
            </div>
            <input
              id="max-floors-input"
              type="number"
              min={1}
              max={40}
              value={land.maxFloors}
              onChange={(e) => updateField('maxFloors', Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
            <input
              type="range"
              min={1}
              max={25}
              value={land.maxFloors}
              onChange={(e) => updateField('maxFloors', Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Yençok, Arazi Eğimi ve Otopark Bilgisi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label htmlFor="yencok-input" className="block text-xs font-medium text-slate-700 mb-1">
              Yençok (Azami Yükseklik)
            </label>
            <div className="relative">
              <input
                id="yencok-input"
                type="number"
                step={0.5}
                value={land.yencok || ''}
                onChange={(e) => updateField('yencok', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Örn: 15.50"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">m</span>
            </div>
          </div>

          <div>
            <label htmlFor="slope-input" className="block text-xs font-medium text-slate-700 mb-1">
              Arazi Eğimi
            </label>
            <select
              id="slope-input"
              value={land.slope || 'Düz (%0-5)'}
              onChange={(e) => updateField('slope', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="Düz (%0-5)">Düz (%0 - %5)</option>
              <option value="Orta Eğimli (%5-15)">Orta Eğimli (%5 - %15)</option>
              <option value="Dik Eğimli (>%15)">Dik Eğimli (&gt;%15 - Bodrum Açığa Çıkar)</option>
            </select>
          </div>

          <div>
            <label htmlFor="parking-input" className="block text-xs font-medium text-slate-700 mb-1">
              Otopark Çözümü
            </label>
            <select
              id="parking-input"
              value={land.parkingRequirement || 'Kapalı Bodrum Otopark'}
              onChange={(e) => updateField('parkingRequirement', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="Kapalı Bodrum Otopark">Kapalı Bodrum Otopark</option>
              <option value="Açık Otopark">Açık Otopark (Bahçe İçi)</option>
              <option value="Karma (Açık + Kapalı)">Karma (Açık + Kapalı)</option>
              <option value="Mekanik Otopark Sistemi">Mekanik Otopark Sistemi</option>
            </select>
          </div>
        </div>

        {/* Plan Notları & Özel Koşullar */}
        <div>
          <label htmlFor="plan-notes-input" className="block text-xs font-medium text-slate-700 mb-1">
            İmar Plan Notları &amp; Özel Koşullar
          </label>
          <textarea
            id="plan-notes-input"
            rows={2}
            value={land.planNotes || ''}
            onChange={(e) => updateField('planNotes', e.target.value)}
            placeholder="Örn: Zemin kat ticari yapılabilir, 1. ve 2. bodrum katlar emsale dahil değildir, ön bahçe çekme mesafesi 5m..."
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
          />
        </div>

        {/* Live Arsa & İmar Çıktı Rozetleri */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Maks. Taban Oturumu (TAKS)</div>
            <div className="font-semibold text-slate-900 text-sm mt-0.5">
              {formatArea(tabanAlani)}
            </div>
            <div className="text-[11px] text-slate-400">Arsa tabanındaki azami bina izi</div>
          </div>
          <div>
            <div className="text-slate-500">Emsale Esas İnşaat Alanı</div>
            <div className="font-semibold text-emerald-800 text-sm mt-0.5">
              {formatArea(emsalAlani)}
            </div>
            <div className="text-[11px] text-slate-400">Net Arsa x {land.kaks.toFixed(2)} Emsal</div>
          </div>
        </div>

        {/* Edinme Modeli: Nakit Satın Alma vs Kat Karşılığı vs Hasılat Paylaşımı */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Arsa Edinme / Geliştirme Modeli
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="model-cash-btn"
              type="button"
              onClick={() => updateField('acquisitionType', 'cash')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                land.acquisitionType === 'cash'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Nakit Satın Alma
            </button>
            <button
              id="model-flat-for-land-btn"
              type="button"
              onClick={() => updateField('acquisitionType', 'flat_for_land')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                land.acquisitionType === 'flat_for_land'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Kat Karşılığı (%)
            </button>
            <button
              id="model-revenue-share-btn"
              type="button"
              onClick={() => updateField('acquisitionType', 'revenue_share')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                land.acquisitionType === 'revenue_share'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Hasılat Paylaşımı
            </button>
          </div>

          <div className="mt-3">
            {land.acquisitionType === 'cash' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="land-cash-price-input" className="text-xs font-medium text-slate-700">
                    Arsa Fiyatı / Edinme Maliyeti (TL)
                  </label>
                  <span className="text-xs font-semibold text-slate-900">
                    {formatNumber(land.landCashPrice / 1_000_000, 1)} Milyon TL
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="land-cash-price-input"
                    type="number"
                    step={5000000}
                    value={land.landCashPrice}
                    onChange={(e) => updateField('landCashPrice', Number(e.target.value))}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">TL</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {[50, 100, 200, 350, 500].map((millions) => (
                    <button
                      key={millions}
                      type="button"
                      onClick={() => updateField('landCashPrice', millions * 1_000_000)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        land.landCashPrice === millions * 1_000_000
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {millions}M
                    </button>
                  ))}
                </div>
              </div>
            )}

            {land.acquisitionType === 'flat_for_land' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="land-owner-share-input" className="text-xs font-medium text-slate-700">
                    Arsa Sahibi Payı (%)
                  </label>
                  <span className="text-xs font-semibold text-emerald-800">
                    Müteahhit: %{100 - land.landOwnerSharePercent} / Arsa Sahibi: %{land.landOwnerSharePercent}
                  </span>
                </div>
                <input
                  id="land-owner-share-input"
                  type="range"
                  min={20}
                  max={70}
                  step={5}
                  value={land.landOwnerSharePercent}
                  onChange={(e) => updateField('landOwnerSharePercent', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>%30 (Arsa) / %70 (Müt.)</span>
                  <span className="font-semibold text-slate-900">%50 - %50 (Eşit Pay)</span>
                  <span>%60 (Arsa) / %40 (Müt.)</span>
                </div>
              </div>
            )}

            {land.acquisitionType === 'revenue_share' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="revenue-share-input" className="text-xs font-medium text-slate-700">
                    Arsa Sahibine Ciro Payı (%)
                  </label>
                  <span className="text-xs font-semibold text-emerald-800">
                    Cironun %{land.revenueSharePercent}'i arsa sahibine ödenir
                  </span>
                </div>
                <input
                  id="revenue-share-input"
                  type="range"
                  min={15}
                  max={55}
                  step={1}
                  value={land.revenueSharePercent}
                  onChange={(e) => updateField('revenueSharePercent', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
