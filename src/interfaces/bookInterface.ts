export interface bookInterface {
    id: string,
    title: string,
    color: string,
    imageSrc: string,
    coverImageSrc: string,
    titleColor: string,
    type: string,
    price: number,
    description: string,  
}

export interface bookCartItemInterface {
    id: string,
    title: string,
    color: string,
    imageSrc: string,
    coverImageSrc: string,
    titleColor: string,
    type: string,
    price: number,
    description: string,  
    quantity: number
}