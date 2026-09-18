import React from 'react';
import { Calculator, HardHat, Percent, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectCostAssumptions } from '../types/feasibility';
import { formatCurrencyTL, formatNumber } from '../utils/formatters';

interface ProjectAssumptionsProps {
  assumptions: ProjectCostAssumptions;
  onChange: (updated: ProjectCostAssumptions) => void;
}

export const ProjectAssumptions: React.FC<ProjectAssumptionsProps> = ({
  assumptions,
  onChange,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateField = <K extends keyof ProjectCostAssumptions>(
    key: K,
    value: ProjectCostAssumptions[K]
  ) => {
    onChange({ ...assumptions, [key]: value });
  };

  const costTiers = [
    { name: 'Ekonomik / Toplu Konut', value: 20000 },
    { name: 'Orta-Üst Standart', value: 26000 },
    { name: 'Lüks / Rezidans', value: 35000 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <HardHat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">İnşaat ve Genel Maliyet Parametreleri</h3>
            <p className="text-xs text-slate-500">M² inşaat maliyetleri, bodrum otopark ve ek giderler</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
          Adım 2
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* İnşaat m² Maliyeti */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="construction-cost-input" className="text-xs font-medium text-slate-700">
              Ortalama İnşaat Maliyeti (Toplam Brüt m²)
            </label>
            <span className="text-xs font-bold text-slate-900">
              {formatCurrencyTL(assumptions.constructionCostPerM2)} / m²
            </span>
          </div>

          <div className="relative">
            <input
              id="construction-cost-input"
              type="number"
              step={1000}
              min={10000}
              max={100000}
              value={assumptions.constructionCostPerM2}
              onChange={(e) => updateField('constructionCostPerM2', Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-12 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">TL / m²</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {costTiers.map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => updateField('constructionCostPerM2', tier.value)}
                className={`px-2 py-1.5 rounded-md text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                  assumptions.constructionCostPerM2 === tier.value
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="truncate">{tier.name}</div>
                <div className="text-[10px] text-slate-500 font-normal">{formatNumber(tier.value)} TL</div>
              </button>
            ))}
          </div>
        </div>

        {/* Emsal Dışı Alanlar (Bodrum Otopark vs) & Net/Brüt Verimlilik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="non-far-ratio-input" className="text-xs font-medium text-slate-700">
                Emsal Dışı Alanlar
              </label>
              <span className="text-xs font-semibold text-slate-800">
                +%{assumptions.nonFarAreaRatio}
              </span>
            </div>
            <div className="relative">
              <input
                id="non-far-ratio-input"
                type="number"
                min={0}
                max={70}
                value={assumptions.nonFarAreaRatio}
                onChange={(e) => updateField('nonFarAreaRatio', Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Otopark, yangın holü, sığınak, asansör şaftı ve teknik hacimler
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="net-gross-input" className="text-xs font-medium text-slate-700">
                Net / Brüt Verimlilik
              </label>
              <span className="text-xs font-semibold text-slate-800">
                %{assumptions.netGrossEfficiency}
              </span>
            </div>
            <div className="relative">
              <input
                id="net-gross-input"
                type="number"
                min={50}
                max={90}
                value={assumptions.netGrossEfficiency}
                onChange={(e) => updateField('netGrossEfficiency', Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bağımsız bölümlerin brütten nete süpürülebilir alan oranı
            </p>
          </div>
        </div>

        {/* Gelişmiş Harç ve Gider Detayları Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
          >
            <span>Ruhsat, Pazarlama & Beklenmeyen Gider Oranları</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Ruhsat & Proje Bedeli
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={0.5}
                    value={assumptions.permitAndDesignPercent}
                    onChange={(e) => updateField('permitAndDesignPercent', Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-200 rounded-md pl-2 pr-6 py-1 text-slate-900"
                  />
                  <span className="absolute right-2 top-1 text-xs text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">İnşaat maliyetine oranla</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Pazarlama & Satış
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={0.5}
                    value={assumptions.marketingSalesPercent}
                    onChange={(e) => updateField('marketingSalesPercent', Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-200 rounded-md pl-2 pr-6 py-1 text-slate-900"
                  />
                  <span className="absolute right-2 top-1 text-xs text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Toplam ciroya oranla</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Yönetim & Beklenmeyen
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={0.5}
                    value={assumptions.generalAdminAndContingencyPercent}
                    onChange={(e) => updateField('generalAdminAndContingencyPercent', Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-200 rounded-md pl-2 pr-6 py-1 text-slate-900"
                  />
                  <span className="absolute right-2 top-1 text-xs text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">İnşaat maliyetine oranla</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
