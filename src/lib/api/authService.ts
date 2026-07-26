interface ApiResponse<T = any> {
    data: T | null;
    ok: boolean;
    status: number;
    error?: string;
}

export const signup = async (
    fullName: string,
    email: string,
    password: string
): Promise<ApiResponse> => {
    try {
        const trimmedName = fullName.trim();
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: trimmedName,
                email,
                password
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Signup Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const verify = async (email: string, otp: string): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                otp
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Verification Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const refreshOTP = async (email: string): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/refresh-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Request Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const login = async (email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Login Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const logout = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return { data, ok: false, status: response.status, error: "Logout Failed" };
        }

        return { data, ok: true, status: response.status };
    } catch (error: any) {
        console.error("Logout Problem:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Forgot Password Request Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const resetPassword = async (
    passwordResetToken: string,
    newPassword: string
): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                passwordResetToken,
                newPassword
            })
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Reset Password Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};

export const refreshToken = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include"
        });
        const data = await response.json().catch(() => null);
        return { data, ok: response.ok, status: response.status };
    } catch (error: any) {
        console.error("Token Refresh Failed:", error);
        return { data: null, ok: false, status: 500, error: error.message };
    }
};