import { useEffect } from "react";
import { loadScript } from "@paypal/paypal-js";
import axios from "axios"
export default function PaymentMethod() {
    useEffect(()=>{
        axios.post("localhost:5000//api/generate/token")
        .then((token)=>{
            
        })
        loadScript({clientId: "AQTLR4qk4C3cDL7oMT6GN8oxoQ-pySBWicypWAAAELk1f5YD8Yx1dt5DXSVQJX9raTMWx3va9ebXhREW", components: "buttons,hosted-fields", currency: ""})
        .then(paypal => {
            
            paypal?.Buttons({style: {
                shape: "pill"
            }}).render("#payment-options")
            if(paypal?.HostedFields?.isEligible()){
                // paypal.HostedFields.render({

                // })
            }
        })
    }, [])
    return (
    <div id="payment-options">

    </div>
  )
}
