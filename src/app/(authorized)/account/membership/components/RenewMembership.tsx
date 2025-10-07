import { formatRenewalDate } from "@/app/(authorized)/account/membership/config";

interface RenewMembershipProps {
  nextRenewalAt?: string;
  onRenewClick: () => void;
}

export default function RenewMembership({
  nextRenewalAt,
  onRenewClick,
}: RenewMembershipProps) {
  const formattedDate = formatRenewalDate(nextRenewalAt);

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl bg-primary-skin p-6 h-full">
      <h1 className="font-montserrat text-3xl font-semibold md:text-3xl text-primary-brown">
        Renew Membership
      </h1>

      <p className="text-2xl text-primary-black">
        Your membership will expire on <span className="font-semibold text-tertiary-orange">{formattedDate || '--/--/----'}</span>. To continue enjoying exclusive benefits, please renew manually.
      </p>

      {/* Renew Button */}
      <div className="mt-4 flex w-full justify-center">
        <button
          type="button"
          onClick={onRenewClick}
          className="w-full rounded-full bg-primary-purple px-6 py-5 text-center text-white font-semibold text-3xl hover:bg-purple-700 transition-colors"
        >
          Renew Membership
        </button>
      </div>
    </div>
  );
}
