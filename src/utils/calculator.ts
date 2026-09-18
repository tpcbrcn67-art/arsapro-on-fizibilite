import {
  LandData,
  ProjectCostAssumptions,
  FeasibilityScenario,
  FeasibilityResult,
  UnitCalculatedResult,
  AuditTrail,
  StressTestState,
  StressedCalculationResult,
  ReverseFeasibilityResult,
} from '../types/feasibility';

export function calculateFeasibility(
  land: LandData,
  assumptions: ProjectCostAssumptions,
  scenario: FeasibilityScenario
): FeasibilityResult {
  // 1. Arsa ve İmar Alanları
  const rawLandAreaM2 = Math.max(0, land.landAreaM2);
  const cessionRatio = Math.max(0, Math.min(60, land.publicCessionPercent)) / 100;
  const netLandAreaM2 = rawLandAreaM2 * (1 - cessionRatio);

  const taks = Math.max(0.01, Math.min(1, land.taks));
  const maxFootprintAreaM2 = netLandAreaM2 * taks; // Taban Oturumu

  const kaks = Math.max(0.1, land.kaks);
  const farAllowedAreaM2 = netLandAreaM2 * kaks; // Emsale Esas Alan

  // Emsal dışı alanlar (Bodrum otoparklar, sığınak, yangın holleri, su deposu vb.)
  // Şeffaf Varsayım Kırılımı: Otopark (%15) + Sığınak & Teknik (%8) + Sirkülasyon & Şaftlar (%7) = %30
  const parkingRatio = assumptions.parkingRatio ?? 15;
  const shelterTechRatio = assumptions.shelterAndTechnicalRatio ?? 8;
  const circulationRatio = assumptions.circulationAndShaftsRatio ?? 7;
  const nonFarRatio = Math.max(0, assumptions.nonFarAreaRatio || (parkingRatio + shelterTechRatio + circulationRatio)) / 100;

  const nonFarAreaM2 = farAllowedAreaM2 * nonFarRatio;
  const parkingM2 = farAllowedAreaM2 * (parkingRatio / 100);
  const shelterTechM2 = farAllowedAreaM2 * (shelterTechRatio / 100);
  const circulationM2 = farAllowedAreaM2 * (circulationRatio / 100);

  // Toplam İnşaat Alanı (Tüm maliyetlerin baz alındığı toplam metrekare: Emsal + Emsal Dışı)
  const totalConstructionAreaM2 = farAllowedAreaM2 + nonFarAreaM2;

  // Satılabilir Brüt Alan (Emsale esas alan bağımsız bölümlere tahsis edilir)
  const totalSalableGrossAreaM2 = farAllowedAreaM2;
  const efficiency = Math.max(0.4, Math.min(0.95, assumptions.netGrossEfficiency / 100));
  const totalSalableNetAreaM2 = totalSalableGrossAreaM2 * efficiency;

  // 2. İmar ve Kitle Uyumluluk Analizi
  const theoreticalFloorsAtMaxTaks = farAllowedAreaM2 / (maxFootprintAreaM2 || 1);
  const isHeightRestricted = land.maxFloors > 0 && theoreticalFloorsAtMaxTaks > land.maxFloors;
  
  let heightZoningNote = '';
  if (isHeightRestricted) {
    heightZoningNote = `Maksimum kat sınırı (${land.maxFloors} kat) ve azami TAKS (%${Math.round(taks * 100)}) ile azami ${formatM2(maxFootprintAreaM2 * land.maxFloors)} inşa edilebilir. Emsal (${formatM2(farAllowedAreaM2)}) için kat sınırı artışı veya plan notu revizyonu gerekebilir.`;
  } else if (land.maxFloors > 0) {
    const requiredFootprintForMaxFloors = farAllowedAreaM2 / land.maxFloors;
    const requiredTaks = (requiredFootprintForMaxFloors / (netLandAreaM2 || 1)) * 100;
    heightZoningNote = `${land.maxFloors} kat yapıldığında zemin oturumu ${formatM2(requiredFootprintForMaxFloors)} (%${requiredTaks.toFixed(1)} TAKS) olur. Kalan ${formatM2(netLandAreaM2 - requiredFootprintForMaxFloors)} açık yeşil/peyzaj alanı olarak kalır.`;
  } else {
    heightZoningNote = `Kat sınırı belirtilmedi. Taban oturumuna göre ~${Math.ceil(theoreticalFloorsAtMaxTaks)} katlı kitle yerleşimi uygundur.`;
  }

  // 3. Bağımsız Bölüm Dağılımı Hesaplama
  const unitTypes = scenario.unitTypes;
  const totalRatio = unitTypes.reduce((sum, u) => sum + u.ratio, 0) || 100;

  const units: UnitCalculatedResult[] = unitTypes.map((unit) => {
    const normalizedRatio = unit.ratio / totalRatio;
    const allocatedGrossM2 = totalSalableGrossAreaM2 * normalizedRatio;
    const grossPerUnit = Math.max(25, unit.averageGrossM2);
    const count = Math.max(1, Math.round(allocatedGrossM2 / grossPerUnit));
    const netPerUnit = Math.max(15, unit.averageNetM2 || grossPerUnit * efficiency);
    
    // Gerçekleşen toplam alanlar
    const totalUnitGrossM2 = count * grossPerUnit;
    const totalUnitNetM2 = count * netPerUnit;

    // Satış fiyatı: Eğer kullanıcı bazlı ünite fiyatı girilmişse onu baz al, yoksa m² fiyatı
    let estimatedUnitSalesPrice = unit.customUnitPriceTL && unit.customUnitPriceTL > 0
      ? unit.customUnitPriceTL
      : grossPerUnit * unit.unitSalesPricePerM2;
    
    const effectiveUnitPricePerM2 = estimatedUnitSalesPrice / (grossPerUnit || 1);
    const totalRevenue = count * estimatedUnitSalesPrice;

    return {
      unitTypeId: unit.id,
      name: unit.name,
      count,
      averageNetM2: netPerUnit,
      averageGrossM2: grossPerUnit,
      totalNetM2: totalUnitNetM2,
      totalGrossM2: totalUnitGrossM2,
      salesPricePerM2: effectiveUnitPricePerM2,
      estimatedUnitSalesPrice,
      totalRevenue,
      color: unit.color,
    };
  });

  const totalUnitCount = units.reduce((sum, u) => sum + u.count, 0);
  const totalCalculatedSalableGross = units.reduce((sum, u) => sum + u.totalGrossM2, 0);
  const totalCalculatedSalableNet = units.reduce((sum, u) => sum + u.totalNetM2, 0);
  const averageUnitGrossM2 = totalUnitCount > 0 ? totalCalculatedSalableGross / totalUnitCount : 0;
  const averageUnitNetM2 = totalUnitCount > 0 ? totalCalculatedSalableNet / totalUnitCount : 0;

  // 4. Gelirler (Ciro)
  const totalGrossRevenue = units.reduce((sum, u) => sum + u.totalRevenue, 0);
  const salesReserveRatio = Math.max(0, assumptions.salesContingencyOrReservePercent || 0) / 100;
  const effectiveRevenueAfterContingency = totalGrossRevenue * (1 - salesReserveRatio);

  let developerRevenue = totalGrossRevenue;
  let landOwnerRevenue = 0;

  if (land.acquisitionType === 'flat_for_land') {
    const devShareRatio = (100 - land.landOwnerSharePercent) / 100;
    developerRevenue = totalGrossRevenue * devShareRatio;
    landOwnerRevenue = totalGrossRevenue * (land.landOwnerSharePercent / 100);
  } else if (land.acquisitionType === 'revenue_share') {
    const devShareRatio = (100 - land.revenueSharePercent) / 100;
    developerRevenue = totalGrossRevenue * devShareRatio;
    landOwnerRevenue = totalGrossRevenue * (land.revenueSharePercent / 100);
  } else {
    // Nakit Alım (Cash)
    developerRevenue = totalGrossRevenue;
    landOwnerRevenue = land.landCashPrice;
  }

  // 5. İnşaat ve Diğer Maliyetler
  const constructionCostPerM2 = scenario.constructionCostPerM2 || assumptions.constructionCostPerM2;
  const directConstructionCost = totalConstructionAreaM2 * constructionCostPerM2;

  const permitAndProjectCost = directConstructionCost * (assumptions.permitAndDesignPercent / 100);
  const marketingCost = totalGrossRevenue * (assumptions.marketingSalesPercent / 100);
  const generalAdminCost = directConstructionCost * (assumptions.generalAdminAndContingencyPercent / 100);
  const financeCost = directConstructionCost * (assumptions.financeCostPercent / 100);
  const otherExpensesTotal = permitAndProjectCost + marketingCost + generalAdminCost + financeCost;

  let landCost = 0;
  let totalProjectCost = 0;
  let developerProfit = 0;

  if (land.acquisitionType === 'cash') {
    landCost = land.landCashPrice;
    totalProjectCost = landCost + directConstructionCost + otherExpensesTotal;
    developerProfit = totalGrossRevenue - totalProjectCost;
  } else {
    // Kat Karşılığı veya Hasılat Paylaşımı:
    landCost = landOwnerRevenue; // Arsa sahibine verilen değer
    totalProjectCost = directConstructionCost + otherExpensesTotal;
    developerProfit = developerRevenue - totalProjectCost;
  }

  const grossProfit = land.acquisitionType === 'cash' 
    ? totalGrossRevenue - totalProjectCost 
    : developerProfit;

  const profitMarginOnRevenue = totalGrossRevenue > 0 
    ? (grossProfit / (land.acquisitionType === 'cash' ? totalGrossRevenue : developerRevenue)) * 100 
    : 0;

  const roiOnCost = totalProjectCost > 0 ? (grossProfit / totalProjectCost) * 100 : 0;
  const profitPerSalableM2 = totalCalculatedSalableGross > 0 ? grossProfit / totalCalculatedSalableGross : 0;
  const profitPerUnit = totalUnitCount > 0 ? grossProfit / totalUnitCount : 0;

  // 6. Arsa Karar Motoru & Başabaş Fiyat Metrikleri
  const averageSalesPricePerM2 = totalCalculatedSalableGross > 0
    ? totalGrossRevenue / totalCalculatedSalableGross
    : 0;

  // Başabaş Satış Fiyatı: Toplam maliyetin karşılanması için satılabilir m² başına minimum satış fiyatı
  const breakEvenPricePerM2 = totalCalculatedSalableGross > 0
    ? totalProjectCost / totalCalculatedSalableGross
    : 0;

  // Güvenlik Marjı: Mevcut satış fiyatı başabaşın yüzde kaç üzerinde?
  const breakEvenSafetyMargin = averageSalesPricePerM2 > 0
    ? ((averageSalesPricePerM2 - breakEvenPricePerM2) / averageSalesPricePerM2) * 100
    : 0;

  // Maliyet Payları
  const landCostSharePercent = totalProjectCost > 0 ? (landCost / totalProjectCost) * 100 : 0;
  const constructionCostSharePercent = totalProjectCost > 0 ? (directConstructionCost / totalProjectCost) * 100 : 0;
  const otherExpensesSharePercent = totalProjectCost > 0 ? (otherExpensesTotal / totalProjectCost) * 100 : 0;

  // Proje Uygunluk Skoru ve Analitik Karar Değerlendirmesi
  let suitabilityScore: 'Çok Uygun' | 'Uygun' | 'Dengeli' | 'Riskli' = 'Dengeli';
  let suitabilityAssessment = '';

  if (profitMarginOnRevenue >= 25 && breakEvenSafetyMargin >= 25 && landCostSharePercent <= 30) {
    suitabilityScore = 'Çok Uygun';
    suitabilityAssessment = `Yüksek kârlılık (%${profitMarginOnRevenue.toFixed(1)}) ve güçlü güvenlik marjı (%${breakEvenSafetyMargin.toFixed(1)}). Arsa payı (%${landCostSharePercent.toFixed(1)}) makul seviyede; pazar dalgalanmalarına karşı dayanıklı.`;
  } else if (profitMarginOnRevenue >= 18 && breakEvenSafetyMargin >= 18) {
    suitabilityScore = 'Uygun';
    suitabilityAssessment = `Sektör ortalamasının üzerinde kâr marjı (%${profitMarginOnRevenue.toFixed(1)}) ve tatmin edici yatırım geri dönüşü (ROI: %${roiOnCost.toFixed(1)}). Uygulama için elverişli.`;
  } else if (profitMarginOnRevenue >= 10 && breakEvenSafetyMargin >= 10) {
    suitabilityScore = 'Dengeli';
    suitabilityAssessment = `Hassas kâr marjı (%${profitMarginOnRevenue.toFixed(1)}). İnşaat maliyeti veya faiz artışları kârı eritebilir; maliyet kontrolü ve sıkı sözleşme yönetimi şart.`;
  } else {
    suitabilityScore = 'Riskli';
    suitabilityAssessment = `Düşük güvenlik marjı (%${breakEvenSafetyMargin.toFixed(1)}) veya yetersiz kârlılık. Arsa maliyeti revizyonu veya m² satış fiyatı artışı sağlanmadan geliştirme riski yüksektir.`;
  }

  // 7. Likidite & Satış Hızı Öngörüsü
  let liquidityScore: 'Yüksek' | 'Dengeli' | 'Düşük' = 'Dengeli';
  let liquidityReason = '';

  const onePlusOneRatio = (units.find((u) => u.name.includes('1+1'))?.count || 0) / (totalUnitCount || 1);
  const averageTicket = totalGrossRevenue / (totalUnitCount || 1);

  if (onePlusOneRatio >= 0.55 || averageUnitGrossM2 <= 65) {
    liquidityScore = 'Yüksek';
    liquidityReason = 'Küçük metrekare ve erişilebilir ünite fiyatları sayesinde satış hızı ve nakit dönüşümü yüksek öngörülmektedir.';
  } else if (averageUnitGrossM2 >= 100 || averageTicket >= 9_000_000) {
    liquidityScore = 'Düşük';
    liquidityReason = 'Geniş ünite ve yüksek sepet tutarı sebebiyle hedef kitle niş kalabilir, proje satış periyodu daha uzun planlanmalıdır.';
  } else {
    liquidityScore = 'Dengeli';
    liquidityReason = 'Farklı alıcı profillerine (yatırımcı + oturumcu aile) hitap eden dengeli talep dağılımı.';
  }

  // 8. Denetlenebilir Kâr Ayrıştırma Cetveli (Calculation Audit Trail)
  const auditTrail: AuditTrail = {
    unitCount: totalUnitCount,
    salableGrossAreaM2: totalCalculatedSalableGross,
    avgSalesPricePerM2: averageSalesPricePerM2,
    totalRevenue: totalGrossRevenue,
    landCost,
    constructionM2: totalConstructionAreaM2,
    constructionUnitCost: constructionCostPerM2,
    directConstructionCost,
    projectExpenses: otherExpensesTotal,
    totalCost: totalProjectCost,
    netProfit: grossProfit,
    marginPercent: profitMarginOnRevenue,
  };

  return {
    rawLandAreaM2,
    netLandAreaM2,
    maxFootprintAreaM2,
    farAllowedAreaM2,
    nonFarAreaM2,
    totalConstructionAreaM2,
    totalSalableGrossAreaM2: totalCalculatedSalableGross,
    totalSalableNetAreaM2: totalCalculatedSalableNet,
    nonFarBreakdown: {
      parkingM2,
      parkingPercent: parkingRatio,
      shelterTechM2,
      shelterTechPercent: shelterTechRatio,
      circulationM2,
      circulationPercent: circulationRatio,
      totalNonFarM2: nonFarAreaM2,
      totalNonFarPercent: nonFarRatio * 100,
    },
    theoreticalMaxFloorsByFar: theoreticalFloorsAtMaxTaks,
    isHeightRestricted,
    heightZoningNote,
    units,
    totalUnitCount,
    averageUnitGrossM2,
    averageUnitNetM2,
    totalGrossRevenue,
    effectiveRevenueAfterContingency,
    developerRevenue,
    landOwnerRevenue,
    directConstructionCost,
    landCost,
    permitAndProjectCost,
    marketingCost,
    generalAdminCost,
    financeCost,
    otherExpensesTotal,
    totalProjectCost,
    grossProfit,
    developerProfit,
    profitMarginOnRevenue,
    roiOnCost,
    profitPerSalableM2,
    profitPerUnit,
    breakEvenPricePerM2,
    breakEvenSafetyMargin,
    averageSalesPricePerM2,
    landCostSharePercent,
    constructionCostSharePercent,
    otherExpensesSharePercent,
    suitabilityScore,
    suitabilityAssessment,
    auditTrail,
    liquidityScore,
    liquidityReason,
  };
}

export function calculateStressTest(
  baseResult: FeasibilityResult,
  assumptions: ProjectCostAssumptions,
  stress: StressTestState
): StressedCalculationResult {
  const salesMultiplier = 1 + stress.salesPriceDeltaPercent / 100;
  const stressedRevenue = baseResult.totalGrossRevenue * salesMultiplier;

  const constructionMultiplier = 1 + stress.constructionCostDeltaPercent / 100;
  const stressedConstructionCost = baseResult.directConstructionCost * constructionMultiplier;

  // Süre gecikmesi ek sabit şantiye ve genel gideri
  const monthlyOverhead = assumptions.monthlySiteOverheadTL || 850000;
  const delayExtraCost = Math.max(0, stress.delayMonths) * monthlyOverhead;

  // Değişen pazarlama gideri (satış hasılatına bağlı)
  const stressedMarketingCost = stressedRevenue * (assumptions.marketingSalesPercent / 100);
  const otherExpensesStressed = (baseResult.otherExpensesTotal - baseResult.marketingCost) + stressedMarketingCost + delayExtraCost;

  const stressedTotalCost = baseResult.landCost + stressedConstructionCost + otherExpensesStressed;
  const stressedProfit = stressedRevenue - stressedTotalCost;

  const profitDeltaTL = stressedProfit - baseResult.grossProfit;
  const profitDeltaPercent = baseResult.grossProfit !== 0
    ? (profitDeltaTL / Math.abs(baseResult.grossProfit)) * 100
    : 0;

  const stressedMarginPercent = stressedRevenue > 0
    ? (stressedProfit / stressedRevenue) * 100
    : 0;

  const isProfitable = stressedProfit > 0;

  let riskBadge: StressedCalculationResult['riskBadge'] = 'Düşük Risk';
  let statusText = '';

  if (!isProfitable) {
    riskBadge = 'Kritik Risk / Zarar';
    statusText = `Bu stres koşullarında proje ${Math.abs(stressedProfit).toLocaleString('tr-TR')} TL net zarara geçmektedir. Satış fiyatı tamponu tükenmiştir.`;
  } else if (stressedMarginPercent < 10) {
    riskBadge = 'Yüksek Risk';
    statusText = `Proje kârda kalmakla birlikte kâr marjı %${stressedMarginPercent.toFixed(1)} seviyesine gerilemekte ve kritik eşiğe yaklaşmaktadır.`;
  } else if (stressedMarginPercent < 20) {
    riskBadge = 'Orta Risk';
    statusText = `Kârda %${Math.abs(profitDeltaPercent).toFixed(1)} erime görülmekte ancak proje %${stressedMarginPercent.toFixed(1)} marj ile pozitif kalmayı sürdürmektedir.`;
  } else {
    riskBadge = 'Düşük Risk';
    statusText = `Proje dayanıklılığı yüksek; stres senaryosuna rağmen kâr marjı %${stressedMarginPercent.toFixed(1)} seviyesindedir.`;
  }

  return {
    stressedRevenue,
    stressedConstructionCost,
    delayExtraCost,
    stressedTotalCost,
    stressedProfit,
    profitDeltaTL,
    profitDeltaPercent,
    stressedMarginPercent,
    isProfitable,
    statusText,
    riskBadge,
  };
}

function formatM2(val: number): string {
  return `${Math.round(val).toLocaleString('tr-TR')} m²`;
}

/**
 * Geriye Dönük Hesap (Reverse Feasibility):
 * "Hedef kâr için en az kaç TL/m² satış fiyatı gerekir?"
 * "Hedef kâr için kabul edilebilir maksimum arsa bedeli nedir?"
 */
export function calculateReverseFeasibility(
  baseResult: FeasibilityResult,
  land: LandData,
  assumptions: ProjectCostAssumptions,
  targetProfitTL: number,
  targetMarginPercent: number
): ReverseFeasibilityResult {
  const salableM2 = baseResult.totalSalableGrossAreaM2 || 1;
  const currentActualSalesPricePerM2 = baseResult.averageSalesPricePerM2;

  // 1. Hedef kâra göre gerekli ciro ve satış fiyatı:
  // Ciro = Toplam Maliyet + Hedef Kâr
  // Eğer hedef kâr marjı %M verilmişse: Kâr = Ciro * M => Ciro * (1 - M) = Maliyet => Ciro = Maliyet / (1 - M)
  const nonMarketingCosts = baseResult.directConstructionCost + 
    baseResult.permitAndProjectCost + 
    baseResult.generalAdminCost + 
    baseResult.financeCost + 
    (land.acquisitionType === 'cash' ? land.landCashPrice : 0);

  const marketingRatio = (assumptions.marketingSalesPercent || 2.5) / 100;

  let requiredRevenue = 0;
  if (targetProfitTL > 0) {
    // Ciro - (Maliyet_sabit + Ciro * marketingRatio) = targetProfitTL
    // Ciro * (1 - marketingRatio) = nonMarketingCosts + targetProfitTL
    requiredRevenue = (nonMarketingCosts + targetProfitTL) / (1 - marketingRatio);
  } else if (targetMarginPercent > 0) {
    const marginRatio = Math.min(0.9, targetMarginPercent / 100);
    // Ciro * (1 - marketingRatio - marginRatio) = nonMarketingCosts
    const denom = 1 - marketingRatio - marginRatio;
    requiredRevenue = denom > 0.05 ? nonMarketingCosts / denom : nonMarketingCosts * 1.5;
  } else {
    requiredRevenue = baseResult.totalGrossRevenue;
  }

  const requiredMinSalesPricePerM2 = requiredRevenue / salableM2;
  const salesPriceDeltaPercent = currentActualSalesPricePerM2 > 0
    ? ((requiredMinSalesPricePerM2 - currentActualSalesPricePerM2) / currentActualSalesPricePerM2) * 100
    : 0;

  // 2. Maksimum Kabul Edilebilir Arsa Fiyatı:
  // Mevcut cirodan inşaat ve diğer giderler ve hedef kâr çıkarıldığında arsa için kalan maksimum tutar
  const currentGrossRevenue = baseResult.totalGrossRevenue;
  const constructionAndOverhead = baseResult.directConstructionCost + baseResult.otherExpensesTotal;
  const profitDeduction = targetProfitTL > 0 
    ? targetProfitTL 
    : currentGrossRevenue * (Math.max(5, targetMarginPercent) / 100);

  const maxAcceptableLandPriceTL = Math.max(0, currentGrossRevenue - constructionAndOverhead - profitDeduction);

  // Kat karşılığı için maksimum arsa sahibi payı
  const maxAcceptableLandOwnerSharePercent = currentGrossRevenue > 0
    ? Math.min(65, Math.max(20, (maxAcceptableLandPriceTL / currentGrossRevenue) * 100))
    : 45;

  const isFeasibleAtCurrentMarket = currentActualSalesPricePerM2 >= requiredMinSalesPricePerM2;

  return {
    requiredMinSalesPricePerM2,
    maxAcceptableLandPriceTL,
    maxAcceptableLandOwnerSharePercent,
    currentActualSalesPricePerM2,
    salesPriceDeltaPercent,
    isFeasibleAtCurrentMarket,
  };
}

/**
 * Senaryo Kopyalama (Clone Scenario)
 */
export function cloneScenario(
  sourceScenario: FeasibilityScenario,
  newId?: string | number,
  newCode?: string,
  newName?: string
): FeasibilityScenario {
  const timestamp = Date.now();
  const idStr = typeof newId === 'string' && newId ? newId : `scenario_custom_${timestamp}`;
  const codeStr = newCode || `Senaryo ${String.fromCharCode(68 + (typeof newId === 'number' ? newId : 0))}`;
  const nameStr = newName || `${sourceScenario.name} (Kopya)`;
  return {
    ...sourceScenario,
    id: idStr,
    shortCode: codeStr,
    name: nameStr,
    badge: 'Kopya Senaryo',
    isCustom: true,
    unitTypes: sourceScenario.unitTypes.map((u) => ({
      ...u,
      id: `${idStr}_${u.name.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(2, 6)}`,
    })),
  };
}

/**
 * Yapay Zekâ (AI) Proje Yorumlama ve Risk Değerlendirmesi:
 * Deterministik hesaplama motoru sonuçlarını analiz ederek;
 * 1. Yüksek maliyet riskleri
 * 2. Satış fiyatı hassasiyeti ve tamponu
 * 3. Senaryo farkları ve kârlılık optimizasyonu
 * 4. Plan notları ve imar riskleri konularında profesyonel gayrimenkul uzmanı raporu üretir.
 */
export function generateAIProjectCommentary(
  land: LandData,
  assumptions: ProjectCostAssumptions,
  scenario: FeasibilityScenario,
  result: FeasibilityResult
): string {
  const margin = result.profitMarginOnRevenue;
  const safety = result.breakEvenSafetyMargin;
  const unitCount = result.totalUnitCount;
  const landShare = result.landCostSharePercent;
  const constShare = result.constructionCostSharePercent;

  let riskLevel = 'Düşük-Orta Risk';
  if (margin < 12 || safety < 12) riskLevel = 'Yüksek Risk / Hassas';
  else if (margin >= 25 && safety >= 25) riskLevel = 'Düşük Risk / Güçlü Fizibilite';

  const notes: string[] = [];

  // 1. Maliyet ve Arsa Payı Analizi
  if (landShare > 40) {
    notes.push(`⚠️ **Arsa Maliyeti Yükü Yüksek (%${landShare.toFixed(1)}):** Toplam proje maliyetinde arsa payının %40'ı aşması müteahhit kâr marjını daraltmaktadır. Arsa alım bedelinde pazarlık veya kat karşılığı oranında indirim hedeflenmelidir.`);
  } else {
    notes.push(`✅ **Dengeli Arsa/İnşaat Oranı (%${landShare.toFixed(1)} Arsa / %${constShare.toFixed(1)} İnşaat):** Arsa maliyetinin proje bütçesindeki ağırlığı sektör normlarına uygun ve pazar dalgalanmalarına karşı tampon oluşturmaktadır.`);
  }

  // 2. Satış Fiyatı Hassasiyeti ve Güvenlik Marjı
  if (safety < 15) {
    notes.push(`🚨 **Kritik Satış Fiyatı Tamponu (%${safety.toFixed(1)}):** Projenin başabaş satış fiyatı (${Math.round(result.breakEvenPricePerM2).toLocaleString('tr-TR')} TL/m²) ile öngörülen satış fiyatı (${Math.round(result.averageSalesPricePerM2).toLocaleString('tr-TR')} TL/m²) arasındaki fark dardır. Bölge konut piyasasında %10-15'lik bir fiyat durgunluğu veya iskonto projenin kârını sıfırlayabilir.`);
  } else {
    notes.push(`🛡️ **Güçlü Fiyat Güvenlik Marjı (%${safety.toFixed(1)}):** Bölge satış fiyatları %${safety.toFixed(0)} gerilese dahi proje maliyetlerini karşılayıp başabaş noktasında kalabilmektedir.`);
  }

  // 3. Tip Dağılımı ve Likidite
  const avgM2 = result.averageUnitGrossM2;
  if (avgM2 <= 65) {
    notes.push(`⚡ **Yüksek Satış Hızı (Hızlı Likidite):** Ortalama ${Math.round(avgM2)} m² küçük ünite konsepti, erişilebilir toplam bütçesi sayesinde yatırımcı talebini hızlandırıp inşaat finansman yükünü hafifletecektir.`);
  } else if (avgM2 >= 110) {
    notes.push(`⏳ **Geniş Ünite / Uzun Satış Döngüsü:** Ortalama ${Math.round(avgM2)} m² oturum odaklı büyük konut yapısı, toplam satış süresini uzatabilir. Kademe kademe lansman yapılması ve nakit akışının şantiye temposuna göre planlanması önerilir.`);
  }

  // 4. İmar & Plan Notu Uyarısı
  if (land.maxFloors > 0 && result.isHeightRestricted) {
    notes.push(`⚠️ **Kat Sınırı Uyarısı:** Emsal hakkının tamamını kullanmak mevcut ${land.maxFloors} kat sınırı ve TAKS ile sınırlı kalmaktadır. Çatı arası veya plan notu tadilatı gerekebilir.`);
  }

  return `### 🧠 ARSAPRO AI Proje Değerlendirme Raporu
**Genel Değerlendirme Skoru:** **${riskLevel}** | **Öngörülen Net Kâr Marjı:** **%${margin.toFixed(1)}**

${notes.join('\n\n')}

> **Uzman Strateji Önerisi:** Proje finansmanında ön satış (lansman) oranının inşaat başlangıcında en az %30 seviyesine çıkarılması, inşaat demiri ve hazır beton gibi temel girdilerde erken tedarik anlaşması yapılması kâr marjını güvenceye alacaktır.`;
}

