import Button1 from "@/components/atoms/Button1";
import { membershipChoiceAtom } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PaymentConfirmation() {
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  return (
    <div className="absolute flex h-[500px] w-[750px]  items-center justify-center">
      <div className="absolute left-0 flex-[0.6]">
        <Image
          alt="smily"
          src="/auth/smilingcharacter.svg"
          width={150}
          height={150}
        />
        <div className="absolute right-0 ">
          <Image alt="stars" src="/auth/stars.svg" width={100} height={100} />
        </div>
      </div>
      <div className="absolute right-40">
        <div className="items-center justify-center">
          <p className="p-4 text-8xl font-semibold text-white">Hurray! </p>
          <p className="p-4 text-8xl font-semibold text-white">
            You&apos;re in
          </p>
        </div>
        <div className="w-[90%]">
          <p className="p-5 text-2xl text-white">
            Your {membershipChoice ?? "Monthly"} access is now active and your
            account have been created.
          </p>
        </div>
        <div className="mt-8 flex w-[90%] items-center justify-center">
          <Link
            href={"/login"}
            className=" w-full rounded-full bg-[#F0D454] py-3 text-center  text-[12px] font-bold text-primary-purple hover:bg-[#E9BB18] active:bg-[#DAA718] 2xl:rounded-full 2xl:py-4 2xl:text-2xl 3xl:py-5 4xl:text-3xl"
          >
            Login
          </Link>
        </div>
      </div>
      <div className="">
        <div className="absolute top-20 align-middle">
          <Image
            alt="stars"
            src="/auth/stars_right.svg"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
