import Link from "next/link";
export default function BetaBanner() {
  return (
    <div className="fixed top-0 left-0 z-[60] flex h-10 w-full items-center justify-center bg-[#e8d16f] px-4 text-center text-sm sm:text-base font-bold text-primary-purple">
      <span>
        We&apos;re in Beta Mode! Read the{" "}
        <Link href="/about/faqs" className="underline hover:opacity-80">
          FAQs
        </Link>{" "}
        to learn more.
      </span>
    </div>
  );
}