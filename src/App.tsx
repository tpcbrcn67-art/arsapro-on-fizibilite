import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  BarChart3,
  Sliders,
  FileCheck2,
  MapPin,
  TrendingUp,
  Layers,
  Info,
  Printer,
  RotateCcw,
  Activity,
  SlidersHorizontal,
  Archive,
  Plus,
  Crown,
  CheckCircle2,
  Calculator,
  Share2,
  Brain,
  ShieldAlert,
  FolderOpen,
  LayoutDashboard,
  AlertCircle,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { LandInputs } from './components/LandInputs';
import { ProjectAssumptions } from './components/ProjectAssumptions';
import { FeasibilitySummary } from './components/FeasibilitySummary';
import { ScenarioComparison } from './components/ScenarioComparison';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { ReverseFeasibilityCard } from './components/ReverseFeasibilityCard';
import { AICommentaryCard } from './components/AICommentaryCard';
import { AssumptionHub } from './components/AssumptionHub';
import { LandDecisionEngine } from './components/LandDecisionEngine';
import { ZoningAreaTransparencyCard } from './components/ZoningAreaTransparencyCard';
import { ReportModal } from './components/ReportModal';
import { NewFeasibilityModal } from './components/NewFeasibilityModal';
import { SubscriptionPlanModal } from './components/SubscriptionPlanModal';
import { PaymentModal } from './components/PaymentModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ShareProjectModal } from './components/ShareProjectModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { LandingHeroBanner } from './components/LandingHeroBanner';
import { ProjectArchiveView } from './components/ProjectArchiveView';

import {
  LandData,
  ProjectCostAssumptions,
  FeasibilityScenario,
  UserSubscription,
  SavedFeasibility,
} from './types/feasibility';
import {
  UserSession,
  AdminSystemSettings,
  PaymentTransaction,
  SubscriptionPlan,
} from './types/saas';
import {
  initialLandData,
  initialCostAssumptions,
  defaultScenarios,
  landPresets,
  LandPreset,
} from './data/defaultScenarios';
import {
  initialAdminSettings,
  defaultGuestSession,
  sampleIndividualUser,
  sampleBusinessUser,
  sampleTransactions,
} from './data/defaultSaasData';
import { calculateFeasibility } from './utils/calculator';
import { formatCurrencyTL, formatArea, formatNumber, formatPercent } from './utils/formatters';

export default function App() {
  // Core feasibility calculation parameters
  const [land, setLand] = useState<LandData>(initialLandData);
  const [assumptions, setAssumptions] = useState<ProjectCostAssumptions>(initialCostAssumptions);
  const [scenarios, setScenarios] = useState<FeasibilityScenario[]>(defaultScenarios);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario_a');
  const [currentPresetId, setCurrentPresetId] = useState<string>('preset_user_20k');

  // SaaS User & Session Management
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('arsapro_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Default to sampleIndividualUser (Burçin Topçu) so user sees the rich dashboard and can test easily,
    // while also being able to log out to test the pre-login landing experience!
    return sampleIndividualUser;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('arsapro_user_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('arsapro_user_session');
    }
  }, [session]);

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSystemSettings>(() => {
    const saved = localStorage.getItem('arsapro_admin_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialAdminSettings;
  });

  useEffect(() => {
    localStorage.setItem('arsapro_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  // Transactions Log
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(sampleTransactions);

  // App Main View: 'calculator' (Çalışma Alanı) vs 'dashboard' (Kullanıcı Paneli)
  const [currentView, setCurrentView] = useState<'calculator' | 'dashboard'>('dashboard');

  // Active Workspace Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'comparison' | 'overview' | 'sensitivity' | 'reverse' | 'decision' | 'assumptions' | 'archive'
  >('comparison');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialAccountType, setAuthInitialAccountType] = useState<'individual' | 'business'>('individual');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isNewFeasibilityOpen, setIsNewFeasibilityOpen] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan>('pro');
  const [selectedBillingCycleForPayment, setSelectedBillingCycleForPayment] = useState<'monthly' | 'annual'>('annual');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [projectToShare, setProjectToShare] = useState<SavedFeasibility | null>(null);

  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Saved Projects Archive with the user's requested sample projects
  const [savedProjects, setSavedProjects] = useState<SavedFeasibility[]>(() => {
    const saved = localStorage.getItem('arsapro_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'sample_sakarya',
        title: 'Sakarya Serdivan Konut Projesi',
        createdAt: '19.09.2026',
        city: 'Sakarya',
        district: 'Serdivan',
        neighborhood: 'İstiklal Mah.',
        ada: '1420',
        parsel: '8',
        landAreaM2: 20000,
        kaks: 1.8,
        taks: 0.35,
        maxFloors: 5,
        unitSalesPricePerM2: 60000,
        landPriceTL: 0,
        acquisitionType: 'flat_for_land',
        landOwnerSharePercent: 45,
        totalSalableGrossM2: 36000,
        totalRevenue: 1250000000,
        netProfit: 382500000,
        profitMargin: 30.6,
        roiOnCost: 44.1,
        status: 'Tamamlandı',
        folder: 'Sakarya',
        suitabilityScore: 'Çok Uygun',
        landData: {
          ...initialLandData,
          projectName: 'Sakarya Serdivan Konut Projesi',
          city: 'Sakarya',
          district: 'Serdivan',
          neighborhood: 'İstiklal Mah.',
          ada: '1420',
          parsel: '8',
          landAreaM2: 20000,
          kaks: 1.8,
          taks: 0.35,
          maxFloors: 5,
          acquisitionType: 'flat_for_land',
          landOwnerSharePercent: 45,
        },
        assumptions: initialCostAssumptions,
        scenarios: defaultScenarios,
      },
      {
        id: 'sample_armutlu',
        title: 'Armutlu Sahil Konutları',
        createdAt: '18.09.2026',
        city: 'Yalova',
        district: 'Armutlu',
        neighborhood: 'Karşıyaka Mah.',
        ada: '312',
        parsel: '4',
        landAreaM2: 12500,
        kaks: 1.5,
        taks: 0.3,
        maxFloors: 4,
        unitSalesPricePerM2: 48000,
        landPriceTL: 120000000,
        acquisitionType: 'cash',
        landOwnerSharePercent: 0,
        totalSalableGrossM2: 18750,
        totalRevenue: 620000000,
        netProfit: 185000000,
        profitMargin: 29.8,
        roiOnCost: 42.5,
        status: 'Taslak',
        folder: 'Armutlu',
        suitabilityScore: 'Uygun',
        landData: {
          ...initialLandData,
          projectName: 'Armutlu Sahil Konutları',
          city: 'Yalova',
          district: 'Armutlu',
          neighborhood: 'Karşıyaka Mah.',
          ada: '312',
          parsel: '4',
          landAreaM2: 12500,
          kaks: 1.5,
          taks: 0.3,
          maxFloors: 4,
          landCashPrice: 120000000,
          acquisitionType: 'cash',
        },
        assumptions: initialCostAssumptions,
        scenarios: defaultScenarios,
      },
      {
        id: 'sample_kadikoy',
        title: 'Kadıköy Moda Kentsel Dönüşüm',
        createdAt: '15.09.2026',
        city: 'İstanbul',
        district: 'Kadıköy',
        neighborhood: 'Caferağa Mah.',
        ada: '418',
        parsel: '12',
        landAreaM2: 2400,
        kaks: 2.2,
        taks: 0.35,
        maxFloors: 10,
        unitSalesPricePerM2: 120000,
        landPriceTL: 180000000,
        acquisitionType: 'cash',
        totalSalableGrossM2: 5280,
        totalRevenue: 633600000,
        netProfit: 198450000,
        profitMargin: 31.3,
        roiOnCost: 45.6,
        status: 'Tamamlandı',
        folder: 'İstanbul',
        suitabilityScore: 'Çok Uygun',
        landData: {
          ...initialLandData,
          projectName: 'Kadıköy Moda Kentsel Dönüşüm',
          city: 'İstanbul',
          district: 'Kadıköy',
          neighborhood: 'Caferağa Mah.',
          ada: '418',
          parsel: '12',
          landAreaM2: 2400,
          kaks: 2.2,
          taks: 0.35,
          maxFloors: 10,
          landCashPrice: 180000000,
          acquisitionType: 'cash',
        },
        assumptions: initialCostAssumptions,
        scenarios: defaultScenarios,
      },
      {
        id: 'sample_kocaeli',
        title: 'İzmit Yahya Kaptan Karma Yaşam',
        createdAt: '10.09.2026',
        city: 'Kocaeli',
        district: 'İzmit',
        neighborhood: 'Yahya Kaptan',
        ada: '820',
        parsel: '2',
        landAreaM2: 15000,
        kaks: 2.0,
        taks: 0.4,
        maxFloors: 6,
        unitSalesPricePerM2: 55000,
        landPriceTL: 0,
        acquisitionType: 'revenue_share',
        revenueSharePercent: 38,
        totalSalableGrossM2: 30000,
        totalRevenue: 950000000,
        netProfit: 290000000,
        profitMargin: 30.5,
        roiOnCost: 43.9,
        status: 'Tamamlandı',
        folder: 'Kocaeli',
        suitabilityScore: 'Çok Uygun',
        landData: {
          ...initialLandData,
          projectName: 'İzmit Yahya Kaptan Karma Yaşam',
          city: 'Kocaeli',
          district: 'İzmit',
          landAreaM2: 15000,
          kaks: 2.0,
          taks: 0.4,
          maxFloors: 6,
          acquisitionType: 'revenue_share',
          revenueSharePercent: 38,
        },
        assumptions: initialCostAssumptions,
        scenarios: defaultScenarios,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('arsapro_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  // Active scenario
  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  }, [scenarios, activeScenarioId]);

  // Active feasibility result
  const activeResult = useMemo(() => {
    return calculateFeasibility(land, assumptions, activeScenario);
  }, [land, assumptions, activeScenario]);

  // Handle Preset selection
  const handleSelectPreset = (preset: LandPreset) => {
    setCurrentPresetId(preset.id);
    setLand((prev) => ({
      ...prev,
      ...preset.land,
    }));
  };

  // Reset to default
  const handleReset = () => {
    setLand(initialLandData);
    setAssumptions(initialCostAssumptions);
    setScenarios(defaultScenarios);
    setActiveScenarioId('scenario_a');
    setCurrentPresetId('preset_user_20k');
  };

  // Handle Scenario updates
  const handleUpdateScenario = (updated: FeasibilityScenario) => {
    setScenarios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddScenario = (newScenario: FeasibilityScenario) => {
    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioId(newScenario.id);
  };

  // Handle selecting a saved project from the Dashboard or Archive
  const handleSelectSavedProject = (proj: SavedFeasibility) => {
    setLand(proj.landData);
    setAssumptions(proj.assumptions);
    setScenarios(proj.scenarios);
    setActiveScenarioId(proj.scenarios[0]?.id || 'scenario_a');
    setCurrentView('calculator');
    setActiveTab('overview');
    setSaveSuccessToast(`"${proj.title}" çalışma alanına yüklendi.`);
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Delete a saved project
  const handleDeleteSavedProject = (projectId: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== projectId));
    setSaveSuccessToast('Proje arşivden silindi.');
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Auth gatekeeper helper: checks if user is logged in
  const requireAuthForAction = (actionName: string): boolean => {
    if (!session || !session.isLoggedIn) {
      setAuthInitialMode('register');
      setIsAuthOpen(true);
      return false;
    }
    return true;
  };

  // Handle New Feasibility Calculation from Wizard
  const handleCalculateNewFeasibility = (inputData: {
    city: string;
    district: string;
    projectName: string;
    landAreaM2: number;
    acquisitionType: 'cash' | 'flat_for_land' | 'revenue_share';
    landPriceTL: number;
    landOwnerSharePercent: number;
    kaks: number;
    taks: number;
    maxFloors: number;
    unitSalesPricePerM2: number;
    constructionCostSegment: 'standard' | 'medium' | 'luxury';
  }) => {
    // 1. Quota usage
    if (session) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              usedCountThisMonth: prev.usedCountThisMonth + 1,
            }
          : prev
      );
    }

    // 2. Construction cost
    const costPerM2 =
      inputData.constructionCostSegment === 'standard'
        ? 25000
        : inputData.constructionCostSegment === 'luxury'
        ? 38000
        : adminSettings.defaultConstructionCostPerM2;

    const newAssumptions: ProjectCostAssumptions = {
      ...assumptions,
      constructionCostPerM2: costPerM2,
    };
    setAssumptions(newAssumptions);

    // 3. Update Land Data
    const newLand: LandData = {
      ...land,
      projectName: inputData.projectName,
      location: `${inputData.city}, ${inputData.district}`,
      city: inputData.city,
      district: inputData.district,
      landAreaM2: inputData.landAreaM2,
      publicCessionPercent: 0,
      kaks: inputData.kaks,
      taks: inputData.taks,
      maxFloors: inputData.maxFloors,
      acquisitionType: inputData.acquisitionType,
      landCashPrice: inputData.landPriceTL,
      landOwnerSharePercent: inputData.landOwnerSharePercent,
      revenueSharePercent: inputData.landOwnerSharePercent,
    };
    setLand(newLand);

    // 4. Update Scenarios
    const updatedScenarios = scenarios.map((sc) => {
      let priceMultiplier = 1.0;
      if (sc.id === 'scenario_a') priceMultiplier = 1.05;
      if (sc.id === 'scenario_c') priceMultiplier = 1.12;

      return {
        ...sc,
        constructionCostPerM2: costPerM2,
        unitTypes: sc.unitTypes.map((ut) => ({
          ...ut,
          unitSalesPricePerM2: Math.round(inputData.unitSalesPricePerM2 * priceMultiplier),
          customUnitPriceTL: 0,
        })),
      };
    });
    setScenarios(updatedScenarios);

    // 5. Save to project list
    const tempResult = calculateFeasibility(newLand, newAssumptions, updatedScenarios[0]);
    const newSavedItem: SavedFeasibility = {
      id: `proj_${Date.now()}`,
      title: inputData.projectName,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      city: inputData.city,
      district: inputData.district,
      landAreaM2: inputData.landAreaM2,
      kaks: inputData.kaks,
      taks: inputData.taks,
      maxFloors: inputData.maxFloors,
      unitSalesPricePerM2: inputData.unitSalesPricePerM2,
      landPriceTL: inputData.landPriceTL,
      acquisitionType: inputData.acquisitionType,
      landOwnerSharePercent: inputData.landOwnerSharePercent,
      totalSalableGrossM2: tempResult.totalSalableGrossAreaM2,
      totalRevenue: tempResult.totalGrossRevenue,
      netProfit: tempResult.grossProfit,
      profitMargin: tempResult.profitMarginOnRevenue,
      roiOnCost: tempResult.roiOnCost,
      status: 'Tamamlandı',
      folder: inputData.city || 'Genel',
      suitabilityScore: tempResult.suitabilityScore,
      landData: newLand,
      assumptions: newAssumptions,
      scenarios: updatedScenarios,
    };

    setSavedProjects((prev) => [newSavedItem, ...prev]);

    setSaveSuccessToast(`"${inputData.projectName}" fizibilitesi hesaplandı!`);
    setTimeout(() => setSaveSuccessToast(null), 4000);

    setCurrentView('calculator');
    setActiveTab('overview');
  };

  // Save current active project to archive
  const handleSaveCurrentProject = () => {
    if (!requireAuthForAction('Proje Kaydet')) return;

    const newItem: SavedFeasibility = {
      id: `proj_${Date.now()}`,
      title: land.projectName || `${land.city || 'Arsa'} Fizibilitesi`,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      city: land.city || 'Belirtilmedi',
      district: land.district || '',
      neighborhood: land.neighborhood,
      ada: land.ada,
      parsel: land.parsel,
      landAreaM2: land.landAreaM2,
      kaks: land.kaks,
      taks: land.taks,
      maxFloors: land.maxFloors,
      unitSalesPricePerM2: activeResult.averageSalesPricePerM2,
      landPriceTL: land.landCashPrice,
      acquisitionType: land.acquisitionType,
      landOwnerSharePercent: land.landOwnerSharePercent,
      totalSalableGrossM2: activeResult.totalSalableGrossAreaM2,
      totalRevenue: activeResult.totalGrossRevenue,
      netProfit: activeResult.grossProfit,
      profitMargin: activeResult.profitMarginOnRevenue,
      roiOnCost: activeResult.roiOnCost,
      status: 'Tamamlandı',
      folder: land.city || 'Genel',
      suitabilityScore: activeResult.suitabilityScore,
      landData: land,
      assumptions: assumptions,
      scenarios: scenarios,
    };

    setSavedProjects((prev) => [newItem, ...prev]);
    setSaveSuccessToast(`"${newItem.title}" proje arşivine kaydedildi.`);
    setTimeout(() => setSaveSuccessToast(null), 4000);
  };

  // Open share modal
  const handleOpenShare = (project?: SavedFeasibility) => {
    if (!requireAuthForAction('Proje Paylaş')) return;
    if (project) {
      setProjectToShare(project);
    } else {
      // Create a temporary project from active state
      setProjectToShare({
        id: `share_${Date.now()}`,
        title: land.projectName,
        createdAt: new Date().toLocaleDateString('tr-TR'),
        city: land.city || 'İstanbul',
        district: land.district || 'Kadıköy',
        landAreaM2: land.landAreaM2,
        kaks: land.kaks,
        taks: land.taks,
        maxFloors: land.maxFloors,
        unitSalesPricePerM2: activeResult.averageSalesPricePerM2,
        landPriceTL: land.landCashPrice,
        acquisitionType: land.acquisitionType,
        totalSalableGrossM2: activeResult.totalSalableGrossAreaM2,
        totalRevenue: activeResult.totalGrossRevenue,
        netProfit: activeResult.grossProfit,
        profitMargin: activeResult.profitMarginOnRevenue,
        roiOnCost: activeResult.roiOnCost,
        suitabilityScore: activeResult.suitabilityScore,
        landData: land,
        assumptions: assumptions,
        scenarios: scenarios,
      });
    }
    setIsShareModalOpen(true);
  };

  // Open PDF report
  const handleOpenReport = () => {
    if (!requireAuthForAction('PDF Rapor Al')) return;
    setIsReportOpen(true);
  };

  // Payment success handler
  const handlePaymentSuccess = (tx: PaymentTransaction, newPlan?: any, creditsAdded?: number) => {
    setTransactions((prev) => [tx, ...prev]);
    if (session) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          plan: newPlan || prev.plan,
          monthlyLimit: newPlan === 'pro' || newPlan === 'enterprise' ? 9999 : prev.monthlyLimit,
          creditBalance: prev.creditBalance + (creditsAdded || 0),
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {/* Primary Top Navigation Bar */}
      <Navbar
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenReport={handleOpenReport}
        onOpenNewFeasibility={() => setIsNewFeasibilityOpen(true)}
        onOpenPlanModal={() => setIsPlanModalOpen(true)}
        onOpenArchive={() => setCurrentView('dashboard')}
        subscription={{
          plan: session?.plan || 'free',
          usedCountThisMonth: session?.usedCountThisMonth || 0,
          monthlyLimit: session?.monthlyLimit || 1,
          userName: session?.displayName || 'Kullanıcı',
          userEmail: session?.email || '',
          renewalDate: session?.renewalDate || '2026-10-01',
        }}
        session={session}
        currentView={currentView}
        onSwitchView={(v) => setCurrentView(v)}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode || 'login');
          setIsAuthOpen(true);
        }}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onLogout={() => {
          setSession(null);
          setCurrentView('calculator');
          setSaveSuccessToast('Oturum kapatıldı.');
          setTimeout(() => setSaveSuccessToast(null), 3000);
        }}
      />

      {/* Dynamic Campaign Announcement Ribbon (Admin controlled) */}
      {adminSettings.campaign?.isActive && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs z-30">
          <Flame className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-center">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
              {adminSettings.campaign.badgeText || 'KAMPANYA'}
            </span>
            <span className="font-bold">{adminSettings.campaign.title}</span>
            <span className="opacity-90 hidden md:inline">— {adminSettings.campaign.description}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPlanModalOpen(true)}
            className="ml-2 px-3 py-0.5 rounded-full bg-white text-orange-700 font-extrabold hover:bg-amber-50 transition-colors text-[11px] shadow-xs cursor-pointer shrink-0"
          >
            Fırsatı İncele →
          </button>
        </div>
      )}

      {/* If user is NOT logged in: Show the Landing Hero Banner */}
      {!session?.isLoggedIn && (
        <LandingHeroBanner
          onStartFreeCalculation={() => {
            setCurrentView('calculator');
            setActiveTab('overview');
          }}
          onOpenLogin={() => {
            setAuthInitialMode('login');
            setIsAuthOpen(true);
          }}
          onOpenRegister={() => {
            setAuthInitialMode('register');
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* VIEW 1: USER DASHBOARD (Kullanıcı Paneli & Son Çalışmalar) */}
        {currentView === 'dashboard' && session && session.isLoggedIn && (
          <UserDashboard
            session={session}
            savedFeasibilities={savedProjects}
            onSelectProject={handleSelectSavedProject}
            onNewFeasibility={() => setIsNewFeasibilityOpen(true)}
            onDeleteProject={handleDeleteSavedProject}
            onOpenUpgradeModal={() => setIsPaymentModalOpen(true)}
            onOpenShareModal={(p) => handleOpenShare(p)}
            onSwitchEmployeeView={(empId) => {
              setSession({
                ...session,
                currentEmployeeId: empId,
              });
            }}
          />
        )}

        {/* VIEW 2: CALCULATION WORKSPACE (Çalışma Alanı) */}
        {currentView === 'calculator' && (
          <div className="space-y-6">
            {/* Disclaimer & Legal Warning */}
            <DisclaimerBanner />

            {/* AI Commentary & Risk Evaluation */}
            <AICommentaryCard
              land={land}
              assumptions={assumptions}
              scenario={activeScenario}
              result={activeResult}
            />

            {/* Workspace Tab Bar */}
            <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-xs p-1 gap-1 text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                id="tab-comparison-btn"
                onClick={() => setActiveTab('comparison')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'comparison'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Senaryo Karşılaştırması</span>
              </button>

              <button
                type="button"
                id="tab-overview-btn"
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Ön Fizibilite Özeti</span>
              </button>

              <button
                type="button"
                id="tab-sensitivity-btn"
                onClick={() => setActiveTab('sensitivity')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'sensitivity'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Hassasiyet &amp; Stres Testi</span>
              </button>

              <button
                type="button"
                id="tab-reverse-btn"
                onClick={() => setActiveTab('reverse')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'reverse'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Geriye Dönük Hesap</span>
              </button>

              <button
                type="button"
                id="tab-decision-btn"
                onClick={() => setActiveTab('decision')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'decision'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Karar Motoru &amp; Tavsiye</span>
              </button>

              <button
                type="button"
                id="tab-assumptions-btn"
                onClick={() => setActiveTab('assumptions')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'assumptions'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Varsayımlar &amp; Parametreler</span>
              </button>

              <button
                type="button"
                id="tab-archive-btn"
                onClick={() => setActiveTab('archive')}
                className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'archive'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>Kayıtlı Projeler ({savedProjects.length})</span>
              </button>
            </div>

            {/* Sub-Tab 1: SENARYO KARŞILAŞTIRMASI */}
            {activeTab === 'comparison' && (
              <div className="space-y-6">
                <ScenarioComparison
                  scenarios={scenarios}
                  activeScenarioId={activeScenarioId}
                  land={land}
                  assumptions={assumptions}
                  onSelectScenario={(id) => setActiveScenarioId(id)}
                  onUpdateScenario={handleUpdateScenario}
                  onAddScenario={handleAddScenario}
                />
              </div>
            )}

            {/* Sub-Tab 2: ÖN FİZİBİLİTE ÖZETİ & DÖKÜM */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-6">
                  <LandInputs land={land} onChange={setLand} />
                  <ProjectAssumptions assumptions={assumptions} onChange={setAssumptions} />
                </div>
                <div className="lg:col-span-7 space-y-6">
                  <FeasibilitySummary
                    result={activeResult}
                    scenario={activeScenario}
                    land={land}
                    assumptions={assumptions}
                    onOpenReport={handleOpenReport}
                    onSaveProject={handleSaveCurrentProject}
                    onShareProject={() => handleOpenShare()}
                  />
                  <ZoningAreaTransparencyCard land={land} result={activeResult} assumptions={assumptions} />
                </div>
              </div>
            )}

            {/* Sub-Tab 3: HASSASİYET ANALİZİ & STRES TESTİ */}
            {activeTab === 'sensitivity' && (
              <SensitivityAnalysis
                land={land}
                assumptions={assumptions}
                scenario={activeScenario}
                baseResult={activeResult}
              />
            )}

            {/* Sub-Tab 4: GERİYE DÖNÜK HESAP (TERSİNE FİZİBİLİTE) */}
            {activeTab === 'reverse' && (
              <ReverseFeasibilityCard
                baseResult={activeResult}
                land={land}
                assumptions={assumptions}
              />
            )}

            {/* Sub-Tab 5: KARAR MOTORU */}
            {activeTab === 'decision' && (
              <div className="space-y-6">
                <LandDecisionEngine
                  result={activeResult}
                  scenario={activeScenario}
                  land={land}
                  assumptions={assumptions}
                />
              </div>
            )}

            {/* Sub-Tab 6: VARSAYIMLAR VE PİYASA PARAMETRELERİ */}
            {activeTab === 'assumptions' && (
              <AssumptionHub
                assumptions={assumptions}
                onChangeAssumptions={(upd) => setAssumptions(upd)}
                scenarios={scenarios}
                activeScenarioId={activeScenarioId}
                onUpdateScenario={handleUpdateScenario}
              />
            )}

            {/* Sub-Tab 7: ARŞİV & GEÇMİŞ PROJELER */}
            {activeTab === 'archive' && (
              <ProjectArchiveView
                savedProjects={savedProjects}
                subscription={{
                  plan: (session?.plan || 'free') as any,
                  usedCountThisMonth: session?.usedCountThisMonth || 0,
                  monthlyLimit: session?.monthlyLimit || 1,
                  userName: session?.displayName || 'Kullanıcı',
                  userEmail: session?.email || '',
                  renewalDate: session?.renewalDate || '2026-10-01',
                }}
                onLoadProject={handleSelectSavedProject}
                onDeleteProject={handleDeleteSavedProject}
                onSaveCurrentProject={handleSaveCurrentProject}
                onOpenNewFeasibility={() => setIsNewFeasibilityOpen(true)}
                onOpenReport={handleOpenReport}
                onUpgradePrompt={() => setIsPlanModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>ARSAPRO SaaS</strong> © 2026. Tüm hakları saklıdır. Gayrimenkul fizibilite ve arsa karar motoru.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setIsAdminPanelOpen(true)}
              className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
            >
              Yönetici Paneli
            </button>
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(true)}
              className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
            >
              Fiyatlandırma &amp; Paketler
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Auth Modal (Individual / Business) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        initialAccountType={authInitialAccountType}
        onLoginSuccess={(loggedUser) => {
          setSession(loggedUser);
          setIsAuthOpen(false);
          setCurrentView('dashboard');
          setSaveSuccessToast(`Hoş geldiniz, ${loggedUser.displayName}!`);
          setTimeout(() => setSaveSuccessToast(null), 3000);
        }}
      />

      {/* 2. New Feasibility Wizard Modal */}
      <NewFeasibilityModal
        isOpen={isNewFeasibilityOpen}
        onClose={() => setIsNewFeasibilityOpen(false)}
        onCalculate={handleCalculateNewFeasibility}
      />

      {/* 3. Subscription Plan Comparison Modal */}
      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plans={adminSettings.plans}
        campaign={adminSettings.campaign}
        subscription={{
          plan: (session?.plan || 'free') as any,
          usedCountThisMonth: session?.usedCountThisMonth || 0,
          monthlyLimit: session?.monthlyLimit || 1,
          userName: session?.displayName || 'Kullanıcı',
          userEmail: session?.email || '',
          renewalDate: session?.renewalDate || '2026-10-01',
        }}
        onSetPlan={(newPlan, cycle) => {
          setSelectedPlanForPayment(newPlan);
          if (cycle) setSelectedBillingCycleForPayment(cycle);
          setIsPlanModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      {/* 4. Payment / Upgrade Modal (PaymentProvider architecture) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        session={session || defaultGuestSession}
        plans={adminSettings.plans}
        creditPacks={adminSettings.creditPacks}
        initialPlanKey={selectedPlanForPayment}
        initialBillingCycle={selectedBillingCycleForPayment}
        campaign={adminSettings.campaign}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 5. Super Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        adminSettings={adminSettings}
        onUpdateAdminSettings={setAdminSettings}
        allProjects={savedProjects}
        transactions={transactions}
      />

      {/* 6. Share Project Modal (Unique link, PIN, Expiry) */}
      <ShareProjectModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setProjectToShare(null);
        }}
        project={projectToShare}
      />

      {/* 7. Professional Investor Report Modal (PDF / Print) */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        land={land}
        assumptions={assumptions}
        activeScenario={activeScenario}
        allScenarios={scenarios}
      />
    </div>
  );
}
