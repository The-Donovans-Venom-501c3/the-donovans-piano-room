export interface membershipInterface {
    memeberId: string,
    type?: string,
    title: string,
    price: string,
    comment: string,
    createdAt?: Date,
    updatedAt?: Date,
    services: membershipServiceInterface[]
}
interface membershipServiceInterface {
    serviceId: string,
    title: string,
    description: string
}