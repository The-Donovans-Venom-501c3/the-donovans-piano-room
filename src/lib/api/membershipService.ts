export async function getMembershipById({ memberId }: { memberId: string }) {
  try {
    if (!memberId) {
      throw new Error("Member ID is required.");
    }
    const response = await fetch(`/api/membership/${memberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to retrieve membership details");
    }
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while retrieving membership details",
    );
  }
}

export async function getUserMembership() {
  try {
    const response = await fetch("/api/membership/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;
    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text || null;
      } catch {
        data = null;
      }
    }

    if (response.ok) {
      return data;
    }
    if (response.status === 404 || response.status === 410) {
      return null;
    }
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "Failed to retrieve user membership details";
    throw new Error(message);
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An error occurred while retrieving user membership details",
    );
  }
}

export async function validateCouponCode(
  memberId: number,
  email: string,
  couponCode: string,
) {
  try {
    const response = await fetch(`/api/membership/${memberId}/apply-coupon`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, couponCode }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Invalid discount code, please try again",
      );
    }
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while applying coupon code",
    );
  }
}

export async function getPlanInfo(levelId: string) {
  try {
    if (!levelId) {
      throw new Error("levelId is required");
    }
    const response = await fetch(
      `/api/member-info/${encodeURIComponent(levelId)}/level`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to retrieve level details");
    }

    return {
      levelId: data.levelId,
      planName:
        data.levelId === "lvl_free"
          ? "Scholarship"
          : data.levelId === "lvl_month"
            ? "Monthly"
            : data.levelId === "lvl_year"
              ? "Yearly"
              : "Day Pass",
      name: data.name,
      price: data.price,
      period: data.period,
      benefits: data.basic_benefits,
      moreBenefits: data.additional_benefits,
      formattedPrice: data.price === 0 ? "FREE" : `$${data.price.toFixed(2)}`,
    };
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while retrieving level details",
    );
  }
}

export async function cancelUserMembership() {
  try {
    const response = await fetch("/api/membership/user/cancel", {
      method: "POST",
      credentials: "include",
    });
    let data: any = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text || null;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      const message =
        typeof data === "object" && data?.message
          ? data.message
          : "Failed to cancel membership";
      throw new Error(message);
    }
    return data ?? {};
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while cancelling membership",
    );
  }
}

export async function toggleAutoRenew() {
  try {
    const response = await fetch("/api/membership/user/auto-renew", {
      method: "POST",
      credentials: "include",
    });
    let data: any = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text || null;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      const message =
        typeof data === "object" && data?.message
          ? data.message
          : "Failed to update auto renew";
      throw new Error(message);
    }
    return data ?? {};
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while updating auto renew",
    );
  }
}

export async function getPaymentMethods() {
  try {
    const response = await fetch("/api/payment-methods", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to retrieve payment methods");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while retrieving payment methods",
    );
  }
}

export interface NewPaymentMethodPayload {
  paymentMethodType: "card" | "paypal";
  cardholderName?: string;
  brand?: string;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  billingZip?: string;
  paypalEmail?: string;
  // TODO(backend/payments): replace cardNumber/cvv with a PSP token/nonce
  // (Stripe paymentMethodId, Braintree nonce, PayPal billing agreement, ...)
  cardNumber?: string;
  cvv?: string;
  vaultTokenId?: string;
  setAsDefault?: boolean;
}

// TODO(backend): implement POST /api/payment-methods — vault/tokenize the
// payment method with the PSP and persist it. May return { approvalUrl } when
// the provider (e.g. PayPal) requires a redirect to complete authorization.
export async function addPaymentMethod(payload: NewPaymentMethodPayload) {
  try {
    const response = await fetch("/api/payment-methods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to add payment method");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while adding the payment method",
    );
  }
}

// TODO(backend): implement DELETE /api/payment-methods/:vaultTokenId — remove
// the vaulted payment method from the PSP and the database.
export async function removePaymentMethod(vaultTokenId: string) {
  try {
    const response = await fetch(
      `/api/payment-methods/${encodeURIComponent(vaultTokenId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : {};
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove payment method");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while removing the payment method",
    );
  }
}

// TODO(backend): implement PUT /api/payment-methods/:vaultTokenId/default —
// mark the given payment method as the account default.
export async function setDefaultPaymentMethod(vaultTokenId: string) {
  try {
    const response = await fetch(
      `/api/payment-methods/${encodeURIComponent(vaultTokenId)}/default`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to set default payment method");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An error occurred while setting the default payment method",
    );
  }
}

export async function previewMembershipUpgrade(newMembershipId: string) {
  try {
    const response = await fetch("/api/membership/user/upgrade/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newMembershipId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to preview membership upgrade");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while previewing membership upgrade",
    );
  }
}

export async function requestMembershipUpgrade(
  newMembershipId: string,
  vaultTokenId: string,
  prorationPreference: "immediate" | "next_cycle" = "immediate",
) {
  try {
    const response = await fetch("/api/membership/user/upgrade/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        newMembershipId,
        vaultTokenId,
        prorationPreference,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to request membership upgrade");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while requesting membership upgrade",
    );
  }
}

export async function getUpgradeStatus() {
  try {
    const response = await fetch("/api/membership/user/upgrade/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get upgrade status");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while getting upgrade status",
    );
  }
}

export async function reactivateMembership(
  membershipId: string,
  vaultTokenId: string,
) {
  try {
    const response = await fetch("/api/membership/user/reactivate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        membershipId,
        vaultTokenId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to reactivate membership");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while reactivating membership",
    );
  }
}
