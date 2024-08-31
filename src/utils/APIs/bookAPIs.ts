import axios from "axios"

export async function getAllBooksByTypes(){
    return await fetch("/api/book", { cache: 'force-cache' })
    .then(res => res.json())
}

export async function getbookById(bookId: string) {
    return fetch(`/api/book/${bookId}`, { cache: 'force-cache' })
    .then(res => res.json())
}

export async function getFrequentlyPurchasedTogether() {
    return await fetch("/api/book/purchased-together", { cache: 'force-cache' })
      .then(res => res.json())

}
