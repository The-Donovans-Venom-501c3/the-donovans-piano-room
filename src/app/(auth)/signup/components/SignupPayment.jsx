"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalCardFieldsProvider,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { membershipChoiceAtom, singupStepAtom } from "@/utils/stores";
// import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import SignupHeader from "./SignupHeader";
import DisplayCard from "./payment/DisplayCard";
import Image from "next/image";

export default function SignupPayment() {
  const [displayCardFields, setDisplayCardFields] = useState(false);
  const membershipId = {
    "24-hours": "001",
    "yearly-access": "004",
    "monthly-access": "002",
    scholarship: "003",
  };
  const [billingAddr, setBillingAddr] = useState(false);
  const setSingupStep = useSetAtom(singupStepAtom);
  const membershipChoice = useAtom(membershipChoiceAtom);
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [streetAddr, setStreetAddr] = useState("");
  const [aptAddr, setAptAddr] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

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

    if (!isFormValid) {
      // Optional: focus the first invalid field for a better UX
      const firstErr = errors?.[0];
      if (firstErr?.field === "cardNumberField")
        fields?.cardNumberField?.focus?.();
      if (firstErr?.field === "cardExpiryField")
        fields?.cardExpiryField?.focus?.();
      if (firstErr?.field === "cardCvvField") fields?.cardCvvField?.focus?.();

      alert("Please fix the highlighted card details before continuing.");
      return;
    }

    // ✅ Card fields are valid — move to your billing form step
    setBillingAddr(true);
  }

  async function submitHandler() {
    if (!cardFieldsForm) return;

    await cardFieldsForm.submit({
      cardholderName: `${fname} ${lname}`.trim(),
      // Ask PayPal to do SCA when applicable (optional — you already set SCA_ALWAYS server-side)
      contingencies: ["3D_SECURE"],
      billingAddress: {
        // Use your state values (fall back to empty string if undefined)
        addressLine1: streetAddr || "",
        addressLine2: aptAddr || "",
        adminArea2: city || "", // City
        adminArea1: state || "", // State/Province
        postalCode: zip || "",
        countryCode: "US",
      },
    });

    // setBillingAddr(true);
  }

  // // ✅ Style applied directly to PayPal iframes

  const createOrder = async () => {
    try {
      const response = await fetch(
        `/api/orders/membership/${membershipId[membershipChoice]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      console.log("Creating order...");
      const orderData = await response.json();
      console.log("Order data received:", orderData);
      if (!orderData.id) {
        const errorDetail = orderData.details[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : "Unexpected error occurred, please try again.";

        throw new Error(errorMessage);
      }
      console.log("Order created successfully:", orderData);
      return orderData.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    const response = await fetch(
      `api/orders/membership/${membershipId[membershipChoice]}/${data.orderID}/capture`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    );

    const details = await response.json();

    // Show success message to buyer
    alert(`Transaction completed by ${details.payer.name.given_name}`);
  };

  const onError = async () => {
    console.error("An error occurred during the transaction.");
    return "";
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <div className="w-[30%] ">
        <SignupHeader
          navName="Membership"
          navLink=""
          stepNum={4}
          stepName="Add your payment method"
          onClickNav={() => setSingupStep(3)}
        />
      </div>

      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
          components: "buttons,card-fields",
          currency: "USD",
          enableFunding: "venmo", // 👈 required
          buyerCountry: "US",
        }}
      >
        {!displayCardFields && (
          <div className="flex  w-[25%] flex-col gap-4">
            <div>
              <Button1
                text="Check out with credit card"
                onClick={() => setDisplayCardFields(true)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button1
                text="Check out with PayPal"
                onClick={() => setDisplayCardFields(true)}
                logo={
                  <Image
                    src="/auth/paypal.svg"
                    alt="PayPal logo"
                    width={20}
                    height={20}
                    className="ml-2"
                  />
                }
              />
            </div>
            <PayPalButtons
              style={{ layout: "vertical", label: "", shape: "pill" }}
              fundingSource="venmo"
              createOrder={createOrder}
              onApprove={onApprove}
            />
            <PayPalButtons
              style={{ shape: "pill" }}
              onApprove={onApprove}
              createOrder={createOrder}
              fundingSource="paypal"
            />
          </div>
        )}
        <div className="w-[30%]">
          {displayCardFields && !billingAddr && (
            <>
              <PayPalCardFieldsProvider
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              >
                <DisplayCard
                  onValid={() => setBillingAddr(true)}
                  setDisplayCardFields={setDisplayCardFields}
                />
              </PayPalCardFieldsProvider>
            </>
          )}
          {billingAddr && (
            <div className="  w-full ">
              <div className="flex w-full">
                <div className=" mt-6 w-full items-center justify-center space-y-5 px-1">
                  {/* Card Number */}
                  <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                    <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFName(e.target.value)}
                      className="h-20 w-full pl-2 text-3xl focus:outline-none focus:ring-0 "
                    />
                  </div>
                </div>

                <div className="mt-6 w-full  items-center justify-center space-y-5 px-1">
                  {/* Card Number */}
                  <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                    <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lname}
                      onChange={(e) => setLName(e.target.value)}
                      className="h-20 w-full pl-2 text-3xl focus:outline-none focus:ring-0 "
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6  items-center justify-center space-y-5">
                <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                  <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={streetAddr}
                    onChange={(e) => setStreetAddr(e.target.value)}
                    className="h-20 w-full  pl-2  text-3xl focus:outline-none focus:ring-0 "
                  />
                </div>
              </div>
              <div className="mt-6  items-center justify-center space-y-5">
                <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                  <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                    Apt/suite/other (Optional)
                  </label>
                  <input
                    type="text"
                    value={aptAddr}
                    onChange={(e) => setAptAddr(e.target.value)}
                    className="h-20 w-full  pl-2  text-3xl focus:outline-none focus:ring-0 "
                  />
                </div>
              </div>
              <div className="mt-6  items-center justify-center space-y-5">
                <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                  <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-20 w-full  pl-2  text-3xl focus:outline-none focus:ring-0 "
                  />
                </div>
              </div>
              <div className="flex w-full">
                <div className=" mt-6 w-full items-center  justify-center space-y-5 px-1">
                  {/* Card Number */}
                  <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                    <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                      State *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="h-20 w-full  pl-2  text-3xl focus:outline-none focus:ring-0 "
                    />
                  </div>
                </div>

                <div className="mt-6 w-full  items-center justify-center space-y-5 px-1">
                  {/* Card Number */}
                  <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
                    <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
                      Zip code *
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="h-20 w-full pl-2 text-3xl focus:outline-none focus:ring-0 "
                    />
                  </div>
                </div>
              </div>
              <Button1
                text="Check out"
                //   onClick={submitHandler}
                style={{ marginTop: "0.5rem" }}
              />
              <Button2
                style={{ marginTop: "1rem" }}
                text="Cancel"
                onClick={() => setBillingAddr(false)}
              />
            </div>
            // <BillingAdress onClickCancel={() => setBillingAddr(false)} />
          )}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

//member_id
//001 one time

const Button1 = ({
  text,
  onClick = null,
  style = {},
  type = "button",
  disabled = false,
  logo,
}) => {
  return (
    <button
      type={type}
      onClick={onClick ?? undefined}
      style={style}
      disabled={disabled}
      className="flex h-[42px] w-full items-center  justify-center gap-2 rounded-3xl bg-yellow-400 px-6 py-3 font-semibold text-purple-900 disabled:opacity-50"
    >
      <p className="text-xl font-bold">{text}</p>
      <div>{logo}</div>
    </button>
  );
};

// const SubmitPayment = () => {
//   const { cardFieldsForm } = usePayPalCardFields();

//   return (

//   );
// };
