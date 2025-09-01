import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { IsNavOpenAtom, modalShow } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";

interface BlurCompProps {
  className?: String;
  section: String;
}

function BlurComp({ className, section }: BlurCompProps) {
  const [showModal, setShowModal] = useAtom(modalShow);
  const isNavOpen = useAtomValue(IsNavOpenAtom);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`absolute z-[90] flex items-center justify-center rounded-2xl backdrop-blur-sm ${className}`}
      >
        <div
          className={`flex items-center justify-center ${
            section == "Home" ? " flex-col" : ""
          }`}
        >
          <LockOutlinedIcon
            className={
              section == "Home"
                ? "h-1/2 w-1/3"
                : section == "Game"
                  ? "h-1/3 w-1/4"
                  : section == "NavBar4" && !isNavOpen
                    ? "h-1/2 w-1/3"
                    : "h-1/6 w-1/6"
            }
          />
          {section === "Home" && (
            <div className="m-4 rounded-2xl bg-[#E2E2E2] p-2 text-2xl font-semibold">
              Payment pending
            </div>
          )}
          {section === "NavBar4" && isNavOpen && (
            <div className="m-4 rounded-2xl p-2 text-2xl font-semibold">
              Locked
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlurComp;
