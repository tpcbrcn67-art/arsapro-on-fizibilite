import React, { useState } from 'react';
import {
  Plus,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Folder,
  FolderOpen,
  Users,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Share2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Eye,
} from 'lucide-react';
import { UserSession, BusinessEmployee } from '../types/saas';
import { SavedFeasibility } from '../types/feasibility';
import { formatCurrency, formatM2 } from '../utils/formatters';

interface UserDashboardProps {
  session: UserSession;
  savedFeasibilities: SavedFeasibility[];
  activeFeasibilityId?: string;
  onSelectProject: (project: SavedFeasibility) => void;
  onNewFeasibility: () => void;
  onDeleteProject: (projectId: string) => void;
  onOpenUpgradeModal: () => void;
  onOpenShareModal: (project: SavedFeasibility) => void;
  onOpenTeamModal?: () => void;
  onSwitchEmployeeView?: (employeeId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  session,
  savedFeasibilities,
  activeFeasibilityId,
  onSelectProject,
  onNewFeasibility,
  onDeleteProject,
  onOpenUpgradeModal,
  onOpenShareModal,
  onOpenTeamModal,
  onSwitchEmployeeView,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Determine current employee if business account
  const currentEmp = session.employees?.find((e) => e.id === session.currentEmployeeId);
  const isEmployeeRestricted = session.accountType === 'business' && currentEmp && currentEmp.role === 'employee';

  // Available folders
  const allFolders = ['all', 'Sakarya', 'İstanbul', 'Kocaeli', 'Armutlu'];

  // Filter projects by employee authorization, folder, and search query
  const visibleProjects = savedFeasibilities.filter((p) => {
    // 1. Employee restriction check
    if (isEmployeeRestricted && currentEmp) {
      const allowed = currentEmp.assignedProjectIds || [];
      const hasAccess = allowed.includes('*') || allowed.includes(p.id) || allowed.some(id => p.title.toLowerCase().includes(id.toLowerCase()));
      if (!hasAccess) return false;
    }

    // 2. Folder filter
    if (selectedFolder !== 'all') {
      const pFolder = p.folder || (p.city?.toLowerCase().includes('sakarya') ? 'Sakarya' : p.city?.toLowerCase().includes('istanbul') ? 'İstanbul' : p.city?.toLowerCase().includes('kocaeli') ? 'Kocaeli' : p.title?.toLowerCase().includes('armutlu') ? 'Armutlu' : 'Diğer');
      if (pFolder.toLowerCase() !== selectedFolder.toLowerCase()) {
        return false;
      }
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.district && p.district.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const getStatusBadge = (status?: string) => {
    if (status === 'Tamamlandı') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Tamamlandı</span>
        </span>
      );
    }
    if (status === 'Taslak') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3" />
          <span>Taslak</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        <Sparkles className="w-3 h-3" />
        <span>İnceleniyor</span>
      </span>
    );
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'Kurumsal & Ekip';
      case 'pro':
        return 'Profesyonel Plan';
      case 'starter':
        return 'Başlangıç Planı';
      default:
        return 'Ücretsiz Deneme';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Welcome Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              {session.accountType === 'business' ? '🏢 Kurumsal Çalışma Alanı' : '👤 Bireysel Kullanıcı Paneli'}
            </span>
            {session.accountType === 'business' && currentEmp && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                • Aktif Rol: <strong>{currentEmp.name}</strong>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Merhaba, {session.displayName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {session.accountType === 'business'
              ? `${session.businessProfile?.companyName || 'Şirket'} bünyesindeki tüm arsa geliştirme ve fizibilite portföyünüz.`
              : 'Kayıtlı fizibilite çalışmalarınızı inceleyin, yeni arsa senaryoları oluşturun.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {session.accountType === 'business' && session.employees && session.employees.length > 1 && onSwitchEmployeeView && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <span className="text-slate-500 text-[11px] font-medium">Görünüm:</span>
              <select
                value={session.currentEmployeeId || ''}
                onChange={(e) => onSwitchEmployeeView(e.target.value)}
                className="bg-white text-xs font-semibold py-1 px-2 rounded-lg border border-slate-200 focus:outline-hidden"
              >
                {session.employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role === 'owner' ? 'Tüm Projeler' : 'Atanan Projeler'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            id="dash-new-feasibility-btn"
            onClick={onNewFeasibility}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Fizibilite +</span>
          </button>
        </div>
      </div>

      {/* 2. Usage & Quota Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-[11px] font-medium flex items-center justify-between">
            <span>Toplam Fizibilite</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {savedFeasibilities.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sistemde kayıtlı proje</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-[11px] font-medium flex items-center justify-between">
            <span>Bu Ay Kullanılan Hak</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {session.usedCountThisMonth}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Fizibilite sorgusu yapıldı</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-[11px] font-medium flex items-center justify-between">
            <span>Kalan Hak / Kredi</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {session.plan === 'pro' || session.plan === 'enterprise' ? 'Sınırsız' : Math.max(0, session.monthlyLimit - session.usedCountThisMonth)}
            {session.creditBalance > 0 && (
              <span className="text-xs text-amber-600 font-bold ml-1.5">(+{session.creditBalance} Kredi)</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Mevcut dönem bakiyesi</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-[11px] font-medium flex items-center justify-between">
            <span>Aktif Paket</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-black text-slate-900 mt-1 truncate">
            {getPlanLabel(session.plan)}
          </div>
          <button
            type="button"
            onClick={onOpenUpgradeModal}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline mt-0.5 cursor-pointer"
          >
            Paketi Yükselt / Kredi Al
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-slate-500 text-[11px] font-medium flex items-center justify-between">
            <span>Yenileme Tarihi</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-black text-slate-900 mt-1">
            {session.renewalDate}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Otomatik döngü</div>
        </div>
      </div>

      {/* 3. Folder Navigation & Search */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>Son Çalışmalar &amp; Proje Arşivi</span>
            </h2>
            <p className="text-xs text-slate-500">
              Detaylı hesaplama ve senaryo karşılaştırması yapmak için projeye tıklayın.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Proje veya il/ilçe ara..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Folder tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Folder className="w-3.5 h-3.5" />
            <span>Klasörler:</span>
          </span>
          {allFolders.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedFolder === f
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? '📁 Tüm Projeler' : `📁 ${f}`}
            </button>
          ))}
        </div>

        {/* Employee authorization notice if restricted */}
        {isEmployeeRestricted && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>
                <strong>{currentEmp?.name}</strong> rolündesiniz. Sadece şirketin size yetki verdiği projeleri görüntülüyorsunuz.
              </span>
            </div>
            {onSwitchEmployeeView && (
              <button
                type="button"
                onClick={() => onSwitchEmployeeView('emp_ahmet')}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
              >
                Yönetici Görünümüne Geç
              </button>
            )}
          </div>
        )}

        {/* 4. Projects Table */}
        {visibleProjects.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <Folder className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Bu kriterde kayıtlı proje bulunamadı.</p>
            <p className="text-slate-400 mt-1">Yukarıdaki &quot;Yeni Fizibilite +&quot; butonuna basarak ilk projenizi ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  <th className="py-3 px-3 font-bold">Proje Adı</th>
                  <th className="py-3 px-3 font-bold">Konum / Ada-Parsel</th>
                  <th className="py-3 px-3 font-bold">Arsa Alanı</th>
                  <th className="py-3 px-3 font-bold">Emsal (KAKS)</th>
                  <th className="py-3 px-3 font-bold">Tahmini Ciro</th>
                  <th className="py-3 px-3 font-bold">Net Kâr / Marj</th>
                  <th className="py-3 px-3 font-bold">Durum</th>
                  <th className="py-3 px-3 font-bold">Tarih</th>
                  <th className="py-3 px-3 text-right font-bold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleProjects.map((proj) => {
                  const isActive = activeFeasibilityId === proj.id;
                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isActive ? 'bg-emerald-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => onSelectProject(proj)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{proj.title}</span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white font-semibold">
                              Aktif
                            </span>
                          )}
                        </button>
                        <div className="text-[10px] text-slate-400">
                          {proj.folder ? `Klasör: ${proj.folder}` : 'Genel Portföy'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{proj.city ? `${proj.city}, ${proj.district}` : 'Türkiye'}</div>
                        {(proj.ada || proj.parsel) && (
                          <div className="text-[10px] text-slate-400">
                            Ada: {proj.ada || '-'} / Parsel: {proj.parsel || '-'}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {formatM2(proj.landAreaM2)}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {proj.kaks.toFixed(2)} (TAKS: {proj.taks ? proj.taks.toFixed(2) : '0.40'})
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatCurrency(proj.totalRevenue)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-700">
                          {formatCurrency(proj.netProfit)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Marj: %{proj.profitMargin ? proj.profitMargin.toFixed(1) : '25.0'}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(proj.status)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {proj.createdAt}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            title="Çalışma Alanında Aç"
                            onClick={() => onSelectProject(proj)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Projeyi Paylaş (Link)"
                            onClick={() => onOpenShareModal(proj)}
                            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Sil"
                            onClick={() => onDeleteProject(proj.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
