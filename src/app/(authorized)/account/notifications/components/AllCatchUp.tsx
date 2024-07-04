import Image from "next/image";

export default function AllCatchUp() {
  return (
    <div className="flex flex-col items-center">
        <div className="relative w-[50vh] h-[40vh]">
            <Image src="/account/notifications/all-catch-up.svg" alt="" fill />
        </div>
        <h1 className="text-6xl 3xl:text-7xl 4xl:text-8xl font-montserrat font-medium">You&apos;re all catch up!</h1>
        <p className="text-xl 3xl:text-2xl 4xl:text-3xl w-[40%] text-center mt-[1%]">Let&apos;s keep exploring! Come back later for more notifications for you! </p>
    </div>
  )
}
