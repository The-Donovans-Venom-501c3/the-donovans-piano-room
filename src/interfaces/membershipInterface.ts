// Enums for better type safety
export enum MembershipStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export enum MembershipLevelId {
  FREE = 'lvl_free',
  DAY = 'lvl_day',
  MONTH = 'lvl_month',
  YEAR = 'lvl_year'
}

export enum PaymentMethodBrand {
  VISA = 'visa',
  AMEX = 'amex',// 'american express'
  PAYPAL = 'paypal',
  DEFAULT = 'default'
}

// Core data structures
export interface PaymentMethodSummary {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface PaymentMethod {
  vaultTokenId: string;
  paymentMethodType: string;
  maskedDetails: {
    last4: string;
    brand: string;
    expiryMonth?: string;
    expiryYear?: string;
    displayName: string;
    paypal_account?: string;
  };
  isDefault: boolean;
  status: string;
  isExpired: boolean;
  daysUntilExpiry?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradePreview {
  success: boolean;
  proration?: {
    currentMembershipDaysRemaining: number;
    currentMembershipDailyRate: number;
    newMembershipDailyRate: number;
    prorationCredit: number;
    upgradeCharge: number;
    netAmount: number;
  };
  effectiveDate: string;
}

export interface UpgradeResponse {
  success: boolean;
  message?: string;
  subscriptionId?: string;
  approvalUrl?: string;
  effectiveDate?: string;
  error?: string;
  membershipHistoryId?: string; // This serves as the transaction ID
  prorationAmount?: number;
}

export interface UserMembership {
  membershipId: string;
  status: MembershipStatus;
  levelId: MembershipLevelId;
  nextRenewalAt?: string;
  autoRenew?: boolean;
  paymentMethodSummary?: PaymentMethodSummary;
}

// Comprehensive UI styling configuration for PlanCard
export interface PlanCardUIConfig {
  useSingleColumn?: boolean;
  priceBlockSize?: string;
  benefitCardColors?: {
    headerColor: string;
    textColor: string;
  };
  headerColor: string;
  headerTextColor: string;
  successIcon: string;
  priceBackgroundColor: string;
  backgroundAssets: { src: string; className: string }[];
}

// Comprehensive plan data for PlanCard
export interface Plan {
  // Raw API data
  levelId: MembershipLevelId;
  name: string;
  price: number;
  period: string;
  benefits: string[];
  moreBenefits: string[];
  
  // Formatted display data
  planName: string;
  formattedPrice: string;
  
  // Display state
  isCurrent?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  expirationDays?: number;
  originalPrice?: string;
  yearlyPrice?: string;
  billingMessage?: string;
}

