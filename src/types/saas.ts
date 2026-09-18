import { LandData, ProjectCostAssumptions, FeasibilityScenario } from './feasibility';

export type UserAccountType = 'guest' | 'individual' | 'business' | 'admin';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface IndividualProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  kvkkAccepted: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
}

export interface BusinessProfile {
  companyName: string;
  taxNumber: string;
  taxOffice: string;
  companyType: 'A.Ş.' | 'Ltd. Şti.' | 'Şahıs Şirketi' | 'Kollektif' | 'Diğer';
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  website?: string;
  employeeCountRange: '1-5' | '6-20' | '21-50' | '50+';
}

export interface BusinessEmployee {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'employee';
  assignedProjectIds: string[]; // employee can only see these projects; owner/manager sees all
}

export interface UserSession {
  accountType: UserAccountType;
  id: string;
  displayName: string;
  email: string;
  individualProfile?: IndividualProfile;
  businessProfile?: BusinessProfile;
  employees?: BusinessEmployee[];
  currentEmployeeId?: string; // which employee context is currently active (for testing role-based view)
  plan: SubscriptionPlan;
  monthlyLimit: number;
  usedCountThisMonth: number;
  creditBalance: number; // purchased one-time credits
  renewalDate: string;
  registeredAt: string;
  isLoggedIn: boolean;
  guestCalculationsRemaining: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  date: string;
  amountTL: number;
  itemType: 'plan' | 'credit_pack';
  itemTitle: string;
  invoiceNumber: string;
  paymentMethod: string;
  status: 'success' | 'failed' | 'refunded';
}

export interface ShareSettings {
  id: string;
  projectId: string;
  projectTitle: string;
  shareCode: string; // e.g. "8HD72K"
  isPasswordProtected: boolean;
  pinCode?: string;
  expiresAt: string | null; // e.g. null = no expiry
  allowPdfDownload: boolean;
  viewCount: number;
  createdAt: string;
}

export interface PlanConfig {
  id: SubscriptionPlan;
  title: string;
  subtitle?: string;
  description: string;
  priceMonthlyTL: number;
  priceAnnualTL: number; // Toplam 12 aylık peşin tutar (örn: 12.990 TL)
  priceAnnualMonthlyTL: number; // Yıllık alındığında aya düşen maliyet (örn: ~1.082 TL/ay)
  annualSavingsTL?: number; // 12 x Aylık - Yıllık Peşin (örn: 4.998 TL)
  annualFreeMonthsEquivalent?: number; // ~3 ay ücretsiz hissi
  monthlyFeasibilityLimit: number; // 9999 for unlimited
  features: string[];
  recommendedBadge?: string; // "En Çok Tercih Edilen"
}

export interface PromotionalCampaign {
  isActive: boolean;
  title: string; // e.g. "Kuruluş fırsatı – İlk yıl %30 indirim"
  badgeText: string; // e.g. "🔥 KURULUŞ FIRSATI"
  discountPercent: number; // 30 for %30 indirim
  appliesTo: 'annual_only' | 'all';
  endDate?: string; // e.g. "31 Ekim 2026"
  description?: string;
}

export interface CreditPackConfig {
  id: string;
  credits: number;
  priceTL: number;
  unitPriceTL: number;
  popularBadge?: string;
}

export interface AdminSystemSettings {
  defaultConstructionCostPerM2: number;
  defaultNonFarAreaRatio: number;
  defaultSalesEfficiencyPercent: number;
  defaultPermitFeePercent: number;
  defaultMarketingFeePercent: number;
  defaultAdminFeePercent: number;
  plans: Record<SubscriptionPlan, PlanConfig>;
  creditPacks: CreditPackConfig[];
  campaign?: PromotionalCampaign;
}
