import axios from "axios"
export async function register (fullName: string, email: string, password: string){
    return await axios.post("/api/auth/signup", {fullName, email, password})
}

export async function verify (email: string, otp: string) {
    return await axios.post("/api/auth/verify", { email, otp })
}

