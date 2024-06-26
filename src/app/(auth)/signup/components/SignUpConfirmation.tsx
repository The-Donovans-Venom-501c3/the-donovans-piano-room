import Link from "next/link";
import AuthSucceedWrapper from "@/components/auth/AuthSucceedWrapper";

export default function SignupConfirmation() {
    return (
        <AuthSucceedWrapper>
            <>
                <h1 className="text-4xl md:text-8xl 2xl:text-8xl 4xl:text-9xl leading-tight tracking-tight text-white mb-5 font-montserrat">
                    Hurray! You're in
                </h1>
                <div className="mb-5 2xl:mt-5 2xl:mb-[20px]">
                    <p className="text-white text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl">Your access is now active and your account has been created</p>
                    <p className="mt-9 w-full text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl text-white">
                        Didn&apos;t receive the link? <Link href="#" className="text-primary-yellow-accent underline">Resend one</Link>
                    </p>
                </div>
                <p className="w-full text-center bg-primary-yellow-accent py-4 rounded-full text-primary-purple font-bold text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl">
                    <Link href="/login">Log in</Link>
                </p>
            </>
        </AuthSucceedWrapper>
    );
}
