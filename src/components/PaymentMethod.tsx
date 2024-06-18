import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./PaymentMethod.css"
export default function PaymentMethod() {
    const initialOptions = {
        clientId: "test",
        enableFunding: "venmo",
        disableFunding: "",
        currency: "USD",
        dataSdkIntegrationSource: "developer-studio",
    };
    return (
        <div className="w-[24vw] max-h-[60vh] overflow-x-auto px-6">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons style={{ shape: "pill" }} />
            </PayPalScriptProvider>
        </div>
    )
}
