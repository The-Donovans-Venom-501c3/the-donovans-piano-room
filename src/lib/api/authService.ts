export const signup  = async (fullName: string, email: string, password: string) =>{
    console.log("SIGNUP called .......")
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
}

export const refreshOTP = async (email: string) => {
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
    const data = response.json()
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