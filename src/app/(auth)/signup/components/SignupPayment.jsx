import { PayPalScriptProvider, PayPalButtons, PayPalNumberField, PayPalExpiryField, PayPalCardFieldsProvider, PayPalCVVField, usePayPalCardFields, PayPalCardFieldsForm, PayPalCardFieldsComponentOptions, CardFieldStyle } from "@paypal/react-paypal-js";
import Button1 from "@/components/atoms/Button1";
import { useState } from "react";
import Link from "next/link";
import Button2 from "@/components/atoms/Button2";
import SignupHeader from "./SignupHeader";
import { useSetAtom } from "jotai";
import { singupStepAtom } from "@/utils/stores";
import Checkbox from "@/components/atoms/Checkbox";
export default function SignupPayment() {
    const [displayCardFields, setDisplayCardFields] = useState(false)
    const setSingupStep = useSetAtom(singupStepAtom)
    const fieldStyle = {
        '.card-icon': {
            'display': 'none',
            "padding-bottom": "1rem",
            "padding-top": "1.75rem",
        },
        'body': {
            "padding": "0",
        },
        'input': {
            "appearance": "none",
            "border": "2px solid #391F0F",
            "borderRadius": "15px",
            "padding-bottom": "1rem",
            "padding-top": "1.75rem",
            "margin-left": "0.5rem",
        }, ".invalid": {
            "color": "black",
            "border": "none"
        },
        ":focus": {
            "border": "2px solid #391F0F",
            "box-shadow": "none"
        }
    }

    const createOrder = async () => {
        return "";
    }

    const onApprove = async () => {
        return "";
    }

    const onError = async () => {
        return "";
    }

    return (
        <div className='w-[24vw] 3xl:w-[26vw]'>
            <SignupHeader navName='Membership' navLink='' stepNum={4} stepName='Add your payment method' onClickNav={()=>setSingupStep(3)} />
            
            <PayPalScriptProvider options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, components: "card-fields,buttons", enableFunding: "venmo"}}>
                {!displayCardFields && (<>
                    <Button1 style={{padding: "15px", marginBottom: "4%", marginTop: "3%"}} text="Check out with credit card" onClick={()=>{setDisplayCardFields(true)}}></Button1>
                    <PayPalButtons style={{shape: "pill"}}></PayPalButtons>
                </>)}

                {displayCardFields && 
                (<PayPalCardFieldsProvider createOrder={createOrder} onApprove={onApprove} onError={onError}>
                    <label className="relative w-full">
                        <span className="absolute top-[8px] left-[25px] z-50 text-[#391F0F] font-medium w-[24vw]">Card number</span>
                        <PayPalNumberField style={fieldStyle} placeholder="" />
                    </label>
                    <div className="flex gap-[2%] mb-[4%]">
                        <label className="relative w-full">
                            <span className="absolute top-[8px] left-[15px] z-50 text-[#391F0F] font-medium w-[24vw]">Expiration date</span>
                            <PayPalExpiryField style={fieldStyle} placeholder="" />
                        </label>
                        <label className="relative w-full">
                            <span className="absolute top-[8px] left-[15px] z-50 text-[#391F0F] font-medium w-[24vw]">CVC</span>
                            <PayPalCVVField style={fieldStyle} placeholder="" />
                        </label>
                    </div>
                    {/* <Checkbox>
                        <span className="text-[#391F0F] text-white text-lg 3xl:text-xl 4xl:text-2xl">Set as default payment method</span>
                    </Checkbox> */}
                    <SubmitPayment/>
                    <Button2 style={{marginTop: "4%"}} text="Cancel" onClick={()=>setDisplayCardFields(false)}></Button2>
                </PayPalCardFieldsProvider>
            )}
            </PayPalScriptProvider>
            <p className='w-full text-center mt-[4vh] text-lg 3xl:text-2xl  text-white bg-primary-purple py-3 rounded-3xl 2xl:rounded-4xl text-[12px] mt-9 2xl:py-5 3xl:py-8'>Already have an account? <Link href="/login" className='text-primary-yellow underline'>Log in</Link></p> 
        </div>
    )
}

const SubmitPayment = () => {
    const {cardFieldsForm} = usePayPalCardFields();

    function submitHandler() {
        cardFieldsForm?.submit()
        .then(() => {
            // submit successful
        })
        .catch(() => {
            // submission error
        });
    }
    return <Button1 text="Check out" onClick={submitHandler} style={{marginTop: ".5%"}} />;
};
