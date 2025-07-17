"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ShippingForm({
  billing,
}: {
  billing: any;
}) {
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
  });

  // ✅ 自动同步 billing 到 shipping（仅当勾选 sameAsBilling 时）
  useEffect(() => {
    if (sameAsBilling && billing) {
      setShipping(billing);
    }
  }, [sameAsBilling, billing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <form className="space-y-6 bg-white p-8 rounded-[12px] shadow-md mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#5C3A0F] select-none">Shipping address</h2>
        <div
          className="cursor-pointer"
          onClick={() => setFormVisible(!formVisible)}
          title={formVisible ? "Collapse form" : "Expand form"}
        >
          <Image src="/cart/pen.svg" alt="edit" width={20} height={20} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-purple-600"
          checked={sameAsBilling}
          onChange={(e) => setSameAsBilling(e.target.checked)}
          id="sameAsBilling"
        />
        <label htmlFor="sameAsBilling" className="text-[#5C3A0F]">
          Same as billing address
        </label>
      </div>

      {sameAsBilling && billing && (
        <div className="bg-white p-4 rounded-[12px] text-xl text-gray-700 max-h-48 overflow-auto whitespace-pre-wrap">
          <span className="font-bold">
            {billing.firstName} {billing.lastName}
          </span>
          <br />
          <span className="uppercase">
            {billing.address}
            <br />
            {billing.apt && (
              <>
                {billing.apt}
                <br />
              </>
            )}
            {billing.city}, {billing.state} {billing.zip}
          </span>
        </div>
      )}

      {formVisible && !sameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "firstName", label: "First name *" },
            { id: "lastName", label: "Last name *" },
            { id: "address", label: "Street address *", colSpan: 2 },
            { id: "apt", label: "Apt/suite/other (Optional)", colSpan: 2 },
            { id: "city", label: "City *" },
            { id: "state", label: "State *" },
            { id: "zip", label: "ZIP Code *" },
          ].map(({ id, label, colSpan }) => (
            <div key={id} className={colSpan ? `md:col-span-${colSpan} relative` : "relative"}>
              <label
                htmlFor={id}
                className="absolute left-4 top-2 text-[10px] font-medium text-[#391F0F] pointer-events-none transition-all"
              >
                {label}
              </label>
              <input
                id={id}
                name={id}
                value={(shipping as any)[id]}
                className="w-full rounded-[12px] border border-[#391F0F] bg-[#FEF8EE] px-4 pt-5 pb-2 text-[#5C3A0F] focus:outline-none focus:ring-2 focus:ring-[#BFA2FF]"
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
