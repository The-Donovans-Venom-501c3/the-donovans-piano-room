import React, { useState } from "react";
import EmptyCart from "./EmptyCart";

export default function YourCart() {

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[84.7%] mt-[14vh]">
        <div className="flex flex-col items-center rounded-2xl min-h-[50vh] justify-center bg-[#edd6fe]">
          <div className="w-[90%]">
            <h2 className="font-montserrat text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold self-start text-primary-brown mb-[1%]">Your cart</h2>
            <EmptyCart/>
          </div>
        </div>
      </div>
    </div>
  );
}