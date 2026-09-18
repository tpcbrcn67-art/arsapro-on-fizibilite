import React from 'react';
import {
  Building2,
  Printer,
  RotateCcw,
  Layers,
  Plus,
  Crown,
  Archive,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { LandPreset, landPresets } from '../data/defaultScenarios';
import { UserSubscription } from '../types/feasibility';
import { UserSession } from '../types/saas';

interface NavbarProps {
  currentPresetId: string;
  onSelectPreset: (preset: LandPreset) => void;
  onReset: () => void;
  onOpenReport: () => void;
  onOpenNewFeasibility: () => void;
  onOpenPlanModal: () => void;
  onOpenArchive: () => void;
  subscription: UserSubscription;
  session: UserSession | null;
  currentView: 'calculator' | 'dashboard';
  onSwitchView: (view: 'calculator' | 'dashboard') => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPresetId,
  onSelectPreset,
  onReset,
  onOpenReport,
  onOpenNewFeasibility,
  onOpenPlanModal,
  onOpenArchive,
  subscription,
  session,
  currentView,
  onSwitchView,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
}) => {
  const isLoggedIn = session && session.isLoggedIn;
  const remainingFree = session
    ? session.plan === 'pro' || session.plan === 'enterprise'
      ? 'Sınırsız'
      : Math.max(0, session.monthlyLimit - session.usedCountThisMonth)
    : Math.max(0, subscription.monthlyLimit - subscription.usedCountThisMonth);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSwitchView('calculator')}
              className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSwitchView('calculator')}
                  className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>ARSAPRO</span>
                  <span className="text-slate-400 font-normal text-sm">–</span>
                  <span className="text-emerald-700 font-extrabold text-base">Ön Fizibilite</span>
                </button>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  SaaS Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Arsa potansiyeli • İnşaat maliyeti • Senaryolar ve kârlılık
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & SaaS Plan / Quota */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dashboard / Workspace View Toggle */}
          {isLoggedIn ? (
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                id="nav-calc-toggle"
                onClick={() => onSwitchView('calculator')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'calculator'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Çalışma Alanı
              </button>
              <button
                type="button"
                id="nav-dash-toggle"
                onClick={() => onSwitchView('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Kullanıcı Paneli</span>
              </button>
            </div>
          ) : null}

          {/* New Feasibility Button */}
          <button
            id="navbar-new-feasibility-btn"
            type="button"
            onClick={onOpenNewFeasibility}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Fizibilite</span>
          </button>

          {/* Subscription / Quota Button */}
          <button
            id="navbar-plan-badge-btn"
            type="button"
            onClick={onOpenPlanModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              session?.plan === 'pro' || session?.plan === 'enterprise'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-amber-50/70 border-amber-200 text-amber-900 hover:bg-amber-100'
            }`}
            title="Üyelik planınızı yönetin veya paket yükseltin"
          >
            {session?.plan === 'pro' || session?.plan === 'enterprise' ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>{session.plan === 'enterprise' ? 'Kurumsal Ekip' : 'Pro (Sınırsız)'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{remainingFree} Hak Kalan</span>
              </>
            )}
          </button>

          {/* Preset Selector in Workspace mode */}
          {currentView === 'calculator' && (
            <div className="hidden xl:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <select
                id="preset-selector-dropdown"
                value={currentPresetId}
                onChange={(e) => {
                  const found = landPresets.find((p) => p.id === e.target.value);
                  if (found) onSelectPreset(found);
                }}
                className="bg-transparent border-0 text-slate-800 font-medium focus:ring-0 text-xs py-0.5 pr-5 cursor-pointer"
              >
                {landPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Report Button in Workspace mode */}
          {currentView === 'calculator' && (
            <button
              id="open-report-btn"
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF Rapor</span>
            </button>
          )}

          {/* Admin Panel Button */}
          <button
            id="nav-admin-btn"
            type="button"
            onClick={onOpenAdmin}
            title="Süper Admin Paneli"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Auth State Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                onClick={() => onSwitchView('dashboard')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">
                  {session.displayName.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{session.displayName}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                title="Çıkış Yap"
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Kayıt Ol
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
