export interface bookInterface {
    id: string,
    typeId?: string,
    title: string,
    level: string,
    color: string,
    picture: string,
    picture2: string,
    tdprColor: string,
    price: number,
    intro: string,
    comments: string
}

export interface bookCartItemInterface extends bookInterface{
    quantity: number
}
export interface booksByType {
    id: string,
    name: string
    books: bookInterface[]
}
