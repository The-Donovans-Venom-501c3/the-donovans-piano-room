import Link from "next/link";
export default function BetaBanner() {
  return (
    <div className="fixed top-0 left-0 z-[60] flex h-10 w-full items-center justify-center bg-[#e8d16f] px-3 text-center text-xs font-bold text-primary-purple sm:text-sm">
      <span className="truncate">
        We&apos;re in Beta Mode! Read the{" "}
        <Link href="/about/faqs" className="underline hover:opacity-80">
          FAQs
        </Link>{" "}
        to learn more.
      </span>
    </div>
  );
}