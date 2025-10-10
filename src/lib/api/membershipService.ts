export async function getMembershipById({ memberId }: { memberId: string }) {
    try {
        // Validate input
        if (!memberId) {
            throw new Error("Member ID is required.");
        }
        // Send GET request to the backend
        const response = await fetch(`/api/membership/${memberId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        // Parse response
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve membership details');
        }
        return data; // Return the membership details
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while retrieving membership details');
    }
}
 
export async function getUserMembership() {
    try {
        // Send GET request to the backend
        const response = await fetch('/api/membership/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include',
        });
        // Parse response
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve user membership details');
        }
        return data; // Return the membership details for the authenticated user
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred while retrieving user membership details');
    }
}
 
export async function validateCouponCode(memberId: number, couponCode: string) {
    try {
        // Send GET request to the backend
        const response = await fetch(`http://localhost:3333/api/membership/${memberId}/apply-coupon`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include',
            body: JSON.stringify({ couponCode }),
        });
        // Parse response
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Invalid discount code, please try again');
        }
        return data; // Return the membership details for the authenticated user
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred while applying coupon code');
    }
}

export async function getPlanInfo(levelId: string) {
    try {
        if (!levelId) {
            throw new Error('levelId is required');
        }
        const response = await fetch(`/api/member-info/${encodeURIComponent(levelId)}/level`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve level details');
        }
        
        // Map API response to Plan interface
        return {
            levelId: data.levelId,
            planName: data.levelId === 'lvl_free' ? "Scholarship" : data.levelId === 'lvl_month'? "Monthly" : data.levelId === 'lvl_year'? "Yearly" : "Day Pass",
            name: data.name,
            price: data.price,
            period: data.period,
            benefits: data.basic_benefits,
            moreBenefits: data.additional_benefits,
            formattedPrice: data.price === 0 ? "FREE" : `$${data.price.toFixed(2)}`,
        };
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while retrieving level details');
    }
}

export async function cancelUserMembership() {
    try {
        const response = await fetch('/api/membership/user/cancel', {
            method: 'POST',
            credentials: 'include',
        });
        let data: any = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try { data = await response.json(); } catch { data = null; }
        } else {
            try { const text = await response.text(); data = text || null; } catch { data = null; }
        }
        if (!response.ok) {
            const message = typeof data === 'object' && data?.message ? data.message : 'Failed to cancel membership';
            throw new Error(message);
        }
        return data ?? {};
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while cancelling membership');
    }
}

export async function toggleAutoRenew() {
    try {
        const response = await fetch('/api/membership/user/auto-renew', {
            method: 'POST',
            credentials: 'include',
        });
        let data: any = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try { data = await response.json(); } catch { data = null; }
        } else {
            try { const text = await response.text(); data = text || null; } catch { data = null; }
        }
        if (!response.ok) {
            const message = typeof data === 'object' && data?.message ? data.message : 'Failed to update auto renew';
            throw new Error(message);
        }
        return data ?? {};
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while updating auto renew');
    }
}

// Payment Methods API functions
export async function getPaymentMethods() {
    try {
        const response = await fetch('/api/payment-methods', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to retrieve payment methods');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while retrieving payment methods');
    }
}

export async function previewMembershipUpgrade(newMembershipId: string) {
    try {
        const response = await fetch('/api/membership/user/upgrade/preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ newMembershipId }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to preview membership upgrade');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while previewing membership upgrade');
    }
}

// Purchase membership with vault token (for new users)
export async function purchaseMembership(
    membershipId: string,
    vaultTokenId: string
) {
    try {
        const response = await fetch(`/api/orders/membership/${membershipId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                vaultTokenId
            }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to purchase membership');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while purchasing membership');
    }
}

// Upgrade existing membership (for users with active membership)
export async function requestMembershipUpgrade(
    newMembershipId: string, 
    vaultTokenId: string, 
    prorationPreference: 'immediate' | 'next_cycle' = 'immediate'
) {
    try {
        const response = await fetch('/api/membership/user/upgrade/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                newMembershipId,
                vaultTokenId,
                prorationPreference,
            }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to request membership upgrade');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while requesting membership upgrade');
    }
}

export async function getUpgradeStatus() {
    try {
        const response = await fetch('/api/membership/user/upgrade/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to get upgrade status');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while getting upgrade status');
    }
}

export async function reactivateMembership(membershipId: string, vaultTokenId: string) {
    try {
        const response = await fetch('/api/membership/user/reactivate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                membershipId,
                vaultTokenId,
            }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to reactivate membership');
        }
        
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while reactivating membership');
    }
}

// Add credit card payment method
export async function addCardPaymentMethod(cardData: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}) {
    try {
        const response = await fetch('/api/payment-methods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                paymentSource: {
                    card: {
                        number: cardData.number.replace(/\s/g, ''), // Remove spaces
                        expiry: cardData.expiry,
                        security_code: cardData.cvv,
                        name: cardData.name,
                        billing_address: {
                            address_line_1: cardData.address,
                            admin_area_2: cardData.city,
                            admin_area_1: cardData.state,
                            postal_code: cardData.zipCode,
                            country_code: cardData.country
                        }
                    }
                },
                setAsDefault: true
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data?.message || `Failed to add payment method (${response.status})`);
        }
        
        return data; // Returns { success: true, data: { vaultTokenId, paymentMethodType, maskedDetails, ... } }
    } catch (error: any) {
        console.error('addCardPaymentMethod error:', error);
        throw new Error(error.message || 'An error occurred while adding payment method');
    }
}
