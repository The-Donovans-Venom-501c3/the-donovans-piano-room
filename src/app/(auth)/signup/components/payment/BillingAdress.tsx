import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import React, { useState } from "react";

export default function BillingAdress({
  onClickCancel,
}: {
  onClickCancel: () => {};
}) {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [streetAddr, setStreetAddr] = useState("");
  const [aptAddr, setAptAddr] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  return (
    <div className=" w-full">
      <div className="flex w-full">
        <div className=" mt-6 w-full items-center  justify-center space-y-5 px-1">
          {/* Card Number */}
          <div className="h-34 rounded-2xl border border-gray-300 bg-white px-2">
            <label className="mb-1 mt-2 block text-sm font-medium text-[#391F0F]">
              First Name *
            </label>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFName(e.target.value)}
              className="h-10 w-full focus:outline-none focus:ring-0 "
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
              className="h-10 w-full focus:outline-none focus:ring-0 "
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
            className="h-10 w-full focus:outline-none focus:ring-0 "
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
            className="h-10 w-full focus:outline-none focus:ring-0 "
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
            className="h-10 w-full focus:outline-none focus:ring-0 "
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
              className="h-10 w-full focus:outline-none focus:ring-0 "
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
              name="LastName"
              id=""
              className="h-10 w-full focus:outline-none focus:ring-0 "
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
        onClick={onClickCancel}
      />
    </div>
  );
}
