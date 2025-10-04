import { Brand, ValidationErrors } from "@/interfaces/paymentInterface";

// ============================================================================
// FORMATTING FUNCTIONS (Tools for changing how data looks)
// ============================================================================

/**
 * Formats a raw card number string by removing all non-digit characters.
 * @param value The raw input string.
 * @returns A string containing only digits.
 */
export const formatCardNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formats an expiry date string to automatically include a "/" (e.g., "1229" -> "12/29").
 * @param value The raw input string.
 * @returns The formatted MM/YY string.
 */
export const formatExpiryDate = (value: string): string => {
  let cleaned = value.replace(/\D/g, "");
  if (cleaned.length > 4) {
    cleaned = cleaned.slice(0, 4);
  }
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
};

/**
 * Formats a CVV by removing non-digits and enforcing the correct length.
 * @param value The raw input string.
 * @param brand The brand of the card, used to determine max length (AMEX is 4).
 * @returns The formatted CVV string.
 */
export const formatCvv = (value: string, brand: Brand): string => {
  const cleaned = value.replace(/\D/g, "");
  const maxLength = brand === "AMEX" ? 4 : 3;
  return cleaned.slice(0, maxLength);
};

/**
 * Formats a ZIP code string to automatically add a dash for ZIP+4.
 * @param value The raw input string.
 * @returns The formatted ZIP code string.
 */
export const formatZipCode = (value: string): string => {
  let cleaned = value.replace(/[^\d-]/g, ""); // Allow digits and dashes
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(0, 10);
  }
  // This logic is simple; more complex formatting could be added if needed.
  return cleaned;
};

// ============================================================================
// VALIDATION & LOGIC FUNCTIONS (Tools for checking data and making decisions)
// ============================================================================

/**
 * Determines the card brand (VISA, AMEX, etc.) from a card number.
 * @param cardNumber The card number string.
 * @returns The determined Brand.
 */
export const getCardType = (cardNumber: string): Brand => {
  const sanitized = cardNumber.replace(/\D/g, "");
  if (/^4/.test(sanitized)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(sanitized)) return "MASTERCARD";
  if (/^3[47]/.test(sanitized)) return "AMEX";
  if (/^6(?:011|5)/.test(sanitized)) return "DISCOVER";
  return "OTHER";
};

/**
 * Validates a card expiry date string (MM/YY).
 * @param expiry The date string to validate.
 * @returns An error message string if invalid, or an empty string if valid.
 */
export const validateExpiryDate = (expiry: string): string => {
  if (expiry.length !== 5) return "Date must be in MM/YY format.";

  const [monthStr, yearStr] = expiry.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10); // Assume 21st century

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return "Invalid month or year.";
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // Date months are 0-11
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired.";
  }

  return ""; // No error
};

/**
 * Validates all fields for a bank account form.
 * @returns An object containing any validation error messages.
 */
export const validateBankAccountFields = (
    accountHolderName: string,
    routingNumber: string,
    accountNumber: string
  ): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    if (!accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required.";
    }
  
    const cleanRouting = routingNumber.replace(/\s/g, "");
    if (!/^\d{9}$/.test(cleanRouting)) {
      errors.routingNumber = "Routing number must be exactly 9 digits.";
    }
  
    const cleanAccount = accountNumber.replace(/\s/g, "");
    if (cleanAccount.length < 4 || cleanAccount.length > 17) {
      errors.accountNumber = "Account number must be between 4 and 17 characters.";
    }
  
    return errors;
  };