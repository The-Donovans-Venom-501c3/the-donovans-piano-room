"use client";

import { formatRenewalDate } from "@/app/(authorized)/account/membership/config";

interface RenewMembershipProps {
  nextRenewalAt?: string;
  onRenewClick?: () => void;
  isBeta?: boolean;
}

export default function RenewMembership({
  nextRenewalAt,
  onRenewClick,
  isBeta = false,
}: RenewMembershipProps) {
  const formattedDate = formatRenewalDate(nextRenewalAt);

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl bg-primary-skin p-6 h-full">
      {/* Title */}
      <h1 className="font-montserrat text-3xl font-semibold md:text-3xl text-primary-brown">
        Renew Membership
      </h1>

      {/* Description */}
      <p className="text-2xl text-primary-black">
        {isBeta ? (
          <>
            Your membership active status is managed annually. Renewals are paused during{" "}
            <span className="font-semibold text-tertiary-orange">The Piano Room Beta</span>.
          </>
        ) : (
          <>
            Your membership active status is managed annually. To continue enjoying exclusive benefits, please renew manually.
            {formattedDate && (
              <span className="block mt-2 font-semibold text-tertiary-orange">
                Expires on: {formattedDate}
              </span>
            )}
          </>
        )}
      </p>

      {/* Renew Button */}
      <div className="mt-4 flex w-full justify-center">
        <button
          type="button"
          onClick={onRenewClick}
          className="w-full rounded-full px-6 py-5 text-center font-semibold text-3xl transition-all cursor-pointer bg-primary-purple text-white hover:bg-purple-700 shadow-md active:scale-[0.98]"
        >
          Renew Membership
        </button>
      </div>
    </div>
  );
}