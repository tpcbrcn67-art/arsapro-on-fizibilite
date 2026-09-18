import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Building,
  User,
  ArrowRight,
  Receipt,
  FileCheck,
} from 'lucide-react';
import {
  SubscriptionPlan,
  PlanConfig,
  CreditPackConfig,
  PaymentTransaction,
  UserSession,
  PromotionalCampaign,
} from '../types/saas';
import { formatCurrency } from '../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  plans: Record<SubscriptionPlan, PlanConfig>;
  creditPacks: CreditPackConfig[];
  initialPlanKey?: SubscriptionPlan;
  initialBillingCycle?: 'monthly' | 'annual';
  campaign?: PromotionalCampaign;
  onPaymentSuccess: (transaction: PaymentTransaction, newPlan?: SubscriptionPlan, creditsAdded?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  session,
  plans,
  creditPacks,
  initialPlanKey = 'pro',
  initialBillingCycle = 'annual',
  campaign,
  onPaymentSuccess,
}) => {
  const [purchaseType, setPurchaseType] = useState<'plan' | 'credits'>('plan');
  const [selectedPlanKey, setSelectedPlanKey] = useState<SubscriptionPlan>(initialPlanKey);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBillingCycle);
  const [selectedCreditPackId, setSelectedCreditPackId] = useState<string>('pack_50');

  // Sync state if initial props change
  React.useEffect(() => {
    if (initialPlanKey) setSelectedPlanKey(initialPlanKey);
    if (initialBillingCycle) setBillingCycle(initialBillingCycle);
  }, [initialPlanKey, initialBillingCycle, isOpen]);

  // Card form state
  const [cardNumber, setCardNumber] = useState('5421 8900 1234 5678');
  const [cardHolder, setCardHolder] = useState(session.displayName || 'Burçin Topçu');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('456');

  // Invoicing details
  const [invoiceType, setInvoiceType] = useState<'individual' | 'corporate'>(
    session.accountType === 'business' ? 'corporate' : 'individual'
  );
  const [taxNumber, setTaxNumber] = useState(session.businessProfile?.taxNumber || '1234567890');
  const [taxOffice, setTaxOffice] = useState(session.businessProfile?.taxOffice || 'Beşiktaş V.D.');
  const [companyTitle, setCompanyTitle] = useState(session.businessProfile?.companyName || session.displayName);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTx, setSuccessTx] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  // Calculate price
  let totalAmount = 0;
  let itemTitle = '';
  let originalAmount = 0;
  let hasDiscount = false;

  if (purchaseType === 'plan') {
    const p = plans[selectedPlanKey];
    if (billingCycle === 'annual') {
      originalAmount = p.priceAnnualTL;
      totalAmount = p.priceAnnualTL;
      if (campaign?.isActive && (campaign.appliesTo === 'annual_only' || campaign.appliesTo === 'all') && p.priceAnnualTL > 0) {
        totalAmount = Math.round(p.priceAnnualTL * (1 - campaign.discountPercent / 100));
        hasDiscount = true;
      }
      itemTitle = `${p.title} (12 Ay Peşin Yıllık Abonelik)`;
    } else {
      originalAmount = p.priceMonthlyTL;
      totalAmount = p.priceMonthlyTL;
      if (campaign?.isActive && campaign.appliesTo === 'all' && p.priceMonthlyTL > 0) {
        totalAmount = Math.round(p.priceMonthlyTL * (1 - campaign.discountPercent / 100));
        hasDiscount = true;
      }
      itemTitle = `${p.title} (Aylık Abonelik)`;
    }
  } else {
    const pack = creditPacks.find((c) => c.id === selectedCreditPackId) || creditPacks[0];
    totalAmount = pack.priceTL;
    originalAmount = pack.priceTL;
    itemTitle = `${pack.credits} Adet Fizibilite Kredisi`;
  }

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // PaymentProvider simulation:
    // 1. Client creates payment intent
    // 2. Provider processes card securely
    // 3. Webhook receives confirmation and automatically activates plan or credit
    setTimeout(() => {
      setIsProcessing(false);
      const invoiceNumber = `ARS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        userId: session.id,
        userName: session.displayName,
        date: new Date().toISOString(),
        amountTL: totalAmount,
        itemType: purchaseType === 'plan' ? 'plan' : 'credit_pack',
        itemTitle,
        invoiceNumber,
        paymentMethod: `Kredi Kartı (•••• ${cardNumber.slice(-4)})`,
        status: 'success',
      };

      setSuccessTx(newTx);

      // Trigger state change
      if (purchaseType === 'plan') {
        onPaymentSuccess(newTx, selectedPlanKey, 0);
      } else {
        const pack = creditPacks.find((c) => c.id === selectedCreditPackId);
        onPaymentSuccess(newTx, undefined, pack?.credits || 10);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Güvenli Ödeme &amp; Paket Yükseltme</h2>
              <p className="text-xs text-slate-400">256-Bit SSL Korumalı Ödeme Altyapısı (PaymentProvider)</p>
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

        {/* Success Screen if paid */}
        {successTx ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Ödemeniz Başarıyla Alındı!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              <strong>{successTx.itemTitle}</strong> hesabınıza anında tanımlanmıştır. Faturanız e-posta adresinize gönderilmiştir.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs max-w-sm mx-auto text-left space-y-1 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Fatura No:</span>
                <strong className="text-slate-900">{successTx.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Ödenen Tutar:</span>
                <strong className="text-emerald-700">{formatCurrency(successTx.amountTL)}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>İşlem Durumu:</span>
                <span className="text-emerald-600 font-bold">Onaylandı (Webhook)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Tamam, Çalışma Alanına Dön
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Choose between Subscription or One-time Credits */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPurchaseType('plan')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  purchaseType === 'plan'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aylık / Yıllık Abonelik Paketi
              </button>
              <button
                type="button"
                onClick={() => setPurchaseType('credits')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  purchaseType === 'credits'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Tek Seferlik Kredi Paketi (Aboneliksiz)
              </button>
            </div>

            {/* TAB A: PLAN SEÇİMİ */}
            {purchaseType === 'plan' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Paket Seçin:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                        billingCycle === 'monthly' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Aylık Ödeme
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`px-3 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                        billingCycle === 'annual' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Yıllık (3 Ay Ücretsiz!)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['starter', 'pro', 'enterprise'] as SubscriptionPlan[]).map((pKey) => {
                    const plan = plans[pKey];
                    const isSelected = selectedPlanKey === pKey;
                    const isAnnual = billingCycle === 'annual';
                    const savings = plan.annualSavingsTL || (plan.priceMonthlyTL * 12 - plan.priceAnnualTL);
                    
                    let displayPrice = isAnnual ? plan.priceAnnualTL : plan.priceMonthlyTL;
                    if (campaign?.isActive && (campaign.appliesTo === 'all' || (campaign.appliesTo === 'annual_only' && isAnnual))) {
                      displayPrice = Math.round(displayPrice * (1 - campaign.discountPercent / 100));
                    }

                    return (
                      <div
                        key={pKey}
                        onClick={() => setSelectedPlanKey(pKey)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-900">
                            {pKey === 'starter' && '👤 '}
                            {pKey === 'pro' && '🏢 '}
                            {pKey === 'enterprise' && '🏗️ '}
                            {plan.title}
                          </span>
                          {plan.recommendedBadge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white font-black tracking-tight">
                              {plan.recommendedBadge}
                            </span>
                          )}
                        </div>

                        <div className="text-base font-black text-slate-900 mt-2">
                          {formatCurrency(displayPrice)}
                          <span className="text-[10px] font-normal text-slate-500">
                            {isAnnual ? ' / yıl' : ' / ay'}
                          </span>
                        </div>

                        {isAnnual && (
                          <div className="mt-1">
                            <div className="text-[10px] font-semibold text-slate-600">
                              ~{formatCurrency(Math.round(displayPrice / 12))} / ay
                            </div>
                            {savings > 0 && (
                              <div className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                                <span>🔥 {formatCurrency(savings)} tasarruf</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                          {plan.monthlyFeasibilityLimit > 100 ? 'Sınırsız Analiz' : `Ayda ${plan.monthlyFeasibilityLimit} Analiz`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB B: KREDİ PAKETİ SEÇİMİ (10. Madde) */}
            {purchaseType === 'credits' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Fizibilite Kredi Paketi Seçin (Süresiz Geçerli):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {creditPacks.map((pack) => {
                    const isSelected = selectedCreditPackId === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedCreditPackId(pack.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-900">{pack.credits} Kredi</span>
                          {pack.popularBadge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white font-bold">
                              Avantajlı
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-slate-900 mt-2">
                          {pack.priceTL.toLocaleString('tr-TR')} TL
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Birim: {pack.unitPriceTL} TL / sorgu
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Details (Card Simulation) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kart Bilgileri</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">3D Secure Destekli</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kart Numarası</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">SKT</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="AA/YY"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Toplam Ödenecek Tutar (KDV Dahil):</div>
                <div className="text-xl font-black text-slate-900">
                  {formatCurrency(totalAmount)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ödeme İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Güvenli Ödemeyi Tamamla</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
