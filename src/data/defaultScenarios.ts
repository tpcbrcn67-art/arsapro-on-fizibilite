import {
  LandData,
  ProjectCostAssumptions,
  FeasibilityScenario,
  RegionalBenchmark,
} from '../types/feasibility';

export const regionalBenchmarks: RegionalBenchmark[] = [
  {
    id: 'reg_istanbul_growth',
    name: 'İstanbul Gelişme Aksı (Başakşehir / Çekmeköy / Beylikdüzü)',
    locationLabel: 'Gelişen Konut Bölgesi',
    avgSalesPricePerM2: 65000,
    onePlusOnePrice: 3200000,
    twoPlusOnePrice: 4500000,
    threePlusOnePrice: 6200000,
  },
  {
    id: 'reg_istanbul_prime',
    name: 'İstanbul Merkezi / Prestij (Kadıköy / Beşiktaş / Sarıyer)',
    locationLabel: 'A+ Merkezi Lokasyon',
    avgSalesPricePerM2: 110000,
    onePlusOnePrice: 5500000,
    twoPlusOnePrice: 8800000,
    threePlusOnePrice: 13500000,
  },
  {
    id: 'reg_anatolian_metro',
    name: 'Anadolu Metropol (İzmir / Ankara / Bursa)',
    locationLabel: 'Büyükşehir Merkezi',
    avgSalesPricePerM2: 48000,
    onePlusOnePrice: 2400000,
    twoPlusOnePrice: 3500000,
    threePlusOnePrice: 4800000,
  },
  {
    id: 'reg_resort_coast',
    name: 'Sayfiye / Kıyı Şeridi (Bodrum / Çeşme / Antalya)',
    locationLabel: 'Turizm & Yaşam',
    avgSalesPricePerM2: 85000,
    onePlusOnePrice: 4200000,
    twoPlusOnePrice: 6500000,
    threePlusOnePrice: 9500000,
  },
];

export const initialLandData: LandData = {
  projectName: 'Batı Yakası Konut Geliştirme Projesi',
  location: 'İstanbul / Başakşehir - Bahçeşehir Bölgesi',
  landAreaM2: 20000,
  publicCessionPercent: 0, // %0 (Doğrudan net parsel kabulü)
  kaks: 2.00, // Emsal 2.00
  taks: 0.40, // %40
  maxFloors: 8, // 8 kat sınırı
  acquisitionType: 'cash',
  landCashPrice: 200_000_000, // 200 Milyon TL
  landOwnerSharePercent: 50, // %50 kat karşılığı seçilirse
  revenueSharePercent: 35, // %35 hasılat paylaşımı seçilirse
};

export const initialCostAssumptions: ProjectCostAssumptions = {
  costTier: 'medium', // Orta segment
  constructionCostPerM2: 29500, // 29.500 TL / m² - user requested explicit value
  salesPriceMode: 'user_units', // 'user_units' | 'regional_benchmark' | 'custom_scenario'
  selectedRegionalBenchmarkId: 'reg_istanbul_growth',

  // Emsal Dışı Şeffaf Kırılım (%30 toplam)
  nonFarAreaRatio: 30, // %30
  parkingRatio: 15, // %15 Kapalı otopark
  shelterAndTechnicalRatio: 8, // %8 Sığınak & teknik hacim
  circulationAndShaftsRatio: 7, // %7 Yangın holleri, merdiven & şaftlar

  netGrossEfficiency: 75, // %75 Net / Brüt verimliliği
  salesContingencyOrReservePercent: 3.0, // %3.0 satış firesi / pazarlama iskontosu
  permitAndDesignPercent: 3.5, // Ruhsat & Proje harçları %3.5
  marketingSalesPercent: 2.5, // Pazarlama & Satış %2.5
  generalAdminAndContingencyPercent: 4.0, // Genel yönetim & Beklenmeyen %4.0
  financeCostPercent: 0, // Finansman maliyeti %0

  projectDurationMonths: 24, // 24 ay
  monthlySiteOverheadTL: 850000, // 850.000 TL/ay şantiye ve genel yönetim
};

export const defaultScenarios: FeasibilityScenario[] = [
  {
    id: 'scenario_a',
    shortCode: 'Senaryo A',
    name: 'Küçük Ünite & Yatırım Odaklı (500 Daire)',
    description: 'Yüksek adetli kompakt 1+1 ve 2+1 üniteler. Hızlı satış, yüksek toplam ciro potansiyeli ve erişilebilir bütçe hedefi.',
    badge: 'Yüksek Satış Hızı & Ciro',
    constructionCostPerM2: 29500,
    averageUnitM2Override: 50,
    unitTypes: [
      {
        id: 'u_1',
        name: '1+1 Rezidans',
        ratio: 42, // %42 alan payı
        averageNetM2: 36,
        averageGrossM2: 48,
        unitSalesPricePerM2: 66667, // 48 m² x 66.667 = ~3.200.000 TL
        customUnitPriceTL: 3200000,
        color: '#3B82F6', // blue
      },
      {
        id: 'u_2',
        name: '2+1 Kompakt',
        ratio: 38, // %38 alan payı
        averageNetM2: 56,
        averageGrossM2: 75,
        unitSalesPricePerM2: 60000, // 75 m² x 60.000 = ~4.500.000 TL
        customUnitPriceTL: 4500000,
        color: '#10B981', // emerald
      },
      {
        id: 'u_3',
        name: '3+1 Standart',
        ratio: 20, // %20 alan payı
        averageNetM2: 82,
        averageGrossM2: 110,
        unitSalesPricePerM2: 56364, // 110 m² x 56.364 = ~6.200.000 TL
        customUnitPriceTL: 6200000,
        color: '#F59E0B', // amber
      },
    ],
  },
  {
    id: 'scenario_b',
    shortCode: 'Senaryo B',
    name: 'Dengeli Karma & Aile Yaşamı (400 Daire)',
    description: 'Hem yatırımcıya hem çekirdek ailelere hitap eden dengeli 1+1, 2+1 ve 3+1 miksi. Dengeli risk ve sürdürülebilir talep.',
    badge: 'Dengeli Risk & Yaşam Odaklı',
    constructionCostPerM2: 29500,
    averageUnitM2Override: 70,
    unitTypes: [
      {
        id: 'u_1',
        name: '1+1 Standart',
        ratio: 20, // %20
        averageNetM2: 38,
        averageGrossM2: 50,
        unitSalesPricePerM2: 66000,
        customUnitPriceTL: 3300000,
        color: '#3B82F6',
      },
      {
        id: 'u_2',
        name: '2+1 Konfor',
        ratio: 50, // %50
        averageNetM2: 64,
        averageGrossM2: 85,
        unitSalesPricePerM2: 62000,
        customUnitPriceTL: 5270000,
        color: '#10B981',
      },
      {
        id: 'u_3',
        name: '3+1 Aile',
        ratio: 30, // %30
        averageNetM2: 94,
        averageGrossM2: 125,
        unitSalesPricePerM2: 59000,
        customUnitPriceTL: 7375000,
        color: '#F59E0B',
      },
    ],
  },
  {
    id: 'scenario_c',
    shortCode: 'Senaryo C',
    name: 'Geniş Aile & Prestij Konsepti (300 Daire)',
    description: 'Ağırlıklı ferah 2+1, 3+1 ve 4+1 aile daireleri. Prestijli sosyal tesis, yüksek m² birim satış değeri ve nitelikli oturumcu kitlesi.',
    badge: 'Yüksek m² Değeri & Prestij',
    constructionCostPerM2: 32500, // Üst segment donatı
    averageUnitM2Override: 90,
    unitTypes: [
      {
        id: 'u_1',
        name: '1+1 Butik',
        ratio: 7, // %7
        averageNetM2: 42,
        averageGrossM2: 55,
        unitSalesPricePerM2: 74000,
        customUnitPriceTL: 4070000,
        color: '#3B82F6',
      },
      {
        id: 'u_2',
        name: '2+1 Ferah',
        ratio: 43, // %43
        averageNetM2: 68,
        averageGrossM2: 90,
        unitSalesPricePerM2: 70000,
        customUnitPriceTL: 6300000,
        color: '#10B981',
      },
      {
        id: 'u_3',
        name: '3+1 & 4+1 Prestij',
        ratio: 50, // %50
        averageNetM2: 102,
        averageGrossM2: 135,
        unitSalesPricePerM2: 66000,
        customUnitPriceTL: 8910000,
        color: '#8B5CF6', // purple
      },
    ],
  },
];

export interface LandPreset {
  id: string;
  name: string;
  tag: string;
  land: Partial<LandData>;
}

export const landPresets: LandPreset[] = [
  {
    id: 'preset_user_20k',
    name: 'Kullanıcı Örneği: 20.000 m² Arsa (Emsal 2.0, 200M TL)',
    tag: 'Varsayılan',
    land: {
      projectName: 'Büyük Ölçekli Konut Geliştirme',
      location: 'İstanbul Gelişme Aksı',
      landAreaM2: 20000,
      kaks: 2.00,
      taks: 0.40,
      maxFloors: 8,
      acquisitionType: 'cash',
      landCashPrice: 200_000_000,
      publicCessionPercent: 0,
    },
  },
  {
    id: 'preset_urban_renewal',
    name: 'Kentsel Dönüşüm / Kat Karşılığı (3.500 m², Emsal 2.2, %50 Pay)',
    tag: 'Kat Karşılığı',
    land: {
      projectName: 'Kadıköy Kentsel Dönüşüm Projesi',
      location: 'İstanbul / Kadıköy',
      landAreaM2: 3500,
      kaks: 2.20,
      taks: 0.35,
      maxFloors: 12,
      acquisitionType: 'flat_for_land',
      landOwnerSharePercent: 50,
      publicCessionPercent: 5,
    },
  },
  {
    id: 'preset_suburban_villa',
    name: 'Villa / Düşük Yoğunluklu Parsel (15.000 m², Emsal 0.50, TAKS %20)',
    tag: 'Villa / Prestij',
    land: {
      projectName: 'Zekeriyaköy Doğa Villaları',
      location: 'İstanbul / Sarıyer',
      landAreaM2: 15000,
      kaks: 0.50,
      taks: 0.20,
      maxFloors: 2,
      acquisitionType: 'cash',
      landCashPrice: 150_000_000,
      publicCessionPercent: 10,
    },
  },
];
