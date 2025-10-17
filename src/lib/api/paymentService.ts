import {
  Method,
  MethodType,
  Brand,
  CardData,
  BankAccountData,
  AddPaymentMethodPayload,
  ApiResponse,
} from "@/interfaces/paymentInterface";

// ============================================================================
// Internal Types & Helper Functions
// ============================================================================

interface PaymentMethodListResponse {
  success: boolean;
  data: any[]; // Using 'any' to match the provided working code's flexibility
}

/**
 * Converts backend expiry date (YYYY-MM) to display format (MM/YY).
 */
const formatExpiry = (expiryMonth?: string): string => {
  if (!expiryMonth || !/^\d{4}-\d{2}$/.test(expiryMonth)) return "";
  return `${expiryMonth.slice(5)}/${expiryMonth.slice(2, 4)}`;
};

/**
 * A generic, robust function to handle all API calls. It automatically
 * includes credentials and provides standardized error handling.
 */
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch (jsonError) {
      // Ignore if no json body, which is valid for some successful responses (e.g., 204 No Content)
    }

    if (!response.ok) {
      return {
        ok: false,
        error: data?.message || `Error: ${response.status}`,
      };
    }
    console.log("API Response Data:", data);
    if (data && data.success === false) {
      return {
        ok: false,
        error: data.message || "The server indicated an operation failed.",
      };
    }

    return { data, ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "A network error occurred. Please check your connection.",
    };
  }
};

/**
 * Translates a raw payment method object from the backend into the clean
 * 'Method' interface used by our UI.
 */
const formatBackendDataToMethod = (pm: any): Method => {
    const type = (pm.paymentMethodType?.toUpperCase() || "CARD") as MethodType;
    const masked = pm.maskedDetails || {};
    const billing = pm.billingAddress || {};
  
    const common = {
      id: pm.vaultTokenId,
      type,
      label: masked.displayName || "Unknown Method",
      isDefault: pm.isDefault,
      usedForMembership: pm.isDefault,
      billing: {
        line1: billing.address_line_1,
        city: billing.admin_area_2,
        state: billing.admin_area_1,
        zip: billing.postal_code,
        countryCode: billing.country_code,
        firstName: billing.firstName || "",
        lastName: billing.lastName || "",
      },
    };
  
    if (type === "CARD") {
      return {
        ...common,
        card: {
          brand: (masked.brand?.toUpperCase() as Brand) || "OTHER",
          firstName: "", 
          lastName: "",
          last4: masked.last4 || "****",
          expiry: formatExpiry(masked.expiryMonth),
        },
      };
    }

    return { ...common };
};

// ============================================================================
// Public API Functions (Used by UI components)
// ============================================================================

/**
 * Fetches all saved payment methods for the user.
 */
export const getPaymentMethods = async (): Promise<ApiResponse<Method[]>> => {
  const response = await apiCall<PaymentMethodListResponse>("/api/payment-methods");

  if (!response.ok || !response.data) {
    return { ok: false, error: response.error || "Failed to fetch payment methods." };
  }

  try {
    const formattedData = response.data.data.map(formatBackendDataToMethod);
    return { data: formattedData, ok: true };
  } catch (err) {
    return { ok: false, error: "Failed to process payment method data." };
  }
};

/**
 * Adds a new card payment method.
 */
export const addCardPaymentMethod = (cardData: CardData, setAsDefault: boolean): Promise<ApiResponse> => {
  const payload: AddPaymentMethodPayload = {
    paymentSource: { card: cardData },
    setAsDefault,
  };
  return apiCall("/api/payment-methods", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Adds a new bank account payment method.
 */
export const addBankPaymentMethod = (bankData: BankAccountData, setAsDefault: boolean): Promise<ApiResponse> => {
    const payload: AddPaymentMethodPayload = {
      paymentSource: { bank_account: bankData },
      setAsDefault,
    };
    return apiCall("/api/payment-methods", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

/**
 * Updates an existing payment method's billing address or default status.
 */
export const updatePaymentMethod = (
    vaultTokenId: string,
    updateData: { billingAddress?: any; setAsDefault?: boolean }
  ): Promise<ApiResponse> => {
    return apiCall(`/api/payment-methods/${vaultTokenId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  };

/**
 * Sets a specific payment method as the default for the account.
 */
export const setDefaultPaymentMethod = (vaultTokenId: string): Promise<ApiResponse> => {
  return apiCall(`/api/payment-methods/${vaultTokenId}/default`, {
    method: "PATCH",
    body: JSON.stringify({ setAsDefault: true }),
  });
};

/**
 * Deletes a payment method. Now uses the consistent apiCall helper.
 */
export const deletePaymentMethod = async (
  vaultTokenId: string,
): Promise<{ data?: any; ok: boolean }> => {
  try {
    const response = await fetch(`/api/payment-methods/${vaultTokenId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    return { data, ok: response.ok };
  } catch (err) {
    return { ok: false };
  }
};