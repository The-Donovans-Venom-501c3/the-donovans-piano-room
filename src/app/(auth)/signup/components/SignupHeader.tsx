"use client";

import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface SignupHeaderProps {
  navName?: string;
  navLink?: string;
  stepNum: number;
  totalSteps: number;
  stepName: string;
}

export default function SignupHeader({
  navName = "Home",
  navLink = "/",
  stepNum,
  totalSteps,
  stepName,
}: SignupHeaderProps) {
  return (
    <header className="flex flex-col gap-2 w-full text-left">
      {/* Scaled-up Home Link */}
      <Link
        href={navLink}
        className="inline-flex items-center gap-2 text-[#FACC15] hover:opacity-80 transition-opacity font-bold text-lg sm:text-xl w-fit mb-2"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FACC15] text-purple-900">
          <ArrowBackIcon className="!text-xl font-bold" />
        </span>
        <span>{navName}</span>
      </Link>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
        Sign up
      </h1>

      {/* Step Info */}
      <p className="text-white/80 font-semibold text-base sm:text-lg">
        Step {stepNum} of {totalSteps}
      </p>

      {/* Step Subtitle */}
      <h2 className="text-[#FACC15] text-2xl sm:text-3xl font-extrabold mt-1">
        {stepName}
      </h2>
    </header>
  );
}