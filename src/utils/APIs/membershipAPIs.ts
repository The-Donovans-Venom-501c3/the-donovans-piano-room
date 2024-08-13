export async function getAllMemberships() {
    return await fetch("/api/membership")
    .then(res => res.json())
    
}