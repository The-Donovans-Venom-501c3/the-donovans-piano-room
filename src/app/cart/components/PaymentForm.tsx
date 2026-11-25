"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BillingAddressData } from "@/lib/api/cartService";

export type { BillingAddressData };

interface PaymentFormProps {
  onBillingChange?: (billing: BillingAddressData | null) => void;
}

interface CountryOption {
  code: string;
  name: string;
}

const US_STATES: { code: string; name: string }[] = [
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

const FALLBACK_COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "MX", name: "Mexico" },
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

function getCountries(): CountryOption[] {
  try {
    if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      const list: CountryOption[] = [];
      for (const code of REGION_CODES) {
        const name = displayNames.of(code);
        if (name && name !== code) {
          list.push({ code, name });
        }
      }
      if (list.length > 0) {
        list.sort((a, b) => {
          if (a.code === "US") return -1;
          if (b.code === "US") return 1;
          return a.name.localeCompare(b.name);
        });
        return list;
      }
    }
  } catch {
    // Fall back to curated list if Intl.DisplayNames is unavailable.
  }
  return FALLBACK_COUNTRIES;
}

const labelStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  lineHeight: "1.6rem",
  fontWeight: 600,
  color: "#1C1A1A",
};

const inputStyle: React.CSSProperties = {
  fontSize: "1.45rem",
  lineHeight: "2rem",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #C7B8E8",
  backgroundColor: "#FFFFFF",
  color: "#1C1A1A",
  width: "100%",
};

export default function PaymentForm({ onBillingChange }: PaymentFormProps) {
  const countries = useMemo(() => getCountries(), []);
  const onBillingChangeRef = useRef(onBillingChange);
  onBillingChangeRef.current = onBillingChange;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("US");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    const callback = onBillingChangeRef.current;
    if (!callback) return;

    const payload: BillingAddressData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country,
      address: address.trim(),
      apartment: apartment.trim() || undefined,
      city: city.trim(),
      state: stateRegion.trim(),
      zip: zip.trim(),
    };

    const hasAnyInput = Boolean(
      payload.firstName ||
        payload.lastName ||
        payload.address ||
        payload.apartment ||
        payload.city ||
        payload.state ||
        payload.zip ||
        payload.country !== "US"
    );

    callback(hasAnyInput ? payload : null);
  }, [firstName, lastName, country, address, apartment, city, stateRegion, zip]);

  const handleCountryChange = (nextCountry: string) => {
    setCountry(nextCountry);
    setStateRegion("");
  };

  return (
    <section
      aria-label="Billing Address"
      className="flex flex-col rounded-[12px] bg-white p-[32px] gap-[18px] shadow-md w-full"
    >
      <div className="flex flex-col gap-1">
        <h4 className="font-roboto text-4xl font-semibold leading-[28px] text-[#59371D]">
          Billing Address
        </h4>
        <p style={{ fontSize: "1.25rem", lineHeight: "1.6rem" }} className="text-primary-gray">
          Required fields are marked with <span className="text-red-600 font-semibold">*</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="billing-first-name" style={labelStyle}>
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id="billing-first-name"
            name="billingFirstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="billing-last-name" style={labelStyle}>
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id="billing-last-name"
            name="billingLastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label htmlFor="billing-country" style={labelStyle}>
          Country / Region <span className="text-red-600">*</span>
        </label>
        <select
          id="billing-country"
          name="billingCountry"
          autoComplete="country"
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          style={inputStyle}
        >
          {countries.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label htmlFor="billing-address" style={labelStyle}>
          Street Address <span className="text-red-600">*</span>
        </label>
        <input
          id="billing-address"
          name="billingAddress"
          type="text"
          autoComplete="address-line1"
          placeholder="Street address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label htmlFor="billing-apartment" style={labelStyle}>
          Apartment, suite, unit, etc. (optional)
        </label>
        <input
          id="billing-apartment"
          name="billingApartment"
          type="text"
          autoComplete="address-line2"
          placeholder="Apartment, suite, unit, etc."
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="billing-city" style={labelStyle}>
            City <span className="text-red-600">*</span>
          </label>
          <input
            id="billing-city"
            name="billingCity"
            type="text"
            autoComplete="address-level2"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="billing-state" style={labelStyle}>
            {country === "US" ? "State" : "State / Province"}{" "}
            <span className="text-red-600">*</span>
          </label>
          {country === "US" ? (
            <select
              id="billing-state"
              name="billingState"
              autoComplete="address-level1"
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a state</option>
              {US_STATES.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="billing-state"
              name="billingState"
              type="text"
              autoComplete="address-level1"
              placeholder="State / Province / Region"
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              style={inputStyle}
            />
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="billing-zip" style={labelStyle}>
            {country === "US" ? "ZIP Code" : "Postal Code"}{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            id="billing-zip"
            name="billingZip"
            type="text"
            autoComplete="postal-code"
            placeholder={country === "US" ? "ZIP code" : "Postal code"}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
    </section>
  );
}