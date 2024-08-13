import axios from "axios";

export async function createMembershipOrder(membershipId: string) {
    return await axios.post(`/api/orders/membership/${membershipId}`)
    .then(res => {
        const {data: order} = res
        console.log(order)
        return order.id
    })
}

export async function onApprovePayment(data: any) {
    return await axios.post(`/api/orders/${data.orderID}/capture`) 
}