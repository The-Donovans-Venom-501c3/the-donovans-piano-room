"use client";

import Link from "next/link";
import AuthSucceedWrapper from "@/components/auth/AuthSucceedWrapper";

interface SignupConfirmationProps {
  isBeta?: boolean;
}

export default function SignupConfirmation({ isBeta = true }: SignupConfirmationProps) {
  return (
    <AuthSucceedWrapper>
      <h1 className="font-montserrat mb-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-8xl 2xl:text-8xl 4xl:text-9xl">
        {isBeta ? "Hurray! You're in Beta" : "Hurray! You're in"}
      </h1>

      <div className="mb-6 space-y-4 2xl:mb-[20px] 2xl:mt-5">
        <p className="text-lg text-white md:text-xl 2xl:text-2xl 4xl:text-3xl">
          Your account has been successfully created and verified.
        </p>
        
        <p className="text-lg text-white md:text-xl 2xl:text-2xl 4xl:text-3xl">
          {isBeta
            ? "With your complimentary Beta access now active, you can start exploring all games, tools, and resources in The Donovans' Piano Room!"
            : "With your access now active, you can start exploring The Donovans' Piano Room!"}
        </p>

        <p className="text-lg text-white md:text-xl 2xl:text-2xl 4xl:text-3xl">
          Please Log in to start your experience.
        </p>
      </div>

      {/* Styled Link component filling full width */}
      <Link
        href="/login"
        className="block w-full rounded-full bg-primary-yellow-accent py-4 text-center text-lg font-bold text-primary-purple transition-opacity hover:opacity-90 md:text-xl 2xl:text-2xl 4xl:text-3xl"
      >
        Log in
      </Link>
    </AuthSucceedWrapper>
  );
}