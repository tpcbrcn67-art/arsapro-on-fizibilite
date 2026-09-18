import React from 'react';
import {
  Sliders,
  HardHat,
  Tag,
  DollarSign,
  Percent,
  Layers,
  MapPin,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  ProjectCostAssumptions,
  ConstructionCostTier,
  SalesPriceInputMode,
  FeasibilityScenario,
} from '../types/feasibility';
import { regionalBenchmarks } from '../data/defaultScenarios';
import { formatCurrencyTL, formatNumber } from '../utils/formatters';

interface AssumptionHubProps {
  assumptions: ProjectCostAssumptions;
  onChangeAssumptions: (updated: ProjectCostAssumptions) => void;
  scenarios: FeasibilityScenario[];
  activeScenarioId: string;
  onUpdateScenario: (updated: FeasibilityScenario) => void;
  onBulkUpdateUnitPrices?: (prices: { [key: string]: number }) => void;
}

export const AssumptionHub: React.FC<AssumptionHubProps> = ({
  assumptions,
  onChangeAssumptions,
  scenarios,
  activeScenarioId,
  onUpdateScenario,
  onBulkUpdateUnitPrices,
}) => {
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const updateAssumption = <K extends keyof ProjectCostAssumptions>(
    key: K,
    value: ProjectCostAssumptions[K]
  ) => {
    onChangeAssumptions({ ...assumptions, [key]: value });
  };

  // Preset cost tiers
  const costTiers: { id: ConstructionCostTier; label: string; subLabel: string; cost: number }[] = [
    {
      id: 'standard',
      label: 'Standart',
      subLabel: 'Ekonomik & Toplu Konut',
      cost: 24000,
    },
    {
      id: 'medium',
      label: 'Orta',
      subLabel: 'Nitelikli Konut & Aile Sitesi',
      cost: 29500, // exact user prompt benchmark
    },
    {
      id: 'luxury',
      label: 'Üst Segment',
      subLabel: 'Rezidans & Lüks Donatı',
      cost: 38000,
    },
  ];

  // Handle tier selection
  const handleSelectTier = (tier: (typeof costTiers)[0]) => {
    onChangeAssumptions({
      ...assumptions,
      costTier: tier.id,
      constructionCostPerM2: tier.cost,
    });
  };

  // Handle unit price change for active scenario
  const handleUnitPriceChange = (unitTypeId: string, newPriceTL: number) => {
    const updatedUnitTypes = activeScenario.unitTypes.map((u) => {
      if (u.id === unitTypeId) {
        const grossM2 = Math.max(20, u.averageGrossM2);
        return {
          ...u,
          customUnitPriceTL: newPriceTL,
          unitSalesPricePerM2: Math.round(newPriceTL / grossM2),
        };
      }
      return u;
    });

    onUpdateScenario({
      ...activeScenario,
      unitTypes: updatedUnitTypes,
    });
  };

  // Handle Regional benchmark selection
  const handleSelectRegionalBenchmark = (benchmarkId: string) => {
    const benchmark = regionalBenchmarks.find((b) => b.id === benchmarkId);
    if (!benchmark) return;

    onChangeAssumptions({
      ...assumptions,
      salesPriceMode: 'regional_benchmark',
      selectedRegionalBenchmarkId: benchmarkId,
    });

    // Update active scenario's unit prices to regional benchmark values
    const updatedUnitTypes = activeScenario.unitTypes.map((u) => {
      let targetPrice = benchmark.twoPlusOnePrice;
      if (u.name.includes('1+1')) targetPrice = benchmark.onePlusOnePrice;
      else if (u.name.includes('3+1') || u.name.includes('4+1')) targetPrice = benchmark.threePlusOnePrice;

      return {
        ...u,
        customUnitPriceTL: targetPrice,
        unitSalesPricePerM2: Math.round(targetPrice / Math.max(20, u.averageGrossM2)),
      };
    });

    onUpdateScenario({
      ...activeScenario,
      unitTypes: updatedUnitTypes,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <span className="text-base">🔴</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                VARSAYIM MERKEZİ (Assumption Hub)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Şeffaf & Kontrollü
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hangi rakamın nereden geldiğini açıkça görün; inşaat maliyeti, satış fiyatları ve katsayıları doğrudan yönetin.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Uygulanan Senaryo: <strong className="text-slate-900">{activeScenario.shortCode}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: İNŞAAT MALİYETİ (Standart / Orta / Üst Segment) */}
        <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                İNŞAAT MALİYETİ
              </h3>
            </div>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {formatCurrencyTL(assumptions.constructionCostPerM2)} / m²
            </span>
          </div>

          {/* Radio / Tier Selection (Standart, Orta, Üst Segment) */}
          <div className="space-y-2">
            {costTiers.map((tier) => {
              const isSelected =
                assumptions.costTier === tier.id ||
                assumptions.constructionCostPerM2 === tier.cost;

              return (
                <div
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tier.label}</div>
                      <div className="text-[11px] text-slate-500">{tier.subLabel}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatNumber(tier.cost)} TL / m²
                    </div>
                    <div className="text-[10px] text-slate-400">Toplam brüt m² esaslı</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Serbest Giriş / Birim Maliyet Düzenleme */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="custom-cost-input" className="text-xs font-semibold text-slate-700">
                Birim Maliyet (Serbest Giriş):
              </label>
              <span className="text-[11px] text-slate-500">Tüm senaryolara yansır</span>
            </div>
            <div className="relative">
              <input
                id="custom-cost-input"
                type="number"
                step={500}
                min={10000}
                max={150000}
                value={assumptions.constructionCostPerM2}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChangeAssumptions({
                    ...assumptions,
                    costTier: 'custom',
                    constructionCostPerM2: val,
                  });
                }}
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg pl-3 pr-14 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">TL / m²</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SATIŞ FİYATI YÖNETİMİ (Kullanıcı Girişi / Bölgesel Veri / Özel) */}
        <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                SATIŞ FİYATI BELİRLEME MODU
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {assumptions.salesPriceMode === 'user_units'
                ? 'Kullanıcı Girişi'
                : assumptions.salesPriceMode === 'regional_benchmark'
                ? 'Bölgesel Veri'
                : 'Özel Senaryo'}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => updateAssumption('salesPriceMode', 'user_units')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center truncate ${
                assumptions.salesPriceMode === 'user_units'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ☑ Kullanıcı Girişi
            </button>
            <button
              type="button"
              onClick={() => updateAssumption('salesPriceMode', 'regional_benchmark')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center truncate ${
                assumptions.salesPriceMode === 'regional_benchmark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ☐ Bölgesel Veri
            </button>
            <button
              type="button"
              onClick={() => updateAssumption('salesPriceMode', 'custom_scenario')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center truncate ${
                assumptions.salesPriceMode === 'custom_scenario'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ☐ Özel Senaryo
            </button>
          </div>

          {/* Mode A: Kullanıcı Girişi (1+1, 2+1, 3+1 Daire Fiyatları) */}
          {assumptions.salesPriceMode === 'user_units' && (
            <div className="space-y-2.5 bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-600 mb-1">
                Hedef Daire Satış Fiyatları ({activeScenario.shortCode}):
              </div>

              {activeScenario.unitTypes.map((unit) => {
                const currentPriceTL =
                  unit.customUnitPriceTL ||
                  Math.round(unit.averageGrossM2 * unit.unitSalesPricePerM2);

                return (
                  <div key={unit.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: unit.color }}
                      />
                      <span className="text-xs font-bold text-slate-800">{unit.name}</span>
                      <span className="text-[10px] text-slate-400">({unit.averageGrossM2} m²)</span>
                    </div>

                    <div className="relative w-36 sm:w-44">
                      <input
                        type="number"
                        step={100000}
                        min={500000}
                        max={100000000}
                        value={currentPriceTL}
                        onChange={(e) => handleUnitPriceChange(unit.id, Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-md pl-2 pr-8 py-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden text-right"
                      />
                      <span className="absolute right-2 top-1.5 text-[11px] font-medium text-slate-400">
                        TL
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-[10px] text-slate-400 text-right pt-1">
                Daire fiyatı değiştirildiğinde metrekare birim fiyatı otomatik hesaplanır.
              </div>
            </div>
          )}

          {/* Mode B: Bölgesel Veri (Regional Benchmark Selector) */}
          {assumptions.salesPriceMode === 'regional_benchmark' && (
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-600 mb-1">
                Bölgesel Referans Satış Fiyat Endeksini Seçin:
              </div>
              <div className="space-y-1.5">
                {regionalBenchmarks.map((bm) => {
                  const isSelected = assumptions.selectedRegionalBenchmarkId === bm.id;
                  return (
                    <div
                      key={bm.id}
                      onClick={() => handleSelectRegionalBenchmark(bm.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 font-semibold text-blue-950'
                          : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{bm.name}</span>
                        <span className="text-blue-700 font-extrabold">
                          ~{formatNumber(bm.avgSalesPricePerM2)} TL/m²
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>1+1: {formatCurrencyTL(bm.onePlusOnePrice, true)}</span>
                        <span>2+1: {formatCurrencyTL(bm.twoPlusOnePrice, true)}</span>
                        <span>3+1: {formatCurrencyTL(bm.threePlusOnePrice, true)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode C: Özel Senaryo */}
          {assumptions.salesPriceMode === 'custom_scenario' && (
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>
                Özel Senaryo modunda her senaryo kendi bağımsız birim satış fiyatlarını saklar.
                Senaryo Karşılaştırma sekmesinden "Senaryo Düzenle" butonunu kullanarak ince ayar yapabilirsiniz.
              </p>
              <div className="p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
                Aktif Senaryo Ortalama m² Satış Fiyatı:{' '}
                <strong>
                  {formatCurrencyTL(
                    activeScenario.unitTypes.reduce(
                      (acc, u) => acc + u.unitSalesPricePerM2 * (u.ratio / 100),
                      0
                    )
                  )} / m²
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: ORTAK ALAN & BEKLENEN SATIŞ / FİRE / REZERV YÖNETİMİ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Ortak Alan Katsayısı */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">Ortak Alan Katsayısı</span>
            <span className="text-xs font-extrabold text-blue-700">
              %{assumptions.nonFarAreaRatio}
            </span>
          </div>
          <div className="relative mt-2">
            <input
              type="number"
              min={10}
              max={60}
              value={assumptions.nonFarAreaRatio}
              onChange={(e) => updateAssumption('nonFarAreaRatio', Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-1.5 text-xs text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Bodrum otopark, sığınak ve şaft ilavesi (40.000 m² → 52.000 m²)
          </p>
        </div>

        {/* Beklenen Satış / Fire / Rezerv / İskonto */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">Beklenen Satış Firesi/Rezerv</span>
            <span className="text-xs font-extrabold text-amber-700">
              %{assumptions.salesContingencyOrReservePercent}
            </span>
          </div>
          <div className="relative mt-2">
            <input
              type="number"
              step={0.5}
              min={0}
              max={15}
              value={assumptions.salesContingencyOrReservePercent}
              onChange={(e) =>
                updateAssumption('salesContingencyOrReservePercent', Number(e.target.value))
              }
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-1.5 text-xs text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Pazarlık payı, lansman indirimi ve beklenmeyen satış risk rezervi
          </p>
        </div>

        {/* Proje Süresi */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">Hedef Proje Süresi</span>
            <span className="text-xs font-extrabold text-slate-900">
              {assumptions.projectDurationMonths} Ay
            </span>
          </div>
          <div className="relative mt-2">
            <input
              type="number"
              min={6}
              max={60}
              value={assumptions.projectDurationMonths}
              onChange={(e) => updateAssumption('projectDurationMonths', Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-1.5 text-xs text-slate-400 font-bold">Ay</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Ruhsat alımından anahtar teslimine kadar öngörülen toplam süre
          </p>
        </div>

        {/* Aylık Sabit Şantiye / Yönetim Gideri */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">Aylık Sabit Şantiye Gideri</span>
            <span className="text-xs font-extrabold text-slate-900">
              {formatCurrencyTL(assumptions.monthlySiteOverheadTL, true)}
            </span>
          </div>
          <div className="relative mt-2">
            <input
              type="number"
              step={50000}
              min={100000}
              max={5000000}
              value={assumptions.monthlySiteOverheadTL}
              onChange={(e) => updateAssumption('monthlySiteOverheadTL', Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-1.5 text-xs text-slate-400 font-bold">TL</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Süre gecikmesi stres testinde şantiyenin aylık ek maliyet tabanı
          </p>
        </div>
      </div>
    </div>
  );
};
