import { MethodType } from "@/interfaces/paymentInterface";
import Image from "next/image";
import React from "react";

// This is a helper component for styling each row in our "menu".
// It's defined here because it's only used by AddPaymentMethodOptions.
interface AddRowProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function AddRow({ label, icon, isSelected, onSelect, disabled }: AddRowProps) {
  return (
    <label
      className={`flex h-[53px] w-[694px] cursor-pointer items-center justify-between rounded-[12px] border-2 border-[#FCF0D8] bg-[#FEF8EE] p-4 shadow-[2px_2px_4px_0px_#AC7A2280] ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* We use a hidden radio input for accessibility */}
        <input
          type="radio"
          name="add-method-option"
          checked={isSelected}
          onChange={onSelect}
          disabled={disabled}
          className="peer hidden"
        />

        {/* This is the custom-styled radio button circle */}
        <div className="flex h-6 w-6 select-none items-center justify-center rounded-full border-2 border-[#6F219E] peer-checked:bg-[#6F219E] peer-disabled:border-gray-400">
          <div className="h-3 w-3 rounded-full bg-white" />
        </div>

        <span className="flex items-center gap-3 text-[16px] font-semibold text-[#3C2A1A] peer-disabled:text-gray-500">
          {icon}
          {label}
        </span>
      </div>
    </label>
  );
}


// --- Main Component ---
interface AddPaymentMethodOptionsProps {
  onSelect: (type: MethodType) => void;
}

export default function AddPaymentMethodOptions({ onSelect }: AddPaymentMethodOptionsProps) {
  // We define the menu options here. This makes it easy to add or remove options later.
  const paymentOptions = [
    {
      type: "CARD" as MethodType,
      label: "Credit or Debit card",
      iconSrc: "/account/payments/CreditCard.svg",
    },
    {
      type: "BANK" as MethodType,
      label: "Bank Account",
      iconSrc: "/account/payments/BankAccount.svg",
    },
    {
      type: "PAYPAL" as MethodType,
      label: "PayPal",
      iconSrc: "/account/payments/PayPal.svg",
      disabled: true, 
    },
    {
      type: "APPLE_PAY" as MethodType,
      label: "Apple Pay",
      iconSrc: "/account/payments/ApplePay.svg",
      disabled: true, 
    },
  ];

  const handleSelection = (type: MethodType, disabled?: boolean) => {
    if (disabled) {
      alert(`${type.replace("_", " ")} integration is coming soon!`);
      return;
    }
    onSelect(type);
  };

  return (
    <div className="mt-8">
      <div className="mb-3 text-[16px] font-semibold text-[#5C3B1E]">
        Add payment method
      </div>

      <div className="space-y-4">
        {paymentOptions.map((option) => (
          <AddRow
            key={option.type}
            label={option.label}
            icon={
              <Image
                src={option.iconSrc}
                alt={option.label}
                width={45}
                height={30}
              />
            }
            isSelected={false}
            onSelect={() => handleSelection(option.type, option.disabled)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </div>
  );
}