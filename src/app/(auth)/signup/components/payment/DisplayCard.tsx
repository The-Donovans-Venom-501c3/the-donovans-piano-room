import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import Checkbox from "@/components/atoms/Checkbox";
import {
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import React, { useState } from "react";

export default function DisplayCard({
  onValid,
  setDisplayCardFields,
}: {
  onValid: () => void;
  setDisplayCardFields: any;
}) {
  const [zipCode, setZipCode] = useState("");

  const fieldStyle = {
    input: {
      color: "#391F0F",
      "font-size": "16px",
      "font-family": "inherit",
      padding: "15px",
      border: "none", // 🔑 removes inner border
      outline: "none", // 🔑 prevents focus outline
      "box-shadow": "none", // 🔑 removes default PayPal shadow
    },
    ".invalid": {
      color: "red",
    },
    "::placeholder": {
      color: "#999999",
    },
  };

  const { cardFieldsForm, fields } = usePayPalCardFields();
  async function goToBilling() {
    console.log("calling go to billing");
    if (!cardFieldsForm) {
      alert(
        "Payment form is not ready yet. Please wait a second and try again.",
      );
      return;
    }
    console.log("calling go to billing");

    // Ask the SDK for current validity of all rendered card fields
    const { isFormValid, errors } = await cardFieldsForm.getState();

    if (!isFormValid || zipCode.length > 5) {
      // Optional: focus the first invalid field for a better UX
      //   const firstErr = errors?.[0];

      //   if (firstErr?.field === "cardNumberField") fields?.NumberField?.focus?.();
      //   if (firstErr?.field === "cardExpiryField") fields?.ExpiryField?.focus?.();
      //   if (firstErr?.field === "cardCvvField") fields?.CVVField?.focus?.();

      alert("Please enter valid card detail to proceed");
      return;
    }

    onValid();
  }

  return (
    <div className="mt-6  items-center justify-center space-y-5">
      {/* Card Number */}
      <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
        <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
          Card number
        </label>
        {/* <div className="items-centerpx-4 flex  "> */}
        <PayPalNumberField
          style={fieldStyle}
          placeholder="1234 5678 9012 3456"
        />
        {/* </div> */}
      </div>

      {/* Expiration / CVC / Zip */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl border border-gray-300 bg-white px-2">
          <label className="mb-1 mt-2  block text-sm font-medium text-[#391F0F]">
            Expiration date
          </label>
          {/* <div className="flex h-14 w-full items-center rounded-2xl border border-gray-300 bg-white px-4"> */}
          <PayPalExpiryField style={fieldStyle} placeholder="MM/YY" />
          {/* </div> */}
        </div>

        <div className="flex-1 rounded-2xl border border-gray-300 bg-white px-2">
          <label className="mb-1 mt-2  block text-sm font-medium text-[#391F0F]">
            CVC
          </label>
          <PayPalCVVField style={fieldStyle} placeholder="123" />
        </div>

        <div className="flex-1 rounded-2xl bg-white px-2">
          <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
            Zip code
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="12345"
            className="h-[70%] w-full justify-center rounded-2xl bg-white px-4 text-2xl  text-[#391F0F] focus:border-2 focus:border-yellow-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Checkbox */}
      <Checkbox checked={false} onChange={(e) => console.log(e)}>
        <span className="text-lg text-white">
          Set up as default payment method
        </span>
      </Checkbox>

      {/* Buttons */}
      <Button1
        text="Continue to Billing Information"
        onClick={goToBilling}
        style={{ marginTop: "0.5rem" }}
      />
      <Button2
        style={{ marginTop: "1rem" }}
        text="Cancel"
        onClick={() => setDisplayCardFields(false)}
      />
    </div>
  );
}
