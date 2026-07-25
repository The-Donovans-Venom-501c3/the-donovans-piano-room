import Image from "next/image";
import Link from "next/link";

interface SignupHeaderProps {
  stepNum: number;
  totalSteps?: number;
  navLink: string;
  navName: string;
  stepName: string;
  onClickNav?: (e: React.MouseEvent) => void;
}

export default function SignupHeader({
  stepNum,
  totalSteps = 5,
  navLink,
  navName,
  stepName,
  onClickNav = undefined,
}: SignupHeaderProps) {
  return (
    <>
      <Link
        onClick={onClickNav}
        href={navLink}
        className="relative mb-5 flex items-center gap-2 text-xl font-bold text-primary-yellow 3xl:text-3xl"
      >
        <Image src="/YellowBackIcon.svg" width={30} height={30} alt="Back" />
        <span>{navName}</span>
      </Link>

      <h1 className="font-montserrat mb-5 text-7xl font-bold leading-tight tracking-tight text-white 3xl:text-8xl">
        Sign Up
      </h1>

      <div className="mb-5 2xl:mb-[20px] 2xl:mt-5">
        <p className="text-lg font-semibold text-white 3xl:mb-4 3xl:text-2xl">
          Step {stepNum} of {totalSteps}
        </p>
        <p className="text-2xl font-semibold text-primary-yellow 3xl:text-4xl">
          {stepName}
        </p>
      </div>
    </>
  );
}