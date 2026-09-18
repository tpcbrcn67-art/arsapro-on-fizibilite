import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  UserSession,
  IndividualProfile,
  BusinessProfile,
  UserAccountType,
} from '../types/saas';
import { sampleIndividualUser, sampleBusinessUser } from '../data/defaultSaasData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'individual' | 'business' | 'login';
  initialMode?: 'login' | 'register';
  initialAccountType?: 'individual' | 'business';
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab,
  initialMode,
  initialAccountType,
  onLoginSuccess,
}) => {
  const initialResolvedTab: 'individual' | 'business' | 'login' =
    initialMode === 'login'
      ? 'login'
      : initialAccountType === 'business'
      ? 'business'
      : defaultTab || 'individual';

  const [activeTab, setActiveTab] = useState<'individual' | 'business' | 'login'>(initialResolvedTab);

  // Individual form state
  const [indForm, setIndForm] = useState<IndividualProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'İstanbul',
    district: 'Kadıköy',
    kvkkAccepted: false,
    termsAccepted: false,
    marketingConsent: false,
  });
  const [indPassword, setIndPassword] = useState('');

  // Business form state
  const [bizForm, setBizForm] = useState<BusinessProfile>({
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    companyType: 'A.Ş.',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    phone: '',
    city: 'İstanbul',
    district: 'Şişli',
    address: '',
    website: '',
    employeeCountRange: '6-20',
  });
  const [bizPassword, setBizPassword] = useState('');
  const [bizKvkk, setBizKvkk] = useState(false);
  const [bizTerms, setBizTerms] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // KVKK / Terms modal state
  const [showKvkkDoc, setShowKvkkDoc] = useState(false);

  if (!isOpen) return null;

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indForm.kvkkAccepted || !indForm.termsAccepted) {
      alert('Lütfen KVKK Aydınlatma Metni ve Kullanım Koşullarını onaylayınız.');
      return;
    }

    const newSession: UserSession = {
      accountType: 'individual',
      id: `usr_${Date.now()}`,
      displayName: `${indForm.firstName} ${indForm.lastName}`,
      email: indForm.email || 'kullanici@arsapro.com',
      individualProfile: indForm,
      plan: 'free',
      monthlyLimit: 1,
      usedCountThisMonth: 0,
      creditBalance: 0,
      renewalDate: '2026-10-18',
      registeredAt: new Date().toISOString(),
      isLoggedIn: true,
      guestCalculationsRemaining: 0,
    };

    onLoginSuccess(newSession);
    onClose();
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizKvkk || !bizTerms) {
      alert('Lütfen KVKK Aydınlatma Metni ve Kullanım Koşullarını onaylayınız.');
      return;
    }

    const newSession: UserSession = {
      accountType: 'business',
      id: `biz_${Date.now()}`,
      displayName: bizForm.companyName || 'İnşaat Geliştirme A.Ş.',
      email: bizForm.email || 'kurumsal@arsapro.com',
      businessProfile: bizForm,
      employees: [
        {
          id: 'emp_owner_1',
          name: `${bizForm.contactFirstName} ${bizForm.contactLastName} (Yönetici)`,
          email: bizForm.email,
          role: 'owner',
          assignedProjectIds: ['*'],
        },
      ],
      currentEmployeeId: 'emp_owner_1',
      plan: 'free',
      monthlyLimit: 1,
      usedCountThisMonth: 0,
      creditBalance: 0,
      renewalDate: '2026-10-18',
      registeredAt: new Date().toISOString(),
      isLoggedIn: true,
      guestCalculationsRemaining: 0,
    };

    onLoginSuccess(newSession);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    // Check if matching sample users or create authenticated session
    if (loginEmail.toLowerCase().includes('burcin') || loginEmail.includes('tpcbrcn')) {
      onLoginSuccess(sampleIndividualUser);
      onClose();
      return;
    }

    if (loginEmail.toLowerCase().includes('harun') || loginEmail.toLowerCase().includes('holding')) {
      onLoginSuccess(sampleBusinessUser);
      onClose();
      return;
    }

    // Default user session
    const genericSession: UserSession = {
      accountType: 'individual',
      id: `usr_${Date.now()}`,
      displayName: loginEmail.split('@')[0],
      email: loginEmail,
      plan: 'starter',
      monthlyLimit: 10,
      usedCountThisMonth: 1,
      creditBalance: 5,
      renewalDate: '2026-10-18',
      registeredAt: new Date().toISOString(),
      isLoggedIn: true,
      guestCalculationsRemaining: 0,
    };

    onLoginSuccess(genericSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold tracking-wider text-sm uppercase">ARSAPRO</span>
              <span className="text-slate-400 text-xs">• Kullanıcı Hesabı</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {activeTab === 'login'
                ? 'Hesabınıza Giriş Yapın'
                : activeTab === 'individual'
                ? 'Bireysel Hesap Oluştur'
                : 'İşletme / Kurumsal Hesap Oluştur'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'individual'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>👤 Bireysel Hesap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'business'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>🏢 İşletme Hesabı</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Giriş Yap</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Quick 1-Click Demo Buttons for Fast Testing */}
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="text-[11px] font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Hızlı İnceleme İçin Hazır Demo Profiliyle Giriş Yap:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(sampleIndividualUser);
                  onClose();
                }}
                className="text-left p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100/50 transition-all text-xs cursor-pointer"
              >
                <div className="font-bold text-slate-800">👤 Burçin (Bireysel)</div>
                <div className="text-[10px] text-slate-500">Pro Plan • Sakarya &amp; Armutlu</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(sampleBusinessUser);
                  onClose();
                }}
                className="text-left p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100/50 transition-all text-xs cursor-pointer"
              >
                <div className="font-bold text-slate-800">🏢 Harun Elmalı A.Ş.</div>
                <div className="text-[10px] text-slate-500">Kurumsal • Ahmet, Mehmet, Ayşe</div>
              </button>
            </div>
          </div>

          {/* TAB 1: BİREYSEL HESAP KAYDI */}
          {activeTab === 'individual' && (
            <form onSubmit={handleIndividualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ad *</label>
                  <input
                    type="text"
                    required
                    value={indForm.firstName}
                    onChange={(e) => setIndForm({ ...indForm, firstName: e.target.value })}
                    placeholder="Örn: Burçin"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soyad *</label>
                  <input
                    type="text"
                    required
                    value={indForm.lastName}
                    onChange={(e) => setIndForm({ ...indForm, lastName: e.target.value })}
                    placeholder="Örn: Topçu"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={indForm.email}
                    onChange={(e) => setIndForm({ ...indForm, email: e.target.value })}
                    placeholder="ornek@arsapro.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={indForm.phone}
                    onChange={(e) => setIndForm({ ...indForm, phone: e.target.value })}
                    placeholder="0532 000 00 00"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Şehir *</label>
                  <input
                    type="text"
                    required
                    value={indForm.city}
                    onChange={(e) => setIndForm({ ...indForm, city: e.target.value })}
                    placeholder="İstanbul, Ankara vb."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={indForm.district}
                    onChange={(e) => setIndForm({ ...indForm, district: e.target.value })}
                    placeholder="Kadıköy, Çankaya vb."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Şifre Belirleyin *</label>
                <input
                  type="password"
                  required
                  value={indPassword}
                  onChange={(e) => setIndPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={indForm.kvkkAccepted}
                    onChange={(e) => setIndForm({ ...indForm, kvkkAccepted: e.target.checked })}
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    <strong>KVKK Aydınlatma Metni</strong>&apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={indForm.termsAccepted}
                    onChange={(e) => setIndForm({ ...indForm, termsAccepted: e.target.checked })}
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    <strong>Kullanım Koşulları</strong> ve Ön Fizibilite Yasal Çekincesi şartlarını kabul ediyorum.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indForm.marketingConsent}
                    onChange={(e) => setIndForm({ ...indForm, marketingConsent: e.target.checked })}
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500">
                    İmar mevzuatı güncellemeleri ve ARSAPRO bültenlerini e-posta ile almak istiyorum (İsteğe bağlı).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Bireysel Hesap Oluştur &amp; Panele Git</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: İŞLETME HESABI KAYDI */}
          {activeTab === 'business' && (
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Şirket Unvanı *</label>
                <input
                  type="text"
                  required
                  value={bizForm.companyName}
                  onChange={(e) => setBizForm({ ...bizForm, companyName: e.target.value })}
                  placeholder="Örn: Harun Elmalı Global Yatırım İnşaat A.Ş."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Şirket Türü *</label>
                  <select
                    value={bizForm.companyType}
                    onChange={(e) => setBizForm({ ...bizForm, companyType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="A.Ş.">Anonim Şirket (A.Ş.)</option>
                    <option value="Ltd. Şti.">Limited Şirket (Ltd. Şti.)</option>
                    <option value="Şahıs Şirketi">Şahıs Şirketi</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vergi No *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.taxNumber}
                    onChange={(e) => setBizForm({ ...bizForm, taxNumber: e.target.value })}
                    placeholder="10 haneli vergi no"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vergi Dairesi *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.taxOffice}
                    onChange={(e) => setBizForm({ ...bizForm, taxOffice: e.target.value })}
                    placeholder="Örn: Beşiktaş V.D."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Yetkili Adı *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.contactFirstName}
                    onChange={(e) => setBizForm({ ...bizForm, contactFirstName: e.target.value })}
                    placeholder="Yetkili Adı"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Yetkili Soyadı *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.contactLastName}
                    onChange={(e) => setBizForm({ ...bizForm, contactLastName: e.target.value })}
                    placeholder="Yetkili Soyadı"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Şirket E-posta *</label>
                  <input
                    type="email"
                    required
                    value={bizForm.email}
                    onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
                    placeholder="kurumsal@sirket.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={bizForm.phone}
                    onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                    placeholder="0212 000 00 00"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İl *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.city}
                    onChange={(e) => setBizForm({ ...bizForm, city: e.target.value })}
                    placeholder="İstanbul"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={bizForm.district}
                    onChange={(e) => setBizForm({ ...bizForm, district: e.target.value })}
                    placeholder="Şişli"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Çalışan Sayısı</label>
                  <select
                    value={bizForm.employeeCountRange}
                    onChange={(e) => setBizForm({ ...bizForm, employeeCountRange: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1-5">1-5 Kişi</option>
                    <option value="6-20">6-20 Kişi</option>
                    <option value="21-50">21-50 Kişi</option>
                    <option value="50+">50+ Kişi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Şirket Adresi</label>
                <textarea
                  rows={2}
                  value={bizForm.address}
                  onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                  placeholder="Açık adres ve ofis bilgisi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={bizKvkk}
                    onChange={(e) => setBizKvkk(e.target.checked)}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    <strong>Kurumsal KVKK Aydınlatma Metni</strong>&apos;ni okudum ve kabul ediyorum.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={bizTerms}
                    onChange={(e) => setBizTerms(e.target.checked)}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    <strong>Kurumsal Üyelik ve Hizmet Sözleşmesi</strong> şartlarını kabul ediyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>İşletme Hesabı Oluştur &amp; Yönetici Paneline Git</span>
              </button>
            </form>
          )}

          {/* TAB 3: GİRİŞ YAP */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta Adresiniz</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ornek@arsapro.com veya tpcbrcn67@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Şifreniz</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Henüz bir hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('individual')}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Ücretsiz Bireysel Kayıt Ol
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
