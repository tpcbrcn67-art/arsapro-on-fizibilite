export type LandAcquisitionType = 'cash' | 'flat_for_land' | 'revenue_share';

export type ConstructionCostTier = 'standard' | 'medium' | 'luxury' | 'custom';
export type SalesPriceInputMode = 'user_units' | 'regional_benchmark' | 'custom_scenario';

export interface RegionalBenchmark {
  id: string;
  name: string;
  locationLabel: string;
  avgSalesPricePerM2: number;
  onePlusOnePrice: number;
  twoPlusOnePrice: number;
  threePlusOnePrice: number;
}

export interface UnitTypeConfig {
  id: string;
  name: string; // e.g. "1+1", "2+1", "3+1", "4+1", "Ticari / Dükkan"
  ratio: number; // percentage of total salable area or count, e.g. 70%
  averageNetM2: number; // e.g. 45 m²
  averageGrossM2: number; // e.g. 58 m²
  unitSalesPricePerM2: number; // e.g. 65.000 TL / m²
  customUnitPriceTL?: number; // e.g. 3.200.000 TL for user entry mode
  color: string;
}

export interface LandData {
  projectName: string;
  location: string;
  city?: string;
  district?: string;
  neighborhood?: string; // Mahalle
  ada?: string; // Ada No
  parsel?: string; // Parsel No
  landAreaM2: number; // e.g. 20000 m²
  publicCessionPercent: number; // Terk oranı (Park, yol vb.) default 0% or 10-15%
  kaks: number; // Emsal (e.g. 2.00)
  taks: number; // Taban Alanı Katsayısı (e.g. 0.40 for 40%)
  maxFloors: number; // Kat sınırı / Gabari (e.g. 8)
  maxHeightYencok?: number; // Yençok (m) e.g. 24.50 m
  yencok?: number; // alias for maxHeightYencok
  slope?: 'flat' | 'moderate' | 'steep' | string; // Düz, Eğimli (%5-15), Dik/Kademeli (>%15)
  parkingType?: 'underground' | 'surface' | 'both'; // Bodrum Otopark, Açık, Karma
  parkingRequirement?: string | number; // Otopark gereksinimi m² veya araç sayısı veya tipi
  planNotes?: string; // İmar Plan Notları
  specialConditions?: string; // Özel koşullar / sit / koruma / enerji nakil hattı vb.
  folder?: string; // Proje Klasörü (Sakarya, İstanbul, Kocaeli, Armutlu vb.)
  acquisitionType: LandAcquisitionType;
  landCashPrice: number; // e.g. 200_000_000 TL
  landOwnerSharePercent: number; // e.g. 50% for kat karşılığı
  revenueSharePercent: number; // e.g. 35% for hasılat paylaşımı
  assignedEmployeeId?: string; // İşletme içi atanan çalışan
}

export interface ProjectCostAssumptions {
  costTier: ConstructionCostTier;
  constructionCostPerM2: number; // e.g. 29.500 TL / m² (inşaat metrekare maliyeti)
  salesPriceMode: SalesPriceInputMode;
  selectedRegionalBenchmarkId?: string;

  // Emsal dışı / ortak alan katsayısı ve nedenleri
  nonFarAreaRatio: number; // Toplam emsal dışı katsayı örn. %30
  parkingRatio: number; // Kapalı otopark varsayımı örn. %15
  shelterAndTechnicalRatio: number; // Sığınak & teknik hacimler örn. %8
  circulationAndShaftsRatio: number; // Yangın holleri, merdiven & şaftlar örn. %7

  netGrossEfficiency: number; // Net/Brüt katsayısı e.g. 75%
  salesContingencyOrReservePercent: number; // Beklenen satış fire / rezerv / iskonto e.g. 3.0%
  permitAndDesignPercent: number; // Ruhsat, mimari-statik proje, harçlar e.g. 3.5% of construction cost
  marketingSalesPercent: number; // Pazarlama & Satış komisyonu e.g. 2.5% of sales revenue
  generalAdminAndContingencyPercent: number; // Genel yönetim & beklenmeyen gider e.g. 4% of construction cost
  unforeseenExpensesPercent?: number; // Beklenmeyen giderler
  financeCostPercent: number; // Finansman maliyeti (isteğe bağlı) e.g. 0%
  financialCostPercent?: number; // Alias for financeCostPercent

  // Proje takvimi & süre
  projectDurationMonths: number; // Hedef süre (örn. 18 ay veya 24 ay)
  monthlySiteOverheadTL: number; // Şantiye ve yönetim aylık sabit gideri (örn. 800.000 TL/ay)
}

export interface FeasibilityScenario {
  id: string;
  name: string; // e.g. "Senaryo A: Yoğun Küçük Ünite (Yatırım Odaklı)"
  shortCode: string; // "Senaryo A"
  description: string;
  badge: string;
  unitTypes: UnitTypeConfig[];
  constructionCostPerM2: number; // override if specific
  averageUnitM2Override?: number; // target average m2
  isCustom?: boolean;
}

export interface UnitCalculatedResult {
  unitTypeId: string;
  name: string;
  count: number;
  averageNetM2: number;
  averageGrossM2: number;
  totalNetM2: number;
  totalGrossM2: number;
  salesPricePerM2: number;
  estimatedUnitSalesPrice: number;
  totalRevenue: number;
  color: string;
}

export interface AuditTrail {
  unitCount: number;
  salableGrossAreaM2: number;
  avgSalesPricePerM2: number;
  totalRevenue: number;
  landCost: number;
  constructionM2: number;
  constructionUnitCost: number;
  directConstructionCost: number;
  projectExpenses: number;
  totalCost: number;
  netProfit: number;
  marginPercent: number;
}

export interface FeasibilityResult {
  // Arsa & İmar Metrikleri
  rawLandAreaM2: number;
  netLandAreaM2: number; // Terk sonrası net arsa
  maxFootprintAreaM2: number; // TAKS x Net Arsa (Taban Oturumu)
  farAllowedAreaM2: number; // Emsale Esas İnşaat Alanı (Net Arsa x Emsal)
  nonFarAreaM2: number; // Bodrumlar, otopark, sığınak vb.
  totalConstructionAreaM2: number; // Toplam Brüt İnşaat Alanı (Maliyet esaslı)
  totalSalableGrossAreaM2: number; // Satılabilir Toplam Brüt Alan
  totalSalableNetAreaM2: number; // Satılabilir Toplam Net Alan

  // Emsal Dışı Şeffaf Kırılımı
  nonFarBreakdown: {
    parkingM2: number;
    parkingPercent: number;
    shelterTechM2: number;
    shelterTechPercent: number;
    circulationM2: number;
    circulationPercent: number;
    totalNonFarM2: number;
    totalNonFarPercent: number;
  };

  // Mimari & Kitle Kontrolü
  theoreticalMaxFloorsByFar: number; // Emsal / TAKS (e.g. 2.00 / 0.40 = 5 kat)
  isHeightRestricted: boolean; // if maxFloors < theoretical
  heightZoningNote: string;

  // Bağımsız Bölüm Dağılımı
  units: UnitCalculatedResult[];
  totalUnitCount: number;
  averageUnitGrossM2: number;
  averageUnitNetM2: number;

  // Finansal Metrikler
  totalGrossRevenue: number; // Tahmini Toplam Satış Geliri (Ciro)
  effectiveRevenueAfterContingency: number; // Satış firesi/rezerv sonrası net ciro
  developerRevenue: number; // Müteahhide kalan ciro (Nakit alımda 100%, kat karşılığında pay)
  landOwnerRevenue: number; // Arsa sahibine düşen gelir/değer

  directConstructionCost: number; // İnşaat Maliyeti (Toplam İnşaat Alanı x m² Maliyeti)
  landCost: number; // Nakit arsa bedeli veya arsa sahibine devredilen pay maliyeti
  permitAndProjectCost: number; // Ruhsat & Proje Harçları
  marketingCost: number; // Pazarlama & Satış Gideri
  generalAdminCost: number; // Genel Yönetim & Beklenmeyen Gider
  financeCost: number; // Finansman Maliyeti
  otherExpensesTotal: number; // Diğer giderler toplamı
  totalProjectCost: number; // Toplam Proje Maliyeti

  // Kârlılık
  grossProfit: number; // Tahmini Proje Kârı
  developerProfit: number; // Müteahhit Net Kârı
  profitMarginOnRevenue: number; // Kâr Marjı (Kâr / Ciro %)
  roiOnCost: number; // Yatırım Geri Dönüş Oranı (Kâr / Toplam Maliyet %)
  profitPerSalableM2: number; // Satılabilir m² Başına Kâr (TL/m²)
  profitPerUnit: number; // Bağımsız Bölüm Başına Ortalama Kâr (TL)

  // Arsa Karar Motoru & Proje Uygunluğu
  breakEvenPricePerM2: number; // Başabaş satış fiyatı (TL/m²)
  breakEvenSafetyMargin: number; // Güvenlik marjı (%)
  averageSalesPricePerM2: number; // Ağırlıklı ortalama m² satış fiyatı
  landCostSharePercent: number; // Arsa maliyetinin proje içindeki payı (%)
  constructionCostSharePercent: number; // İnşaat maliyetinin proje içindeki payı (%)
  otherExpensesSharePercent: number; // Diğer giderlerin payı (%)
  suitabilityScore: 'Çok Uygun' | 'Uygun' | 'Dengeli' | 'Riskli';
  suitabilityAssessment: string; // Karar değerlendirme açıklaması

  // Denetlenebilir Kâr Ayrıştırma Cetveli
  auditTrail: AuditTrail;

  // Risk ve Hız Göstergesi
  liquidityScore: 'Yüksek' | 'Dengeli' | 'Düşük';
  liquidityReason: string;
}

export interface StressTestState {
  salesPriceDeltaPercent: number; // e.g. -15
  constructionCostDeltaPercent: number; // e.g. +20
  delayMonths: number; // e.g. +12 (18 ay yerine 30 ay)
}

export interface StressedCalculationResult {
  stressedRevenue: number;
  stressedConstructionCost: number;
  delayExtraCost: number;
  stressedTotalCost: number;
  stressedProfit: number;
  profitDeltaTL: number;
  profitDeltaPercent: number;
  stressedMarginPercent: number;
  isProfitable: boolean;
  statusText: string;
  riskBadge: 'Düşük Risk' | 'Orta Risk' | 'Yüksek Risk' | 'Kritik Risk / Zarar';
}

export type UserPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface UserSubscription {
  plan: UserPlan;
  usedCountThisMonth: number;
  monthlyLimit: number; // 2 for free, 9999 for pro
  userName: string;
  userEmail: string;
  renewalDate: string;
}

export interface SavedFeasibility {
  id: string;
  title: string;
  createdAt: string;
  status?: 'Tamamlandı' | 'Taslak' | 'İncelemede';
  folder?: string; // Sakarya, İstanbul, Kocaeli, Armutlu vb.
  assignedEmployeeId?: string; // Sadece bu çalışana özel (ör. Mehmet)
  city: string;
  district: string;
  neighborhood?: string;
  ada?: string;
  parsel?: string;
  landAreaM2: number;
  kaks: number;
  taks: number;
  maxFloors: number;
  unitSalesPricePerM2: number;
  landPriceTL: number;
  acquisitionType: LandAcquisitionType;
  landOwnerSharePercent?: number;
  revenueSharePercent?: number;
  totalSalableGrossM2: number;
  totalRevenue: number;
  netProfit: number;
  profitMargin: number;
  roiOnCost: number;
  suitabilityScore: string;
  landData: LandData;
  assumptions: ProjectCostAssumptions;
  scenarios: FeasibilityScenario[];
  customAssumptionsFlag?: Record<string, boolean>; // hangi değerlerin kullanıcı tarafından değiştirildiği
  aiSummary?: string; // AI Yorum raporu
}

export interface ReverseFeasibilityInput {
  targetProfitTL: number; // Hedeflenen Net Kâr TL
  targetMarginPercent: number; // Hedeflenen Kâr Marjı %
}

export interface ReverseFeasibilityResult {
  requiredMinSalesPricePerM2: number;
  maxAcceptableLandPriceTL: number;
  maxAcceptableLandOwnerSharePercent: number;
  currentActualSalesPricePerM2: number;
  salesPriceDeltaPercent: number;
  isFeasibleAtCurrentMarket: boolean;
}

