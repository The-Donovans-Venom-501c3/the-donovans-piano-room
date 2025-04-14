import { profileAtom } from "@/utils/stores"
import { useSetAtom } from "jotai"

export const signup  = async (fullName: string, email: string, password: string) =>{
    fullName = fullName.trim()
    const response = await fetch('/api/auth/signup', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            fullName, 
            email,
            password
        })
    })
    const data = await response.json()
    return {data, ok: response.ok}

}

export const verify = async (email: string, otp: string) => {
    try{
        const response = await fetch('/api/auth/verify',{
            method: 'POST', 
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email,
                    otp
                }
            )
        })
        const data = await response.json()
        return { data, ok: response.ok}
    }catch(error:any){
        console.error("Verification Failed:", error);
        return {data:null, ok:false, error:error};
    }
}

export const refreshOTP = async (email: string) => {
    try{
        const response = await fetch('/api/auth/refresh-otp', {
            method: 'POST', 
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email
                }
            )
        })
    const data = await response.json()
    return {data, ok: response.ok}
    }catch(error:any){
        console.error("Request Failed:", error);
        return {data:null, ok:false, error:error.message};
    }
}

export const login = async (email: string, password: string) => {
    const response  = await fetch('/api/auth/login', {
        method: "POST", 
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                email,
                password
            }
        )
    })
    const data = await response.json()
    return {data, ok: response.ok}
}

export const logout = async ()=>{
    try{
        const response = await fetch('/api/auth/logout',{
            method: 'POST',
            credentials: 'include'
        });
        if(!response.ok){
            throw new Error('Logout Failed');
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.log('There is a problem logging out');
        return {error};
    }
}

export const forgotPassword = async (email: string) =>{
    const response = await fetch('/api/auth/forgot-password',{
        method: 'POST',
        headers:{
            'Content-Type': "application/json"
        }, 
        body: JSON.stringify({
            email
        })
    })
    const data = await response.json()
    return {data, ok: response.ok}
}


export const resetPassword = async (passwordResetToken: string, newPassword: string) => {
    const response = await fetch('/api/auth/reset-password', {
        method: 'POST', 
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            passwordResetToken,
            newPassword
        })
    })
    const data = await response.json()
    return {data, ok: response.ok}
}

export const refreshToken = async () => {
    const response = await fetch('/api/auth/refresh', {
        method: 'POST', 
        credentials: 'include'
    })
    const data = await response.json()
    return {data, ok: response.ok}
}