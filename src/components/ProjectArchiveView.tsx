import React, { useState } from 'react';
import {
  Archive,
  Search,
  Plus,
  Trash2,
  FolderOpen,
  Building2,
  MapPin,
  TrendingUp,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import { SavedFeasibility, UserSubscription } from '../types/feasibility';
import { formatCurrencyTL, formatArea, formatPercent } from '../utils/formatters';

interface ProjectArchiveViewProps {
  savedProjects: SavedFeasibility[];
  subscription: UserSubscription;
  onLoadProject: (project: SavedFeasibility) => void;
  onDeleteProject: (projectId: string) => void;
  onSaveCurrentProject: () => void;
  onOpenNewFeasibility: () => void;
  onOpenReport: () => void;
  onUpgradePrompt: () => void;
}

export const ProjectArchiveView: React.FC<ProjectArchiveViewProps> = ({
  savedProjects,
  subscription,
  onLoadProject,
  onDeleteProject,
  onSaveCurrentProject,
  onOpenNewFeasibility,
  onOpenReport,
  onUpgradePrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Archive Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Archive className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Proje Arşivi</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {savedProjects.length} Kayıtlı Fizibilite
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Daha önce çalıştığınız arsa fizibilitelerini inceleyin, güncelleyin veya yeni senaryolar türetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onSaveCurrentProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mevcut Analizi Arşive Kaydet</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewFeasibility}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Fizibilite Oluştur</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Proje, il veya ilçe ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </div>

        {subscription.plan === 'free' && (
          <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>
              Ücretsiz planda son projeleriniz yerel hafızada saklanır.{' '}
              <button
                type="button"
                onClick={onUpgradePrompt}
                className="font-bold underline cursor-pointer hover:text-amber-950"
              >
                Bulut senkronizasyonu için Pro'ya geçin →
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Project Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Archive className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">Henüz Kayıtlı Fizibilite Yok</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Arsa bilgilerinizi girip yeni bir hesaplama yapabilir veya mevcut çalışma ekranındaki verileri arşivinize kaydedebilirsiniz.
          </p>
          <button
            type="button"
            onClick={onOpenNewFeasibility}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>İlk Fizibiliteyi Başlat</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>
                      {proj.city} / {proj.district}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      proj.suitabilityScore === 'Çok Uygun'
                        ? 'bg-emerald-100 text-emerald-800'
                        : proj.suitabilityScore === 'Uygun'
                        ? 'bg-blue-100 text-blue-800'
                        : proj.suitabilityScore === 'Dengeli'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {proj.suitabilityScore}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  {proj.title}
                </h3>

                <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Arsa Alanı</span>
                    <strong className="text-slate-800 font-semibold">{formatArea(proj.landAreaM2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Emsal / TAKS</span>
                    <strong className="text-slate-800 font-semibold">{proj.kaks.toFixed(2)} / {proj.taks.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Edinim</span>
                    <strong className="text-slate-800 font-semibold">
                      {proj.acquisitionType === 'cash'
                        ? 'Nakit'
                        : proj.acquisitionType === 'flat_for_land'
                        ? `%${proj.landOwnerSharePercent} Kat K.`
                        : `%${proj.revenueSharePercent} Hasılat`}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tahmini Ciro:</span>
                    <span className="font-bold text-slate-900">{formatCurrencyTL(proj.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tahmini Net Kâr:</span>
                    <span className="font-extrabold text-emerald-700">{formatCurrencyTL(proj.netProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kâr Marjı / ROI:</span>
                    <span className="font-semibold text-slate-800">
                      {formatPercent(proj.profitMargin)} • ROI: {formatPercent(proj.roiOnCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(proj.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj.id)}
                    title="Arşivden Sil"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadProject(proj)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors cursor-pointer text-xs"
                  >
                    <span>Projeyi Aç</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
