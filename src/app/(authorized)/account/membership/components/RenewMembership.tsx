import { formatRenewalDate } from "@/app/(authorized)/account/membership/config";

interface RenewMembershipProps {
  nextRenewalAt?: string;
  onRenewClick?: () => void;
  isBeta?: boolean; // Controls Beta UI mode
}

export default function RenewMembership({
  nextRenewalAt,
  onRenewClick,
  isBeta = true, // Default to true for Beta launch
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
            Your membership active status is managed annually. Renewals are paused during <span className="font-semibold text-tertiary-orange">The Piano Room Beta</span>.
          </>
        ) : (
          <>
            Your membership will expire on <span className="font-semibold text-tertiary-orange">{formattedDate || '--/--/----'}</span>. To continue enjoying exclusive benefits, please renew manually.
          </>
        )}
      </p>

      {/* Renew Button (Disabled & Grayed out in Beta mode) */}
      <div className="mt-4 flex w-full justify-center">
        <button
          type="button"
          disabled={isBeta}
          onClick={isBeta ? undefined : onRenewClick}
          className={`w-full rounded-full px-6 py-5 text-center font-semibold text-3xl transition-all ${
            isBeta
              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 pointer-events-none"
              : "bg-primary-purple text-white hover:bg-purple-700"
          }`}
        >
          Renew Membership
        </button>
      </div>
    </div>
  );
}