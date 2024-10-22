export const getUser = async () =>{
    const response = await fetch('/api/user/', {
        method: "GET", 
        credentials: 'include'
    })
    const data = await response.json()
    return {data, ok: response.ok}
}