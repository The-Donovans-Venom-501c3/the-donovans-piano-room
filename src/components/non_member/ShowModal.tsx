import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { modalShow } from "@/utils/stores";
import { useSetAtom } from "jotai";

export default function ShowModal() {
  const setShowModal = useSetAtom(modalShow);

  return (
    <div
      className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-[2px]  backdrop-brightness-50 "
      onClick={() => setShowModal(false)}
    >
      <div
        className="relative flex h-[40%] w-[50%] items-center justify-center rounded-2xl bg-[#FFF2E5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 flex w-full justify-between px-4 py-2">
          <div className="m-4 rounded-2xl bg-[#E2E2E2] p-2 text-2xl font-semibold">
            Payment pending
          </div>
          <div
            className="font- m-4 rounded-lg p-2"
            onClick={() => setShowModal(false)}
          >
            <CloseIcon fontSize="large" />
          </div>
        </div>

        <div className="mt-20 text-center ">
          <div className="mt-8 text-5xl font-bold">
            Complete Payment to Unlock Access
          </div>
          <div className="mt-1 text-center text-2xl">
            Secure checkout. Cancel anytime.
          </div>
          <div className="mt-10 text-2xl font-bold">
            You&apos;re just one step away! Finish your payment to unlock full
            access.
          </div>
          <div className="absoulte bottom-3 mt-10 flex justify-center">
            <div className=" rounded-full bg-[#6F219E] p-3 text-2xl font-bold text-white">
              Complete Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
