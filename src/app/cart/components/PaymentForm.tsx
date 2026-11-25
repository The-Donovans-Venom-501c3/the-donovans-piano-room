"use client";

import React, { useMemo, useState } from "react";

export interface BillingAddressData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const REGION_CODES = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW",
  "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT",
  "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH",
  "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD",
  "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC",
  "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF",
  "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU",
  "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN",
  "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE",
  "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT",
  "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT",
  "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP",
  "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK",
  "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE",
  "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST",
  "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS",
  "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH",
  "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE",
  "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE",
  "ZM", "ZW",
];

export default function PaymentForm({
  onBillingChange,
}: {
  onBillingChange?: (billing: BillingAddressData) => void;
}) {
  const [billing, setBilling] = useState<BillingAddressData>({
    firstName: "",
    lastName: "",
    country: "US",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
  });

  const countries = useMemo(() => {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return REGION_CODES.map((code) => ({
      code,
      name: displayNames.of(code) || code,
    }))
      .filter((c) => c.name !== c.code)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated: BillingAddressData = {
      ...billing,
      [name]: value,
      ...(name === "country" ? { state: "" } : {}),
    };
    setBilling(updated);
    onBillingChange?.(updated);
  };

  const inputStyle =
    "w-full rounded-[12px] border border-[#391F0F] bg-[#FEF8EE] px-5 pt-9 pb-3 text-[1.45rem] text-[#5C3A0F] placeholder-[#BCA29C] focus:outline-none focus:ring-2 focus:ring-[#BFA2FF]";
  const labelStyle =
    "absolute top-2.5 left-5 text-[1.25rem] font-semibold text-[#391F0F] pointer-events-none";

  return (
    <div className="space-y-6 bg-white p-9 rounded-[12px] shadow-md mt-8">
      <h2 className="text-4xl font-semibold text-[#5C3A0F]">
        Payment information
      </h2>
      <h3 className="text-2xl font-semibold text-[#5C3A0F]">Billing address</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <label htmlFor="firstName" className={labelStyle}>
            First name *
          </label>
          <input
            id="firstName"
            name="firstName"
            value={billing.firstName}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="relative">
          <label htmlFor="lastName" className={labelStyle}>
            Last name *
          </label>
          <input
            id="lastName"
            name="lastName"
            value={billing.lastName}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2 relative">
          <label htmlFor="country" className={labelStyle}>
            Country / Region *
          </label>
          <select
            id="country"
            name="country"
            value={billing.country}
            onChange={handleBillingChange}
            className={inputStyle}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 relative">
          <label htmlFor="address" className={labelStyle}>
            Street address *
          </label>
          <input
            id="address"
            name="address"
            value={billing.address}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2 relative">
          <label htmlFor="apt" className={labelStyle}>
            Apt/suite/other (Optional)
          </label>
          <input
            id="apt"
            name="apt"
            value={billing.apt}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="relative">
          <label htmlFor="city" className={labelStyle}>
            City *
          </label>
          <input
            id="city"
            name="city"
            value={billing.city}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>

        <div className="relative">
          <label htmlFor="state" className={labelStyle}>
            State / Province *
          </label>
          {billing.country === "US" ? (
            <select
              id="state"
              name="state"
              value={billing.state}
              onChange={handleBillingChange}
              className={inputStyle}
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="state"
              name="state"
              value={billing.state}
              onChange={handleBillingChange}
              placeholder="Enter state or province"
              className={inputStyle}
              autoComplete="off"
            />
          )}
        </div>

        <div className="relative">
          <label htmlFor="zip" className={labelStyle}>
            ZIP / Postal Code *
          </label>
          <input
            id="zip"
            name="zip"
            value={billing.zip}
            onChange={handleBillingChange}
            className={inputStyle}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}