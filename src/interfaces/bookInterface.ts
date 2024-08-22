export interface bookInterface {
    id: number,
    title: string,
    color: string,
    imageSrc: string,
    coverImageSrc: string,
    titleColor: string,
    type: string,
    price: string,
    description: string,  
}

export interface bookCartItemInterface {
    id: number,
    title: string,
    color: string,
    imageSrc: string,
    coverImageSrc: string,
    titleColor: string,
    type: string,
    price: string,
    description: string,  
    quantity: number
}