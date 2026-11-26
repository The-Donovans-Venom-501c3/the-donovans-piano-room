import Link from "next/link";
import LockOutlined from "@mui/icons-material/LockOutlined";

export default function MembershipRequiredBanner({
  membershipHref = "/account/membership",
  membershipLinkText = "View Membership Options",
  showLoginLink = false,
  className = "",
}: {
  membershipHref?: string;
  membershipLinkText?: string;
  showLoginLink?: boolean;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-8 ${className}`}>
      <div className="mb-6 flex items-center justify-center gap-3">
        <LockOutlined sx={{ color: "#4B5563" }} />
        <h2 className="text-2xl font-bold text-gray-800">Membership Required</h2>
      </div>

      <p className="mb-6 text-center text-gray-700">
        You must have an active membership to access this content.
      </p>

      <div className="mb-6 flex justify-center">
        <Link
          href={membershipHref}
          className="rounded-md bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-700"
        >
          {membershipLinkText}
        </Link>
      </div>

      {showLoginLink && (
        <div className="border-t border-gray-200 pt-6 text-center">
          <span className="text-gray-700">Already a member? </span>
          <Link href="/login" className="font-medium text-orange-500 underline hover:text-[#Da6a1c]">
            Log in here
          </Link>
        </div>
      )}
    </div>
  );
}
