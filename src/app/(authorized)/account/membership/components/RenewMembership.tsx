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
        {isBeta ? "Beta Access Status" : "Renew Membership"}
      </h1>

      {/* Description */}
      <p className="text-2xl text-primary-black">
        {isBeta ? (
          <>
            You currently have <span className="font-semibold text-tertiary-orange">full access</span> during our Beta testing period. We will notify you before official paid plans launch!
          </>
        ) : (
          <>
            Your membership will expire on <span className="font-semibold text-tertiary-orange">{formattedDate || '--/--/----'}</span>. To continue enjoying exclusive benefits, please renew manually.
          </>
        )}
      </p>

      {/* Renew Button (Hidden during Beta testing) */}
      {!isBeta && onRenewClick && (
        <div className="mt-4 flex w-full justify-center">
          <button
            type="button"
            onClick={onRenewClick}
            className="w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white font-semibold text-3xl hover:bg-purple-700 transition-colors"
          >
            Renew Membership
          </button>
        </div>
      )}
    </div>
  );
}