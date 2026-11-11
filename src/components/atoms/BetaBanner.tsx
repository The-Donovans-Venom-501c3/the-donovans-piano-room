import Link from "next/link";

export default function BetaBanner() {
  return (
    <div className="flex h-12 sm:h-14 w-full items-center justify-center bg-[#e8d16f] px-3 text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary-purple">
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