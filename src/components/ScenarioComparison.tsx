import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Layers,
  TrendingUp,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  DollarSign,
  AlertCircle,
  Copy,
} from 'lucide-react';
import {
  FeasibilityScenario,
  FeasibilityResult,
  LandData,
  ProjectCostAssumptions,
} from '../types/feasibility';
import { calculateFeasibility, cloneScenario } from '../utils/calculator';
import {
  formatCurrencyTL,
  formatNumber,
  formatPercent,
  formatArea,
} from '../utils/formatters';

interface ScenarioComparisonProps {
  scenarios: FeasibilityScenario[];
  activeScenarioId: string;
  land: LandData;
  assumptions: ProjectCostAssumptions;
  onSelectScenario: (id: string) => void;
  onUpdateScenario: (updated: FeasibilityScenario) => void;
  onAddScenario: (scenario: FeasibilityScenario) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  activeScenarioId,
  land,
  assumptions,
  onSelectScenario,
  onUpdateScenario,
  onAddScenario,
}) => {
  const [editingScenario, setEditingScenario] = useState<FeasibilityScenario | null>(null);

  // Calculate results for all scenarios
  const scenarioResults = scenarios.map((scenario) => ({
    scenario,
    result: calculateFeasibility(land, assumptions, scenario),
  }));

  // Find max revenue and max profit for relative bar chart scaling
  const maxRevenue = Math.max(...scenarioResults.map((s) => s.result.totalGrossRevenue), 1);
  const maxProfit = Math.max(...scenarioResults.map((s) => s.result.grossProfit), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              SENARYO KARŞILAŞTIRMASI
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Bu Arsaya Ne Yapılabilir?
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Farklı daire adedi, ortalama metrekare ve konsept varsayımlarının ciro, maliyet ve kârlılık mukayesesi
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const newId = `custom_${Date.now()}`;
            const newScenario: FeasibilityScenario = {
              id: newId,
              shortCode: `Senaryo ${String.fromCharCode(65 + scenarios.length)}`,
              name: 'Özel Karma Senaryo',
              description: 'Kullanıcı tarafından özelleştirilmiş bağımsız bölüm karması.',
              badge: 'Özel Senaryo',
              constructionCostPerM2: assumptions.constructionCostPerM2,
              unitTypes: [
                {
                  id: 'u_1',
                  name: '1+1 Rezidans',
                  ratio: 30,
                  averageNetM2: 40,
                  averageGrossM2: 55,
                  unitSalesPricePerM2: 65000,
                  color: '#3B82F6',
                },
                {
                  id: 'u_2',
                  name: '2+1 Standart',
                  ratio: 45,
                  averageNetM2: 60,
                  averageGrossM2: 80,
                  unitSalesPricePerM2: 62000,
                  color: '#10B981',
                },
                {
                  id: 'u_3',
                  name: '3+1 Aile',
                  ratio: 25,
                  averageNetM2: 90,
                  averageGrossM2: 120,
                  unitSalesPricePerM2: 58000,
                  color: '#F59E0B',
                },
              ],
              isCustom: true,
            };
            onAddScenario(newScenario);
            setEditingScenario(newScenario);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Senaryo Ekle</span>
        </button>
      </div>

      {/* 3'lü Senaryo Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarioResults.map(({ scenario, result }) => {
          const isActive = scenario.id === activeScenarioId;
          const isTopProfit = result.grossProfit === maxProfit;

          return (
            <div
              key={scenario.id}
              className={`rounded-xl border transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {isTopProfit && (
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                  En Yüksek Kâr
                </div>
              )}

              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {scenario.shortCode}
                      </span>
                      {result.suitabilityScore && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          result.suitabilityScore === 'Çok Uygun'
                            ? 'bg-emerald-100 text-emerald-800'
                            : result.suitabilityScore === 'Uygun'
                            ? 'bg-blue-100 text-blue-800'
                            : result.suitabilityScore === 'Dengeli'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {result.suitabilityScore}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {scenario.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const cloned = cloneScenario(scenario, scenarios.length);
                        onAddScenario(cloned);
                      }}
                      title="Bu Senaryoyu Kopyala"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingScenario(scenario)}
                      title="Senaryoyu Düzenle"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                  {scenario.description}
                </p>

                {/* Key Metrics User Explicitly Asked For (Daire, Ortalama m², Ciro, Maliyet, Kâr) */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Toplam Daire Adedi:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {result.totalUnitCount} Adet
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Ortalama Daire:</span>
                    <span className="font-bold text-slate-800">
                      ~{formatNumber(result.averageUnitGrossM2, 0)} m² Brüt
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Tahmini Ciro:</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrencyTL(result.totalGrossRevenue, true)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Tahmini Maliyet:</span>
                    <span className="font-semibold text-slate-700">
                      {formatCurrencyTL(result.totalProjectCost, true)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 bg-emerald-50/60 px-2 rounded-lg">
                    <span className="text-emerald-900 font-semibold">Tahmini Kâr:</span>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-700 text-sm">
                        {formatCurrencyTL(result.grossProfit, true)}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-medium">
                        Marj: {formatPercent(result.profitMarginOnRevenue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ünite Dağılım Mini Barı */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>Ünite Miksi:</span>
                    <span>{result.units.map((u) => `${u.name.split(' ')[0]}: ${u.count}`).join(' | ')}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
                    {result.units.map((u) => (
                      <div
                        key={u.unitTypeId}
                        style={{
                          width: `${(u.count / (result.totalUnitCount || 1)) * 100}%`,
                          backgroundColor: u.color,
                        }}
                        className="h-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Select Active Scenario Button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                {isActive ? (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/70 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aktif İncelenen Senaryo</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectScenario(scenario.id)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Bu Senaryoyu Seç</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* YAN YANA KARŞILAŞTIRMA TABLOSU (User prompt format) */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-600" />
          <span>Senaryo Karşılaştırma Matrisi</span>
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full text-xs text-left min-w-[620px]">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-1/4">Karşılaştırma Parametresi</th>
                {scenarioResults.map(({ scenario }) => (
                  <th
                    key={scenario.id}
                    className={`py-3 px-4 text-right ${
                      scenario.id === activeScenarioId ? 'bg-indigo-50/70 text-indigo-950 font-bold' : ''
                    }`}
                  >
                    <div>{scenario.shortCode}</div>
                    <div className="text-[10px] font-normal text-slate-500 truncate">{scenario.badge}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Daire Adedi */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900">Toplam Daire (Bağımsız Bölüm)</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                    {result.totalUnitCount} Daire
                  </td>
                ))}
              </tr>

              {/* Ortalama m² */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Ortalama Daire m² (Brüt / Net)</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-semibold text-slate-800">
                    {formatNumber(result.averageUnitGrossM2, 0)} m² / {formatNumber(result.averageUnitNetM2, 0)} m²
                  </td>
                ))}
              </tr>

              {/* Ünite Kırılımı */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Tipolojik Dağılım</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right text-[11px] text-slate-600">
                    {result.units.map((u) => `${u.name.split(' ')[0]}: ${u.count}`).join(' • ')}
                  </td>
                ))}
              </tr>

              {/* Tahmini Ciro */}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-900">Tahmini Ciro (Satış Hasılatı)</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrencyTL(result.totalGrossRevenue, true)}
                  </td>
                ))}
              </tr>

              {/* Tahmini İnşaat Maliyeti */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">İnşaat Maliyeti</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right text-slate-700 font-medium">
                    {formatCurrencyTL(result.directConstructionCost, true)}
                  </td>
                ))}
              </tr>

              {/* Tahmini Toplam Maliyet */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Tahmini Toplam Maliyet (Arsa + İnşaat + Gider)</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-semibold text-slate-800">
                    {formatCurrencyTL(result.totalProjectCost, true)}
                  </td>
                ))}
              </tr>

              {/* Tahmini Kâr */}
              <tr className="bg-emerald-50/50 font-bold text-emerald-950">
                <td className="py-3 px-4 font-extrabold text-emerald-900">Tahmini Proje Kârı</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                    {formatCurrencyTL(result.grossProfit, true)}
                  </td>
                ))}
              </tr>

              {/* Kâr Marjı */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Kâr Marjı (Kâr / Ciro %)</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-semibold text-emerald-700">
                    {formatPercent(result.profitMarginOnRevenue)}
                  </td>
                ))}
              </tr>

              {/* Satılabilir m² Başı Kâr */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Satılabilir m² Başına Kâr</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right font-medium text-slate-800">
                    {formatCurrencyTL(result.profitPerSalableM2)} / m²
                  </td>
                ))}
              </tr>

              {/* Satış Hızı ve Likidite */}
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-700">Satış Hızı & Risk Profili</td>
                {scenarioResults.map(({ scenario, result }) => (
                  <td key={scenario.id} className="py-2.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      result.liquidityScore === 'Yüksek'
                        ? 'bg-emerald-100 text-emerald-800'
                        : result.liquidityScore === 'Dengeli'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {result.liquidityScore} Hız
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Görsel Karşılaştırma Grafiği (Ciro, Maliyet, Kâr Barları) */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Görsel Karşılaştırma: Ciro vs Toplam Maliyet vs Kâr
        </h3>
        <div className="space-y-4">
          {scenarioResults.map(({ scenario, result }) => {
            const revenuePct = (result.totalGrossRevenue / maxRevenue) * 100;
            const costPct = (result.totalProjectCost / maxRevenue) * 100;
            const profitPct = (result.grossProfit / maxRevenue) * 100;

            return (
              <div key={scenario.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{scenario.shortCode}: {scenario.name}</span>
                  <span className="font-semibold text-emerald-700">
                    Kâr: {formatCurrencyTL(result.grossProfit, true)} ({formatPercent(result.profitMarginOnRevenue)})
                  </span>
                </div>

                <div className="relative h-6 bg-slate-200 rounded-lg overflow-hidden flex shadow-2xs">
                  {/* Maliyet Payı */}
                  <div
                    style={{ width: `${costPct}%` }}
                    className="bg-slate-600 h-full flex items-center px-2 text-[10px] font-bold text-white truncate"
                    title={`Maliyet: ${formatCurrencyTL(result.totalProjectCost, true)}`}
                  >
                    Maliyet: {formatCurrencyTL(result.totalProjectCost, true)}
                  </div>
                  {/* Kâr Payı */}
                  <div
                    style={{ width: `${Math.max(0, profitPct)}%` }}
                    className="bg-emerald-500 h-full flex items-center px-2 text-[10px] font-bold text-white truncate"
                    title={`Kâr: ${formatCurrencyTL(result.grossProfit, true)}`}
                  >
                    Kâr: {formatCurrencyTL(result.grossProfit, true)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Senaryo Düzenleme Modalı */}
      {editingScenario && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingScenario.shortCode} Parametrelerini Düzenle
              </h3>
              <button
                type="button"
                onClick={() => setEditingScenario(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Senaryo Başlığı</label>
                <input
                  type="text"
                  value={editingScenario.name}
                  onChange={(e) =>
                    setEditingScenario({ ...editingScenario, name: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Senaryo Açıklaması</label>
                <textarea
                  rows={2}
                  value={editingScenario.description}
                  onChange={(e) =>
                    setEditingScenario({ ...editingScenario, description: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">
                  Ünite Tipleri, m² ve Satış Fiyatları
                </label>
                <div className="space-y-2.5">
                  {editingScenario.unitTypes.map((unit, idx) => (
                    <div
                      key={unit.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2"
                    >
                      <div>
                        <span className="text-[10px] text-slate-500 block">Ünite Adı</span>
                        <input
                          type="text"
                          value={unit.name}
                          onChange={(e) => {
                            const newTypes = [...editingScenario.unitTypes];
                            newTypes[idx].name = e.target.value;
                            setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Alan Payı (%)</span>
                        <input
                          type="number"
                          value={unit.ratio}
                          onChange={(e) => {
                            const newTypes = [...editingScenario.unitTypes];
                            newTypes[idx].ratio = Number(e.target.value);
                            setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Ort. Brüt m²</span>
                        <input
                          type="number"
                          value={unit.averageGrossM2}
                          onChange={(e) => {
                            const newTypes = [...editingScenario.unitTypes];
                            newTypes[idx].averageGrossM2 = Number(e.target.value);
                            newTypes[idx].averageNetM2 = Math.round(Number(e.target.value) * 0.75);
                            setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Satış TL/m²</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step={1000}
                            value={unit.unitSalesPricePerM2}
                            onChange={(e) => {
                              const newTypes = [...editingScenario.unitTypes];
                              newTypes[idx].unitSalesPricePerM2 = Number(e.target.value);
                              setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                            }}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-900"
                          />
                          {editingScenario.unitTypes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newTypes = editingScenario.unitTypes.filter((_, i) => i !== idx);
                                setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Presets: 4+1, Villa, Ticari / Dükkan, Ofis */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-500 mb-1.5 font-medium">Hızlı Tip Ekle:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const newTypes = [
                          ...editingScenario.unitTypes,
                          {
                            id: `u_${Date.now()}`,
                            name: '4+1 Lüks Daire',
                            ratio: 15,
                            averageNetM2: 130,
                            averageGrossM2: 170,
                            unitSalesPricePerM2: 70000,
                            color: '#8B5CF6',
                          },
                        ];
                        setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                      }}
                      className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200 cursor-pointer"
                    >
                      + 4+1 Lüks Daire
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newTypes = [
                          ...editingScenario.unitTypes,
                          {
                            id: `u_${Date.now()}`,
                            name: 'Müstakil Villa',
                            ratio: 20,
                            averageNetM2: 200,
                            averageGrossM2: 260,
                            unitSalesPricePerM2: 95000,
                            color: '#EC4899',
                          },
                        ];
                        setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                      }}
                      className="px-2 py-1 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-bold border border-pink-200 cursor-pointer"
                    >
                      + Villa
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newTypes = [
                          ...editingScenario.unitTypes,
                          {
                            id: `u_${Date.now()}`,
                            name: 'Cadde Mağaza / Dükkan',
                            ratio: 15,
                            averageNetM2: 120,
                            averageGrossM2: 150,
                            unitSalesPricePerM2: 120000,
                            color: '#F97316',
                          },
                        ];
                        setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                      }}
                      className="px-2 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 cursor-pointer"
                    >
                      + Ticari Ünite / Dükkan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newTypes = [
                          ...editingScenario.unitTypes,
                          {
                            id: `u_${Date.now()}`,
                            name: 'Ofis / Büro',
                            ratio: 20,
                            averageNetM2: 75,
                            averageGrossM2: 95,
                            unitSalesPricePerM2: 75000,
                            color: '#06B6D4',
                          },
                        ];
                        setEditingScenario({ ...editingScenario, unitTypes: newTypes });
                      }}
                      className="px-2 py-1 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-[10px] font-bold border border-cyan-200 cursor-pointer"
                    >
                      + Ofis / Çalışma Alanı
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingScenario(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateScenario(editingScenario);
                  setEditingScenario(null);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs cursor-pointer"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
