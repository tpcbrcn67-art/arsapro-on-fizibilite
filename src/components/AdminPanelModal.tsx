import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Users,
  Layers,
  CreditCard,
  Settings,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Save,
  Trash2,
  RefreshCw,
  Building2,
  User,
  Flame,
  Sparkles,
  Tag,
  Percent,
} from 'lucide-react';
import {
  AdminSystemSettings,
  PaymentTransaction,
  SubscriptionPlan,
} from '../types/saas';
import { SavedFeasibility } from '../types/feasibility';
import { formatCurrency, formatM2 } from '../utils/formatters';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSystemSettings;
  onUpdateAdminSettings: (newSettings: AdminSystemSettings) => void;
  allProjects: SavedFeasibility[];
  transactions: PaymentTransaction[];
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  adminSettings,
  onUpdateAdminSettings,
  allProjects,
  transactions,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'plans' | 'payments' | 'settings'>('users');
  const [localSettings, setLocalSettings] = useState<AdminSystemSettings>(adminSettings);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Mock list of registered platform users for admin view
  const [mockUsers, setMockUsers] = useState([
    {
      id: 'usr_1',
      name: 'Burçin Topçu',
      email: 'tpcbrcn67@gmail.com',
      type: 'Bireysel',
      plan: 'Profesyonel',
      status: 'Aktif',
      registeredAt: '2026-08-15',
      lastLogin: '19.09.2026 14:10',
      usedCount: 4,
    },
    {
      id: 'biz_1',
      name: 'Harun Elmalı Global Yatırım İnşaat A.Ş.',
      email: 'iletisim@harunelmali.com.tr',
      type: 'İşletme',
      plan: 'Kurumsal & Ekip',
      status: 'Aktif',
      registeredAt: '2026-06-01',
      lastLogin: '19.09.2026 16:00',
      usedCount: 12,
    },
    {
      id: 'usr_2',
      name: 'Kemal Öztürk (Müteahhit)',
      email: 'kemal.ozturk@inşaat.com',
      type: 'Bireysel',
      plan: 'Başlangıç',
      status: 'Aktif',
      registeredAt: '2026-09-02',
      lastLogin: '18.09.2026 11:20',
      usedCount: 7,
    },
    {
      id: 'usr_3',
      name: 'Selin Yıldırım',
      email: 'selin@yildirimholding.com',
      type: 'İşletme',
      plan: 'Ücretsiz Deneme',
      status: 'Aktif',
      registeredAt: '2026-09-17',
      lastLogin: '18.09.2026 19:45',
      usedCount: 1,
    },
  ]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    onUpdateAdminSettings(localSettings);
    setSaveNotification('Sistem ayarları ve paket fiyatları başarıyla kaydedildi!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const toggleUserStatus = (userId: string) => {
    setMockUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Aktif' ? 'Pasif' : 'Aktif' }
          : u
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">ARSAPRO Sistem Yönetici Paneli</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  Süper Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kullanıcılar, tüm fizibiliteler, dinamik fiyatlandırma, ödemeler ve varsayılan sistem değerleri
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto px-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcılar ({mockUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fizibiliteler ({allProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Üyelikler &amp; Fiyatlar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Ödemeler ({transactions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sistem Ayarları</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {saveNotification && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveNotification}</span>
            </div>
          )}

          {/* TAB 1: KULLANICILAR */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">Platform Kullanıcı Listesi</h3>
                <span className="text-xs text-slate-500">Bireysel ve Kurumsal Müşteriler</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Kullanıcı / Şirket</th>
                      <th className="py-2.5 px-3">Hesap Türü</th>
                      <th className="py-2.5 px-3">Aktif Paket</th>
                      <th className="py-2.5 px-3">Kullanım</th>
                      <th className="py-2.5 px-3">Kayıt Tarihi</th>
                      <th className="py-2.5 px-3">Son Giriş</th>
                      <th className="py-2.5 px-3">Durum</th>
                      <th className="py-2.5 px-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            u.type === 'İşletme' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.type === 'İşletme' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            <span>{u.type}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {u.plan}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {u.usedCount} fizibilite
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {u.registeredAt}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {u.lastLogin}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u.id)}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                          >
                            {u.status === 'Aktif' ? 'Pasife Al' : 'Aktifleştir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: TÜM FİZİBİLİTELER */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">Sistemdeki Tüm Proje Fizibiliteleri</h3>
                <span className="text-xs text-slate-500">Toplam {allProjects.length} çalışma</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Proje Başlığı</th>
                      <th className="py-2.5 px-3">Lokasyon</th>
                      <th className="py-2.5 px-3">Arsa m²</th>
                      <th className="py-2.5 px-3">Emsal</th>
                      <th className="py-2.5 px-3">Ciro</th>
                      <th className="py-2.5 px-3">Net Kâr</th>
                      <th className="py-2.5 px-3">Marj</th>
                      <th className="py-2.5 px-3">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {p.title}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {p.city ? `${p.city}, ${p.district}` : 'Türkiye'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {formatM2(p.landAreaM2)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {p.kaks.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {formatCurrency(p.totalRevenue)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">
                          {formatCurrency(p.netProfit)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-semibold">
                          %{p.profitMargin ? p.profitMargin.toFixed(1) : '25.0'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {p.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ÜYELİKLER & FİYATLAR & KAMPANYA YÖNETİMİ */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Paket &amp; Kampanya Fiyatlandırma Yönetimi</h3>
                  <p className="text-xs text-slate-500">
                    Aylık ve yıllık paket fiyatları, indirim oranları ve özel kampanyalar buradan anında güncellenir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Değişiklikleri Sisteme Kaydet</span>
                </button>
              </div>

              {/* SECTION: PROMOTIONAL CAMPAIGN MANAGER */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border-2 border-amber-300/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>Dönemsel Satış Kampanyası Yönetimi</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                            localSettings.campaign?.isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {localSettings.campaign?.isActive ? 'Aktif Kampanya Yayında' : 'Kampanya Pasif'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Lansman, kuruluş veya bayram indirimlerini tüm arayüzde tek tıkla devreye alın.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const current = localSettings.campaign || {
                        isActive: false,
                        title: 'Kuruluş fırsatı – İlk yıl %30 indirim',
                        badgeText: '🔥 KURULUŞ FIRSATI',
                        discountPercent: 30,
                        appliesTo: 'annual_only',
                        endDate: '31 Ekim 2026',
                        description: 'İlk 100 kurucu üyeye özel tüm yıllık paketlerde net %30 ek avantaj.',
                      };
                      setLocalSettings({
                        ...localSettings,
                        campaign: {
                          ...current,
                          isActive: !current.isActive,
                        },
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                      localSettings.campaign?.isActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {localSettings.campaign?.isActive ? 'Kampanyayı Durdur' : 'Kampanyayı Başlat / Yayınla'}
                    </span>
                  </button>
                </div>

                {/* Campaign Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kampanya Başlığı (Slogan):
                    </label>
                    <input
                      type="text"
                      value={localSettings.campaign?.title || 'Kuruluş fırsatı – İlk yıl %30 indirim'}
                      onChange={(e) => {
                        setLocalSettings({
                          ...localSettings,
                          campaign: {
                            ...(localSettings.campaign || {
                              isActive: false,
                              badgeText: '🔥 KURULUŞ FIRSATI',
                              discountPercent: 30,
                              appliesTo: 'annual_only',
                            }),
                            title: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      İndirim Oranı (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={localSettings.campaign?.discountPercent ?? 30}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLocalSettings({
                            ...localSettings,
                            campaign: {
                              ...(localSettings.campaign || {
                                isActive: false,
                                title: 'Kuruluş fırsatı – İlk yıl %30 indirim',
                                badgeText: '🔥 KURULUŞ FIRSATI',
                                appliesTo: 'annual_only',
                              }),
                              discountPercent: val,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 pr-7"
                      />
                      <span className="absolute right-2.5 top-1.5 text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kapsam:
                    </label>
                    <select
                      value={localSettings.campaign?.appliesTo || 'annual_only'}
                      onChange={(e) => {
                        setLocalSettings({
                          ...localSettings,
                          campaign: {
                            ...(localSettings.campaign || {
                              isActive: false,
                              title: 'Kuruluş fırsatı – İlk yıl %30 indirim',
                              badgeText: '🔥 KURULUŞ FIRSATI',
                              discountPercent: 30,
                            }),
                            appliesTo: e.target.value as any,
                          },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                    >
                      <option value="annual_only">Sadece Yıllık Paketlerde</option>
                      <option value="all">Tüm Paketlerde (Aylık &amp; Yıllık)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Son Geçerlilik Tarihi:
                    </label>
                    <input
                      type="text"
                      value={localSettings.campaign?.endDate || '31 Ekim 2026'}
                      onChange={(e) => {
                        setLocalSettings({
                          ...localSettings,
                          campaign: {
                            ...(localSettings.campaign || {
                              isActive: false,
                              title: 'Kuruluş fırsatı – İlk yıl %30 indirim',
                              badgeText: '🔥 KURULUŞ FIRSATI',
                              discountPercent: 30,
                              appliesTo: 'annual_only',
                            }),
                            endDate: e.target.value,
                          },
                        });
                      }}
                      placeholder="Örn: 31 Ekim 2026"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Live simulation cards preview */}
                <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs">
                  <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kampanya Açıldığında Oluşacak İndirimli Yıllık Fiyat Simülasyonu:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['starter', 'pro', 'enterprise'] as SubscriptionPlan[]).map((pk) => {
                      const pl = localSettings.plans[pk];
                      const disc = localSettings.campaign?.discountPercent ?? 30;
                      const discountedAnnual = Math.round(pl.priceAnnualTL * (1 - disc / 100));
                      return (
                        <div key={pk} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="font-bold text-slate-800 text-[11px]">{pl.title}</div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-slate-400 line-through text-[11px]">
                              {formatCurrency(pl.priceAnnualTL)}
                            </span>
                            <span className="text-emerald-700 font-extrabold text-xs">
                              {formatCurrency(discountedAnnual)} / yıl
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ~{formatCurrency(Math.round(discountedAnnual / 12))} / ay
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION: PLAN CARDS EDITOR */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Ana Paket Fiyatları ve Parametreleri
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    💡 İpucu: Yıllık paketler 12 ay peşin olarak hesaplanır; yaklaşık 3 ay ücretsiz avantajı sağlar.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['starter', 'pro', 'enterprise'] as SubscriptionPlan[]).map((planKey) => {
                    const plan = localSettings.plans[planKey];
                    const annual12MonthsRegular = plan.priceMonthlyTL * 12;
                    const computedSavings = annual12MonthsRegular - plan.priceAnnualTL;

                    return (
                      <div
                        key={planKey}
                        className={`p-4 border-2 rounded-2xl bg-white space-y-3 shadow-xs ${
                          planKey === 'pro' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                              <span>{planKey === 'starter' ? '👤' : planKey === 'pro' ? '🏢' : '🏗️'}</span>
                              <span>{plan.title}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">{plan.subtitle || planKey}</div>
                          </div>
                          {plan.recommendedBadge && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold uppercase">
                              {plan.recommendedBadge}
                            </span>
                          )}
                        </div>

                        {/* Title & Badge Edit */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Paket Adı:
                            </label>
                            <input
                              type="text"
                              value={plan.title}
                              onChange={(e) => {
                                setLocalSettings({
                                  ...localSettings,
                                  plans: {
                                    ...localSettings.plans,
                                    [planKey]: { ...plan, title: e.target.value },
                                  },
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-bold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Rozet Metni:
                            </label>
                            <input
                              type="text"
                              value={plan.recommendedBadge || ''}
                              placeholder="Örn: En Çok Tercih Edilen"
                              onChange={(e) => {
                                setLocalSettings({
                                  ...localSettings,
                                  plans: {
                                    ...localSettings.plans,
                                    [planKey]: { ...plan, recommendedBadge: e.target.value || undefined },
                                  },
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md text-slate-900"
                            />
                          </div>
                        </div>

                        {/* Monthly Price */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Aylık Fiyat (TL/Ay):
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={plan.priceMonthlyTL}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const newAnnualSavings = val * 12 - plan.priceAnnualTL;
                                setLocalSettings({
                                  ...localSettings,
                                  plans: {
                                    ...localSettings.plans,
                                    [planKey]: {
                                      ...plan,
                                      priceMonthlyTL: val,
                                      annualSavingsTL: newAnnualSavings > 0 ? newAnnualSavings : 0,
                                    },
                                  },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-black text-slate-900 pr-8"
                            />
                            <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-bold">TL</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            12 Aylık Toplam: {formatCurrency(annual12MonthsRegular)}
                          </div>
                        </div>

                        {/* Annual Price */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Yıllık Peşin Fiyat (TL/Yıl):
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={plan.priceAnnualTL}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const newAnnualMonthly = Math.round(val / 12);
                                const newAnnualSavings = plan.priceMonthlyTL * 12 - val;
                                setLocalSettings({
                                  ...localSettings,
                                  plans: {
                                    ...localSettings.plans,
                                    [planKey]: {
                                      ...plan,
                                      priceAnnualTL: val,
                                      priceAnnualMonthlyTL: newAnnualMonthly,
                                      annualSavingsTL: newAnnualSavings > 0 ? newAnnualSavings : 0,
                                    },
                                  },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-black text-emerald-800 pr-8"
                            />
                            <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-bold">TL</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Aya düşen: ~{formatCurrency(Math.round(plan.priceAnnualTL / 12))} / ay
                          </div>
                        </div>

                        {/* Computed Savings Alert */}
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center justify-between">
                          <span>Yıllık Tasarruf:</span>
                          <span className="text-xs font-black">
                            {formatCurrency(computedSavings)}
                          </span>
                        </div>

                        {/* Feasibility Limit */}
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            Aylık Fizibilite Limiti (Adet):
                          </label>
                          <input
                            type="number"
                            value={plan.monthlyFeasibilityLimit}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setLocalSettings({
                                ...localSettings,
                                plans: {
                                  ...localSettings.plans,
                                  [planKey]: { ...plan, monthlyFeasibilityLimit: val },
                                },
                              });
                            }}
                            className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                          />
                          <span className="text-[9px] text-slate-400">9999 = Sınırsız analiz</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Credit Packs Editor (10. Madde) */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Kredi Paketleri (Aboneliksiz Tek Seferlik Satış)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {localSettings.creditPacks.map((pack, idx) => (
                    <div key={pack.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-xs text-slate-900">
                        {pack.credits} Fizibilite Kredisi
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Paket Fiyatı (TL):</label>
                        <input
                          type="number"
                          value={pack.priceTL}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...localSettings.creditPacks];
                            updated[idx] = {
                              ...pack,
                              priceTL: val,
                              unitPriceTL: Math.round(val / pack.credits),
                            };
                            setLocalSettings({ ...localSettings, creditPacks: updated });
                          }}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Birim: {pack.unitPriceTL} TL / kredi
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ÖDEMELER */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">Finans ve Tahsilat Kayıtları</h3>
                <span className="text-xs text-slate-500">Başarılı, İade ve Bekleyen İşlemler</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Tarih</th>
                      <th className="py-2.5 px-3">Müşteri</th>
                      <th className="py-2.5 px-3">Hizmet / Paket</th>
                      <th className="py-2.5 px-3">Tutar</th>
                      <th className="py-2.5 px-3">Ödeme Yolu</th>
                      <th className="py-2.5 px-3">Fatura No</th>
                      <th className="py-2.5 px-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {tx.date.substring(0, 10)}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {tx.userName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {tx.itemTitle}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {formatCurrency(tx.amountTL)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-700">
                          {tx.invoiceNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {tx.status === 'success' ? 'Başarılı' : tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SİSTEM AYARLARI */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sistem Varsayılan Hesaplama Parametreleri</h3>
                  <p className="text-xs text-slate-500">
                    Yeni oluşturulan tüm fizibilitelerde otomatik olarak bu standart piyasa verileri kullanılır.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Sistem Parametrelerini Güncelle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Varsayılan İnşaat Metrekare Maliyeti (TL/m²)
                  </label>
                  <input
                    type="number"
                    step={500}
                    value={localSettings.defaultConstructionCostPerM2}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        defaultConstructionCostPerM2: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    Çevre ve Şehircilik Bakanlığı / TMB güncel piyasa ortalaması (ör. 30.000 TL/m²).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Varsayılan Emsal Dışı Alan Katsayısı (%):
                  </label>
                  <input
                    type="number"
                    step={1}
                    value={localSettings.defaultNonFarAreaRatio}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        defaultNonFarAreaRatio: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    Bodrum kat otoparklar, yangın holleri, sığınak ve teknik hacimler varsayımı (ör. %30).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Varsayılan Net/Brüt Verimlilik Oranı (%):
                  </label>
                  <input
                    type="number"
                    step={1}
                    value={localSettings.defaultSalesEfficiencyPercent}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        defaultSalesEfficiencyPercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    Bağımsız bölüm net alanının brüt alana oranı (ör. %75).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Varsayılan Ruhsat, Mimari &amp; Statik Proje Gideri (%):
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={localSettings.defaultPermitFeePercent}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        defaultPermitFeePercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    İnşaat maliyetine oranlanan proje ve resmi harç payı (ör. %3.5).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
