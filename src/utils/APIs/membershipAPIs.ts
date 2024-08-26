export async function getAllMemberships() {
    return await fetch("/api/membership")
    .then(res => res.json())
    
}

export async function getMembershipById(memberId: string) {
    return await fetch(`/api/membership/${memberId}`) 
    .then(res => res.json())
}