export async function getMembershipById({ memberId }: { memberId: string }) {
    try {
        // Validate input
        if (!memberId) {
            throw new Error("Member ID is required.");
        }
        // Send GET request to the backend
        const response = await fetch(`https://your-backend-domain.com/api/membership/${memberId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
        const response = await fetch('https://your-backend-domain.com/api/membership/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
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
