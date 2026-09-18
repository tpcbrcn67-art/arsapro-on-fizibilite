import React from 'react';
import { Sparkles, LogIn, UserPlus, Calculator, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserSession } from '../types/saas';

interface LandingHeroBannerProps {
  session?: UserSession | null;
  onStartFreeFeasibility?: () => void;
  onStartFreeCalculation?: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingHeroBanner: React.FC<LandingHeroBannerProps> = ({
  session,
  onStartFreeFeasibility,
  onStartFreeCalculation,
  onOpenLogin,
  onOpenRegister,
}) => {
  const handleStart = onStartFreeCalculation || onStartFreeFeasibility || (() => {});

  // If already logged in, show a compact welcome banner with user name and quick stats
  if (session && session.isLoggedIn) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700/50">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Profesyonel Gayrimenkul Geliştirme Motoru</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          ARSA &amp; PROJE FİZİBİLİTE
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-normal mb-6 max-w-2xl leading-relaxed">
          Arsanızın proje potansiyelini, tahmini gelirini, inşaat maliyetini ve farklı proje senaryolarını birkaç dakikada analiz edin.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-6">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kayıtsız 1 Ücretsiz Ön Fizibilite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emsal &amp; TAKS Taban Oturumu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>A / B / C Senaryo Karşılaştırması</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Hassasiyet &amp; Stres Analizi</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="hero-start-free-btn"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calculator className="w-4 h-4 text-slate-950" />
            <span>Ücretsiz Fizibilite Başlat</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="hero-login-btn"
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-600/80 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-slate-300" />
            <span>Giriş Yap</span>
          </button>

          <button
            type="button"
            id="hero-register-btn"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 hover:text-white font-semibold text-sm border border-indigo-400/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-300" />
            <span>Kayıt Ol</span>
          </button>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kayıt olmadan sonucu anında görebilirsiniz. Raporu kaydetmek ve PDF almak için ücretsiz hesap oluşturabilirsiniz.</span>
        </div>
      </div>
    </div>
  );
};
