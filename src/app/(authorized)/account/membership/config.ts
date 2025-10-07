import { MembershipLevelId, PaymentMethodBrand, PlanCardUIConfig } from "@/interfaces/membershipInterface";

// Button configuration interface
export interface ButtonConfig {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  message?: string;
  style?: string;
  icon?: string;
}

// Popup types
export enum PopupType {
  CANCEL_MEMBERSHIP = "cancel-membership",
  CANCEL_SWITCH = "cancel-switch",
  CANCEL_AUTOPAY = "cancel-autopay",
  APPLY_SCHOLARSHIP = "apply-scholarship",
  SWITCH_FROM_SCHOLARSHIP = "switch-from-scholarship"
}

// Popup configuration interface
export interface PopupConfig {
  title: string;
  content: string;
  primaryButton: string;
  secondaryButton: string;
  primaryButtonStyle: string;
  secondaryButtonStyle: string;
}

// Popup configuration
export const POPUP_CONFIG: Record<PopupType, PopupConfig> = {
  [PopupType.CANCEL_MEMBERSHIP]: {
    title: "Cancel Membership",
    content: "We're sorry to see you go. Canceling now means you'll lose access to all member benefits at the end of your billing period.\n\nAre you sure you want to continue?",
    primaryButton: "Cancel Anyway",
    secondaryButton: "Keep Membership",
    primaryButtonStyle: "bg-red-600 hover:bg-red-700",
    secondaryButtonStyle: "border-2 border-primary-purple text-primary-purple hover:bg-purple-50"
  },
  [PopupType.CANCEL_SWITCH]: {
    title: "Go Back",
    content: "Are you sure you want to cancel switching plan and go back?",
    primaryButton: "Continue with Transaction",
    secondaryButton: "Go Back",
    primaryButtonStyle: "bg-primary-purple hover:bg-purple-700",
    secondaryButtonStyle: "border-2 border-primary-purple text-primary-purple hover:bg-purple-50"
  },
  [PopupType.CANCEL_AUTOPAY]: {
    title: "Cancel Autopay?",
    content: "If you cancel autopay, your future payments won't be charged automatically. You'll need to make payments manually to keep your account active and avoid service interruptions.",
    primaryButton: "Cancel Autopay",
    secondaryButton: "Keep Autopay",
    primaryButtonStyle: "bg-red-600 hover:bg-red-700",
    secondaryButtonStyle: "border-2 border-primary-purple text-primary-purple hover:bg-purple-50"
  },
  [PopupType.APPLY_SCHOLARSHIP]: {
    title: "Apply for Scholarship",
    content: "Scholarships are available for families with household income below the Federal Poverty Level (FPL).\n\nIf you choose to apply, you'll be directed to an external form to provide your details. Please note that your application will be reviewed and subject to approval.",
    primaryButton: "Apply for Scholarship",
    secondaryButton: "Go Back",
    primaryButtonStyle: "bg-primary-purple hover:bg-purple-700",
    secondaryButtonStyle: "border-2 border-primary-purple text-primary-purple hover:bg-purple-50"
  },
  [PopupType.SWITCH_FROM_SCHOLARSHIP]: {
    title: "⚠️ Switching from Scholarship Plan",
    content: "You're currently on a scholarship plan. If you switch to another plan, your scholarship will no longer apply.\n\nTo return to the scholarship plan in the future, you'll need to submit a new application and meet eligibility requirements again.",
    primaryButton: "Change Plan",
    secondaryButton: "Stay on Scholarship",
    primaryButtonStyle: "bg-primary-purple hover:bg-purple-700",
    secondaryButtonStyle: "border-2 border-primary-purple text-primary-purple hover:bg-purple-50"
  }
};

// Membership UI configuration
export const MEMBERSHIP_UI_CONFIG: Record<MembershipLevelId, PlanCardUIConfig> = {
  [MembershipLevelId.FREE]: {
    headerColor: "bg-[#e98427]",
    headerTextColor: "text-white",
    successIcon: "/memberships/upgrade/Scholoarship-free/Success.svg",
    priceBackgroundColor: "bg-orange-50",
    backgroundAssets: [
      { src: "/memberships/upgrade/Scholoarship-free/Group 48096278.svg", className: "inset-0 object-cover" }
    ],
    useSingleColumn: false,
    priceBlockSize: "py-10",
    benefitCardColors: {
      headerColor: 'bg-[#FED2AA]',
      textColor: 'text-[#8B4513]'
    }
  },
  [MembershipLevelId.DAY]: {
    headerColor: "bg-[#6F219E]",
    headerTextColor: "text-white",
    successIcon: "/memberships/upgrade/Scholoarship/Success.svg",
    priceBackgroundColor: "bg-purple-100",
    backgroundAssets: [
      { src: "/memberships/upgrade/Scholoarship/Group 48096278.svg", className: "inset-0 object-cover" }
    ],
    useSingleColumn: false,
    priceBlockSize: "py-10",
    benefitCardColors: {
      headerColor: 'bg-[#6F219E]',
      textColor: 'text-white'
    }
  },
  [MembershipLevelId.MONTH]: {
    headerColor: "bg-[#438342]",
    headerTextColor: "text-white",
    successIcon: "/memberships/upgrade/1-Month/Success.svg",
    priceBackgroundColor: "bg-green-10",
    backgroundAssets: [
      { src: "/memberships/upgrade/1-Month/Group 48096278.svg", className: "inset-0 object-cover" }
    ],
    useSingleColumn: false,
    priceBlockSize: "py-10",
    benefitCardColors: {
      headerColor: 'bg-[#FED2AA]',
      textColor: 'text-[#8B4513]'
    }
  },
  [MembershipLevelId.YEAR]: {
    headerColor: "bg-[#E9BB18]",
    headerTextColor: "text-white",
    successIcon: "/memberships/upgrade/1-Year/Success.svg",
    priceBackgroundColor: "bg-yellow-50",
    backgroundAssets: [
      { src: "/memberships/upgrade/1-Year/Group 48095969.svg", className: "inset-0 object-cover" }
    ],
    useSingleColumn: false,
    priceBlockSize: "py-10",
    benefitCardColors: {
      headerColor: 'bg-[#E9BB18]',
      textColor: 'text-white'
    }
  }
};


// Payment method brand icons configuration
export const PAYMENT_METHOD_ICONS: Record<PaymentMethodBrand, string> = {
  [PaymentMethodBrand.VISA]: "/memberships/Payment/Visa.svg",
  [PaymentMethodBrand.AMEX]: "/memberships/Payment/Amex.svg",
  [PaymentMethodBrand.PAYPAL]: "/memberships/Payment/logos_paypal.svg",
  [PaymentMethodBrand.DEFAULT]: "/memberships/Payment/credit_card_FILL0_wght400_GRAD0_opsz24 1.svg"
};

// Date formatting configuration
export const DATE_FORMATS = {
  renewalDate: {
    locale: "en-US",
    options: {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }
  }
} as const;

// Helper function to get payment method icon
export const getPaymentMethodIcon = (brand: string): string => {
  // Normalize the brand name and try to match it to our enum values
  const normalizedBrand = brand.toLowerCase().trim();
  
  switch (normalizedBrand) {
    case PaymentMethodBrand.VISA:
      return PAYMENT_METHOD_ICONS[PaymentMethodBrand.VISA];
    
    case PaymentMethodBrand.AMEX:
    case 'american express':
      return PAYMENT_METHOD_ICONS[PaymentMethodBrand.AMEX];
    
    case PaymentMethodBrand.PAYPAL:
      return PAYMENT_METHOD_ICONS[PaymentMethodBrand.PAYPAL];
    
    case 'mastercard':
    case 'master card':
    case 'discover':
    case 'diners':
    case 'jcb':
    default:
      // Default fallback for any unrecognized brand or brands without specific icons
      return PAYMENT_METHOD_ICONS[PaymentMethodBrand.DEFAULT];
  }
};

// Helper function to calculate yearly price multiplier
export const getYearlyPriceMultiplier = (levelId: string): number => {
  switch (levelId) {
    case 'lvl_day':
      return 365; // Daily plan * 365 days
    case 'lvl_month':
    case 'lvl_year':
      return 12; // Monthly/Yearly plan * 12 months
    case 'lvl_free':
    default:
      return 0; // Scholarship plans
  }
};

// Helper function to format renewal date
export const formatRenewalDate = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(
      DATE_FORMATS.renewalDate.locale,
      DATE_FORMATS.renewalDate.options
    );
  } catch {
    return "";
  }
};
