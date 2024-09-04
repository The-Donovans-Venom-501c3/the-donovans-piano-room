
import Image from "next/image";
import Link from "next/link";

export default function SignupHeader(
    { stepNum, navLink, navName, stepName, title, totalSteps, onClickNav=null }:
    { stepNum: number, navLink: string, title: string, navName: string, stepName: string, totalSteps: number, onClickNav?: any }) {
  return (
    <>
        <Link onClick={onClickNav} href={navLink} className="text-primary-yellow text-xl 3xl:text-3xl font-bold flex relative w-[15%] mb-5">
            <Image src="/YellowBackIcon.svg" width={30} height={30} alt=""/>
            <p className="mt-2">{navName}</p>
        </Link>
        <h1 className="text-7xl 3xl:text-8xl font-bold leading-tight font-montserrat tracking-tight text-white mb-5">
        {title}
        </h1>
        <div className='mb-5 2xl:mt-5 2xl:mb-[20px]'>
            <p className='text-white text-lg 3xl:text-2xl 3xl:mb-4 font-semibold'>Step {stepNum} of {totalSteps}</p>
            <p className='text-primary-yellow text-2xl 3xl:text-4xl font-semibold'>{stepName}</p>
        </div>
    </>
  )
}

