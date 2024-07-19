import { useEffect, useRef } from "react";
import { loadScript } from "@paypal/paypal-js";
import axios from "axios"
export default function PaymentMethod() {
    const isLoadedRef = useRef(false)
    const numberFieldRef = useRef<HTMLInputElement>(null)
    const cvcFieldRef = useRef<HTMLInputElement>(null)
    const expirationDateRef = useRef<HTMLInputElement>(null)
    const zipFieldRef = useRef<HTMLInputElement>(null)
    const buttonsRef = useRef<HTMLInputElement>(null)
    useEffect(()=>{
        if(isLoadedRef.current){
            axios.post("http://localhost:5000/api/generate_token")
            .then((res)=>{
            
                loadScript({clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, dataClientToken: res.data, components: "buttons,card-fields",})
                .then(paypal => {
                    
                    paypal?.Buttons({style: {
                        shape: "pill"
                    }}).render(buttonsRef.current)
                    // if(paypal?.CardFields.isEligible()){
                        //     // paypal.HostedFields.render({
                            //     console.log("qdfhqsfqsdfjhhjhfhhdf")
                            //     // })
                            // }
                            const cardField = paypal?.CardFields()
                            cardField?.NumberField().render(numberFieldRef.current)
                            // cardField?.NumberField({}).render(numberFieldRef)
                        })
                    })
                    .catch(err => {throw err})
        }
        isLoadedRef.current = true
    }, [])
    return (
        <>
            <div ref={buttonsRef}/>
            <form>

                <div ref={numberFieldRef}></div>
                <div className="flex gap-[3%]">
                    <div ref={expirationDateRef}/>
                    <div ref={cvcFieldRef}/>
                    <div ref={zipFieldRef}/>
                </div>
            </form>
        </>
)
}
