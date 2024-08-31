export async function getAllMemberships() {
    return await fetch("/api/membership", { cache: 'force-cache' })
    .then(res => res.json())
    
}

export async function getMembershipById(memberId: string) {
    return await fetch(`/api/membership/${memberId}`, { cache: 'force-cache' }) 
    .then(res => res.json())
}