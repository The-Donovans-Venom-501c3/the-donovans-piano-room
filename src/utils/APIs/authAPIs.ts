import axios from "axios"
export async function register (fullName: string, email: string, password: string){
    return await axios.post("/api/auth/signup", {fullName, email, password})
}

export async function verify (email: string, otp: string) {
    return await axios.post("/api/auth/verify", { email, otp })
}

export async function refreshOTP(email: string) {
    return await axios.post("/api/auth/refresh-otp", {email})
    
}
export async function refreshToken() {
    return await axios.post("/api/auth/refresh")
    
}
export async function forgotPassword(email: string) {
    return await axios.post("/api/auth/forgot-password", {email})
    
}

export async function resetPassword(newPassword: string, passwordResetToken: string) {
    return await axios.post("/api/auth/reset-password", {newPassword, passwordResetToken})
    
}

export async function login(email:string, password: string) {
   return await axios.post("/api/auth/login", {email, password})
}