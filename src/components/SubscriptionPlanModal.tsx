import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Sparkles,
  Tag,
  Users,
  Briefcase,
  User,
} from 'lucide-react';
import { UserSubscription, UserPlan } from '../types/feasibility';
import { PlanConfig, SubscriptionPlan, PromotionalCampaign } from '../types/saas';
import { formatCurrency } from '../utils/formatters';

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  plans?: Record<SubscriptionPlan, PlanConfig>;
  campaign?: PromotionalCampaign;
  onSetPlan: (plan: UserPlan, billingCycle?: 'monthly' | 'annual') => void;
}

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  onClose,
  subscription,
  plans,
  campaign,
  onSetPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');

  if (!isOpen) return null;

  const planKeys: SubscriptionPlan[] = ['free', 'starter', 'pro', 'enterprise'];

  // Plan visual theme and icons
  const planMeta: Record<
    SubscriptionPlan,
    {
      icon: any;
      accentBg: string;
      accentText: string;
      borderClass: string;
      cardBg: string;
    }
  > = {
    free: {
      icon: User,
      accentBg: 'bg-slate-100',
      accentText: 'text-slate-700',
      borderClass: 'border-slate-200 hover:border-slate-300',
      cardBg: 'bg-white',
    },
    starter: {
      icon: User,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-700',
      borderClass: 'border-blue-200 hover:border-blue-400',
      cardBg: 'bg-white',
    },
    pro: {
      icon: Briefcase,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-700',
      borderClass: 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20',
      cardBg: 'bg-gradient-to-b from-emerald-50/30 to-white',
    },
    enterprise: {
      icon: Building2,
      accentBg: 'bg-indigo-50',
      accentText: 'text-indigo-700',
      borderClass: 'border-indigo-300 hover:border-indigo-400',
      cardBg: 'bg-white',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full my-6 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  ARSAPRO Abonelik & Paket Seçenekleri
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                  SaaS Çözümleri
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arsa sahipleri, proje geliştiriciler, emlak ofisleri ve müteahhitler için ölçeklenebilir planlar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Banner (if active) */}
        {campaign && campaign.isActive && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2 py-0.5 rounded-md bg-black/20 text-[10px] font-extrabold uppercase tracking-wide">
                {campaign.badgeText || 'ÖZEL FIRSAT'}
              </span>
              <span>{campaign.title}</span>
            </div>
            <div className="text-[11px] font-medium text-amber-100 flex items-center gap-1.5">
              <span>Yıllık alımlarda ek %{campaign.discountPercent} tasarruf!</span>
              {campaign.endDate && (
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                  Son Gün: {campaign.endDate}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6">
          {/* Billing Cycle Toggle & Current Status Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Mevcut Planınız:{' '}
                <strong className="text-slate-900 capitalize font-bold">
                  {subscription.plan === 'pro'
                    ? '🏢 İşletme (Pro)'
                    : subscription.plan === 'starter'
                    ? '👤 Kişisel'
                    : subscription.plan === 'enterprise'
                    ? '🏗️ Kurumsal'
                    : '🆓 Ücretsiz'}
                </strong>
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">
                Kullanım: <strong>{subscription.usedCountThisMonth}</strong> /{' '}
                {subscription.monthlyLimit >= 9999 ? 'Sınırsız' : subscription.monthlyLimit} fizibilite
              </span>
            </div>

            {/* Toggle: Monthly vs Annual */}
            <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Yıllık Ödeme (3 Ay Ücretsiz!)</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (4 Plans: Ücretsiz, Kişisel, İşletme, Kurumsal) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {planKeys.map((key) => {
              const p = plans ? plans[key] : null;
              if (!p) return null;

              const meta = planMeta[key];
              const isCurrent = subscription.plan === key;
              const isRecommended = key === 'pro'; // "En Çok Tercih Edilen" goes to İşletme

              // Price calculations with potential campaign discount
              let displayAnnualTL = p.priceAnnualTL;
              let displayMonthlyTL = p.priceMonthlyTL;
              let hasCampaignDiscount = false;

              if (campaign?.isActive && p.priceMonthlyTL > 0) {
                if (campaign.appliesTo === 'annual_only' || campaign.appliesTo === 'all') {
                  const discountFactor = 1 - campaign.discountPercent / 100;
                  displayAnnualTL = Math.round(p.priceAnnualTL * discountFactor);
                  hasCampaignDiscount = true;
                }
              }

              // Monthly cost equivalent when paying annually
              const effectiveMonthlyFromAnnual =
                displayAnnualTL > 0 ? Math.round(displayAnnualTL / 12) : 0;

              // Savings calculation: 12 * Monthly - Annual
              const annualSavings =
                p.priceMonthlyTL > 0 ? p.priceMonthlyTL * 12 - displayAnnualTL : 0;

              return (
                <div
                  key={key}
                  className={`rounded-2xl border-2 flex flex-col justify-between p-5 relative transition-all duration-200 ${
                    meta.cardBg
                  } ${meta.borderClass} ${
                    isRecommended ? 'shadow-lg border-emerald-500 transform lg:-translate-y-1' : ''
                  }`}
                >
                  {/* Top Badge */}
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{p.recommendedBadge || 'En Çok Tercih Edilen'}</span>
                    </div>
                  )}

                  <div>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1.5 rounded-lg ${meta.accentBg} ${meta.accentText}`}>
                          <meta.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {p.subtitle || key}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white">
                          Mevcut
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-1">
                      {key === 'free' && '🆓'}
                      {key === 'starter' && '👤'}
                      {key === 'pro' && '🏢'}
                      {key === 'enterprise' && '🏗️'}
                      <span>{p.title}</span>
                    </h3>
                    <p className="text-xs text-slate-500 min-h-[34px] leading-relaxed mb-4">
                      {p.description}
                    </p>

                    {/* Price Area */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 space-y-1.5">
                      {billingCycle === 'annual' ? (
                        key === 'free' ? (
                          <div>
                            <div className="text-2xl font-black text-slate-900">0 TL</div>
                            <div className="text-[11px] text-slate-500">Ücretsiz Başlangıç</div>
                          </div>
                        ) : (
                          <div>
                            {/* Annual Price */}
                            <div className="flex items-baseline gap-1.5">
                              {hasCampaignDiscount && (
                                <span className="text-sm font-semibold text-slate-400 line-through">
                                  {formatCurrency(p.priceAnnualTL)}
                                </span>
                              )}
                              <span className="text-2xl font-black text-slate-900">
                                {formatCurrency(displayAnnualTL)}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">/ yıl</span>
                            </div>

                            {/* Monthly breakdown */}
                            <div className="text-xs font-bold text-slate-700 mt-1">
                              {formatCurrency(effectiveMonthlyFromAnnual)}
                              <span className="font-normal text-slate-500 text-[11px]"> / ay</span>
                            </div>

                            {/* Annual Savings Badge requested by user */}
                            {annualSavings > 0 && (
                              <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-1 rounded-lg flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Yıllık ödemede {formatCurrency(annualSavings)} tasarruf</span>
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Yaklaşık 3 ay ücretsiz avantajı
                            </div>
                          </div>
                        )
                      ) : (
                        /* Monthly Cycle Display */
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">
                              {formatCurrency(displayMonthlyTL)}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">/ ay</span>
                          </div>
                          {p.priceMonthlyTL > 0 && (
                            <div className="text-[11px] text-slate-500 mt-1">
                              Yıllık toplam: {formatCurrency(displayMonthlyTL * 12)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                        <span>Fizibilite Limiti:</span>
                        <strong className="text-emerald-700">
                          {p.monthlyFeasibilityLimit >= 9999
                            ? 'Sınırsız Analiz'
                            : `Ayda ${p.monthlyFeasibilityLimit} Adet`}
                        </strong>
                      </div>
                      {p.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                          <span className="leading-tight text-slate-700">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isCurrent && key === 'free'}
                      onClick={() => {
                        onSetPlan(key as UserPlan, billingCycle);
                        onClose();
                      }}
                      className={`w-full py-2.5 px-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        isCurrent
                          ? 'bg-slate-200 text-slate-700 cursor-default'
                          : isRecommended
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <span>Mevcut Planınız</span>
                      ) : (
                        <>
                          <span>
                            {key === 'free'
                              ? 'Ücretsiz Başla'
                              : billingCycle === 'annual'
                              ? 'Yıllık Başla (Tasarruflu)'
                              : 'Planı Seç'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Context Footer */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>İşletme Paketi:</strong> Arsa toplayanlar, emlak & proje şirketleri ve müteahhitler için önerilen ana sürümdür.
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Fiyatlar yönetici panelinden dinamik olarak yönetilebilir • 3D Secure Korumalı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
