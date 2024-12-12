export const getUser = async () =>{
    const response = await fetch('/api/user/', {
        method: "GET", 
        credentials: 'include'
    })
    const data = await response.json()
    return {data, ok: response.ok}
}

export const updateUser = async (fullName: string, displayName: string, email: string, phoneNumber: string, pronouns: string, DOB: string) => {
    const response = await fetch('/api/user/', {
        method: "PUT", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullName, 
            displayName,
            email,
            phoneNumber,
            pronouns,
            DOB
        })
    })
    const data = await response.json()
    return {data, ok: response.ok}
}

export const contactUs = async (name: string, email: string, message: string) => {
    const response = await fetch('/api/contact-us/', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            message
        })
    })
    const data = await response.json()
    return {data, ok: response.ok}
}