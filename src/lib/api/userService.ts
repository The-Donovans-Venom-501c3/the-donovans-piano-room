import { UserUpdateData } from "@/interfaces/profileInterface"
import { fetchWithAuth } from "./fetchWithAuth"

export const getUser = async () =>{
    try{
        const response = await fetchWithAuth('/api/user/', {
            method: "GET", 
        })
        const data = await response.json()
        return {data, ok: response.ok}
    }catch(err){
        return {ok:false}
    }
    
}

export const updateUser = async (userData: UserUpdateData) => {
    const response = await fetchWithAuth('/api/user/', {
        method: "PUT", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    const data = await response.json()
    return {data, ok: response.ok}
}