/**
 * Defines the brand of a payment card (e.g., VISA, MASTERCARD).
 */
export type Brand = "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER" | "OTHER";

/**
 * Defines the type of a payment method.
 */
export type MethodType = "CARD" | "BANK" | "PAYPAL" | "APPLE_PAY";

/**
 * Represents the billing address associated with a payment method.
 */
export interface Billing {
  lastName: string;
  firstName: string;
  line1?: string;
  city?: string;
  state?: string;
  zip?: string;
  countryCode?: string;
}

/**
 * Represents the details of a saved payment card shown in the UI.
 */
export interface Card {
  brand: Brand;
  firstName: string;
  lastName: string;
  last4: string;
  expiry: string;
}

/**

 * Represents a single, saved payment method. This is the main object
 * we'll use to display the list of saved methods.
 */
export interface Method {
  id: string;
  type: MethodType;
  label: string; // e.g., "Visa ending in 1234"
  isDefault: boolean;
  usedForMembership: boolean;
  card?: Card;
  bank?: { name: string; last4: string };
  paypal?: { email: string };
  apple?: boolean;
  billing?: Billing;
}

/**
 * Represents the structure for a full billing address when sending
 * data to the server.
 */
export type BillingAddress = {
  address_line_1: string;
  address_line_2?: string;
  admin_area_2: string; // City
  admin_area_1: string; // State/Province
  postal_code: string;
  country_code: string;
  first_name?: string;
  last_name?: string;
};

/**
 * Data required to add a new card via the API.
 */
export type CardData = {
  number: string;
  expiry: string; // Format: MM/YY
  security_code: string;
  name: string;
  billing_address?: BillingAddress;
};

/**
 * Data required to add a new bank account via the API.
 */
export type BankAccountData = {
  account_number: string;
  routing_number: string;
  account_type: "CHECKING" | "SAVINGS";
  account_holder_name: string;
};

/**
 * A discriminated union for different payment source types.
 */
export type PaymentSource =
  | { card: CardData }
  | { bank_account: BankAccountData }
  // We have to add PayPal and Apple Pay types here later
  // | { paypal: { ... } }
  // | { apple: { ... } };

/**
 * The final object we send to the server to add a new payment method.
 */
export interface AddPaymentMethodPayload {
  paymentSource: PaymentSource;
  setAsDefault: boolean;
}

/**
 * The standard shape for all our API responses.
 */
export interface ApiResponse<T = any> {
  data?: T;
  ok: boolean;
  error?: string;
}

/**
 * An object to hold form validation errors. The keys (like 'billingCity')
 * will match the names of our form fields.
 */
export interface ValidationErrors {
  [key: string]: string | undefined;
}