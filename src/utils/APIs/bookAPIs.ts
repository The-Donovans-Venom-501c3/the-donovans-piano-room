import axios from "axios"

export async function getAllBooksByTypes(){
    return await axios.get("/api/book") 
}

export async function getbookById(bookId: string) {
    return await axios.get(`/api/book/${bookId}`)
}

export async function getFrequentlyPurchasedTogether() {
    return await axios.get("/api/book/purchased-together")
    
}