import React, { useState, useEffect, useMemo } from "react";
import {
  Method,
  MethodType,
  Brand,
  ValidationErrors,
  CardData,
  BankAccountData,
  BillingAddress,
} from "@/interfaces/paymentInterface";
import {
  getCardType,
  formatCardNumber,
  formatExpiryDate,
  formatCvv,
  validateExpiryDate,
  formatZipCode,
  validateBankAccountFields,
} from "@/utils/paymentUtils";
import Modal from "./Modal";
import InputForm from "@/components/atoms/form-input";
import CountrySelect from "../countryDropdown";
import Button3 from "@/components/atoms/Button3";
import Button4 from "@/components/atoms/Button4";
import { Close } from "@mui/icons-material";

// --- Helper Component ---
function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 text-[15px] text-[#3C2A1A]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 accent-[#6F2DBD]"
      />
      <span>{label}</span>
    </label>
  );
}

// --- Main Component ---
export type FormMode = "ADD" | "EDIT";
export type FormDataType = CardData | BankAccountData;

interface PaymentMethodModalProps {
  mode: FormMode;
  type: MethodType | null;
  methodToEdit?: Method | null;
  onClose: () => void;
  onSubmit: (
    data: FormDataType,
    isDefault: boolean,
    originalId?: string,
  ) => void;
  onError: (message: string) => void;
}

export default function PaymentMethodModal({
  mode,
  type,
  methodToEdit,
  onClose,
  onSubmit,
  onError,
}: PaymentMethodModalProps) {
  // --- State Management ---
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [makeDefault, setMakeDefault] = useState(true);

  // Card state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [brand, setBrand] = useState<Brand>("OTHER");
  const [billingSame, setBillingSame] = useState(false);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("");

  // Bank state
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState<"CHECKING" | "SAVINGS">(
    "CHECKING",
  );

  const resetForm = () => {
    setErrors({});
    setMakeDefault(true);
    setFirstName("");
    setLastName("");
    setNumber("");
    setExpiry("");
    setCvv("");
    setBrand("OTHER");
    setBillingSame(false);
    setBillingFirstName("");
    setBillingLastName("");
    setBillingAddress("");
    setBillingCity("");
    setBillingState("");
    setBillingZip("");
    setBillingCountry("");
    setAccountHolderName("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountType("CHECKING");
  };

  useEffect(() => {
    if (mode === "ADD") {
      resetForm();
    } else if (mode === "EDIT" && methodToEdit) {
      resetForm();
      setMakeDefault(methodToEdit.isDefault);
      if (methodToEdit.card) {
        const { card, billing } = methodToEdit;
        setNumber(`•••• •••• •••• ${card.last4}`);
        setExpiry(card.expiry);
        setCvv("***"); // masked CVV
        setBrand(card.brand);

        if (billing && billing.line1) {
          setBillingSame(false);
          setBillingFirstName(billing.firstName || "");
          setBillingLastName(billing.lastName || "");
          setBillingAddress(billing.line1 || "");
          setBillingCity(billing.city || "");
          setBillingState(billing.state || "");
          setBillingZip(billing.zip || "");
          setBillingCountry(billing.countryCode || "");
        }
      }
    }
  }, [mode, methodToEdit]);

  const title = useMemo(() => {
    if (mode === "ADD") {
      if (type === "CARD") return "Add Card";
      if (type === "BANK") return "Add Bank Account";
    }
    return "Edit Payment Method";
  }, [mode, type]);

  const ctaText = useMemo(
    () =>
      mode === "ADD"
        ? `Add ${type === "BANK" ? "Bank" : "Card"}`
        : "Update Method",
    [mode, type],
  );

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setNumber(formatted);
    setBrand(getCardType(formatted));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiry(formatted);
    if (formatted.length === 5) {
      setErrors((prev) => ({ ...prev, expiry: validateExpiryDate(formatted) }));
    }
  };

  const handleSubmit = () => {
    const originalId = mode === "EDIT" ? methodToEdit?.id : undefined;

    if (type === "CARD") {
      if (mode === "ADD") {
        const requiredFields = [firstName, lastName, number, expiry, cvv];
        if (requiredFields.some((field) => !field.trim())) {
          return onError("Please fill in all required card fields.");
        }
      }

      let billingInfo: BillingAddress | undefined = undefined;
      const requiredBilling = [
        billingFirstName,
        billingLastName,
        billingAddress,
        billingCity,
        billingState,
        billingZip,
        billingCountry,
      ];
      if (requiredBilling.some((field) => !field.trim())) {
        return onError("Please complete all billing address fields.");
      }
      billingInfo = {
        first_name: billingFirstName,
        last_name: billingLastName,
        address_line_1: billingAddress,
        admin_area_2: billingCity,
        admin_area_1: billingState,
        postal_code: billingZip,
        country_code: billingCountry,
      };

      const cardPayload: CardData = {
        number: number.replace(/\s/g, ""),
        expiry: expiry,
        security_code: cvv,
        name: `${firstName} ${lastName}`,
        billing_address: billingInfo,
      };
      onSubmit(cardPayload, makeDefault, originalId);
    }

    if (type === "BANK") {
      const validationErrors = validateBankAccountFields(
        accountHolderName,
        routingNumber,
        accountNumber,
      );
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return onError(
          Object.values(validationErrors)[0] ||
            "Please check bank account details.",
        );
      }

      const bankPayload: BankAccountData = {
        account_holder_name: accountHolderName,
        account_number: accountNumber,
        routing_number: routingNumber,
        account_type: accountType,
      };
      onSubmit(bankPayload, makeDefault, originalId);
    }
  };

  if (!type) return null;

  return (
    <Modal onClose={onClose}>
      <div className="flex max-h-[90vh] w-auto max-w-[600px] flex-col overflow-hidden rounded-[12px] bg-[#FCEBDD]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#FCEBDD] px-6 pb-4 pt-8">
          <h2 className="text-[26px] font-semibold text-[#2E1D0F]">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <Close fontSize="large" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="grid grid-cols-1 gap-4">
            {type === "CARD" && (
              <>
                {mode === "ADD" && (
                  <div className="grid grid-cols-2 gap-3">
                    <InputForm
                      field={{
                        label: "First Name *",
                        name: "firstName",
                        type: "text",
                      }}
                      text={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      error={errors.firstName || ""}
                    />
                    <InputForm
                      field={{
                        label: "Last Name *",
                        name: "lastName",
                        type: "text",
                      }}
                      text={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      error={errors.lastName || ""}
                    />
                  </div>
                )}
                <InputForm
                  field={{
                    label: "Card Number *",
                    name: "cardNumber",
                    type: "text",
                  }}
                  text={number}
                  onChange={handleCardNumberChange}
                  error={errors.number || ""}
                  disabled={mode === "EDIT"}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputForm
                    field={{
                      label: "Expiration Date *",
                      name: "expiry",
                      type: "text",
                    }}
                    text={expiry}
                    onChange={handleExpiryChange}
                    error={errors.expiry || ""}
                    disabled={mode === "EDIT"}
                  />
                  <InputForm
                    field={{ label: "CVV *", name: "cvv", type: "password" }}
                    text={cvv}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCvv(formatCvv(e.target.value, brand))
                    }
                    error={errors.cvv || ""}
                    disabled={mode === "EDIT"}
                  />
                </div>
                <CheckRow
                  label="Make this my default payment method"
                  checked={makeDefault}
                  onChange={setMakeDefault}
                />
                <CheckRow
                  label="Billing info is different from shipping"
                  checked={!billingSame}
                  onChange={(isChecked) => setBillingSame(!isChecked)}
                />

                {!billingSame && (
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#391F0F]/20 pt-4">
                    <h3 className="text-[22px] font-semibold text-[#2E1D0F]">
                      Billing Address
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <InputForm
                        field={{
                          label: "First Name *",
                          name: "billingFirstName",
                          type: "text",
                        }}
                        text={billingFirstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillingFirstName(e.target.value)
                        }
                        error={errors.billingFirstName || ""}
                      />
                      <InputForm
                        field={{
                          label: "Last Name *",
                          name: "billingLastName",
                          type: "text",
                        }}
                        text={billingLastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillingLastName(e.target.value)
                        }
                        error={errors.billingLastName || ""}
                      />
                    </div>
                    <InputForm
                      field={{
                        label: "Street Address *",
                        name: "billingAddress",
                        type: "text",
                      }}
                      text={billingAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBillingAddress(e.target.value)
                      }
                      error={errors.billingAddress || ""}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <InputForm
                        field={{
                          label: "City *",
                          name: "billingCity",
                          type: "text",
                        }}
                        text={billingCity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillingCity(e.target.value)
                        }
                        error={errors.billingCity || ""}
                      />
                      <InputForm
                        field={{
                          label: "State / Province *",
                          name: "billingState",
                          type: "text",
                        }}
                        text={billingState}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillingState(e.target.value)
                        }
                        error={errors.billingState || ""}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputForm
                        field={{
                          label: "ZIP / Postal Code *",
                          name: "billingZip",
                          type: "text",
                        }}
                        text={billingZip}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillingZip(formatZipCode(e.target.value))
                        }
                        error={errors.billingZip || ""}
                      />
                      <CountrySelect
                        value={billingCountry}
                        onChange={setBillingCountry}
                        error={errors.billingCountry}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* BANK FORM */}
            {type === "BANK" && (
              <>
                <InputForm
                  field={{
                    label: "Account Holder Name *",
                    name: "accountHolderName",
                    type: "text",
                  }}
                  text={accountHolderName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccountHolderName(e.target.value)
                  }
                  error={errors.accountHolderName || ""}
                />
                <InputForm
                  field={{
                    label: "Routing Number *",
                    name: "routingNumber",
                    type: "text",
                  }}
                  text={routingNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRoutingNumber(e.target.value)
                  }
                  error={errors.routingNumber || ""}
                />
                <InputForm
                  field={{
                    label: "Account Number *",
                    name: "accountNumber",
                    type: "text",
                  }}
                  text={accountNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccountNumber(e.target.value)
                  }
                  error={errors.accountNumber || ""}
                />
                <div className="mb-4">
                  <label className="mb-1 block text-[15px] font-medium text-[#3C2A1A]">
                    Account type *
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) =>
                      setAccountType(e.target.value as "CHECKING" | "SAVINGS")
                    }
                    className="w-full rounded-2xl border border-[#C99B3B] bg-[#FFF6EC] px-4 py-3 text-[16px] text-[#3C2A1A] outline-none"
                  >
                    <option value="CHECKING">Checking</option>
                    <option value="SAVINGS">Savings</option>
                  </select>
                </div>
                <CheckRow
                  label="Make this my default payment method"
                  checked={makeDefault}
                  onChange={setMakeDefault}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 bg-[#FCEBDD] px-6 pb-8 pt-4">
          <Button4 text="Cancel" onClick={onClose} style={{ width: "120px" }} />
          <Button3
            text={ctaText}
            onClick={handleSubmit}
            style={{ width: "120px" }}
          />
        </div>
      </div>
    </Modal>
  );
}
