"use client";
import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button1 from "@/components/atoms/Button1";
import { login } from "@/lib/api/authService";
import { getUser } from "@/lib/api/userService";
import { useSetAtom } from "jotai";
import { profileAtom } from "@/utils/stores";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const setProfile = useSetAtom(profileAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDiabled] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data");
      const { data, ok } = await getUser();
      if (ok) {
        setProfile(data);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, ok } = await login(email, password);
    console.log(ok);
    if (ok) {
      if (await fetchUserData()) {
        router.push("/dashboard");
      } else {
        alert(`Error: Cannot get Profile information`);
      }
    } else {
      alert(`Error: ${data.message}`);
    }
  };
  useEffect(() => {
    setDiabled(!(email && password));
  }, [email, password]);

  return (
    <div className="w-[24vw] 3xl:w-[26vw]">
      <Link
        href="/"
        className="relative mb-5 flex w-[15%] text-xl font-bold text-primary-yellow"
      >
        <Image src="/YellowBackIcon.svg" width={30} height={30} alt="" />
        <p className="mt-2">Home</p>
      </Link>
      <h1 className="mb-5 font-montserrat text-7xl font-bold leading-tight tracking-tight text-white">
        Log In
      </h1>
      <div className="mb-5 2xl:mb-[20px] 2xl:mt-5">
        <p className="text-xl text-white">
          Log in with your The Donovan&apos;s piano room account.
        </p>
      </div>
      <form className="flex flex-col gap-4">
        <InputForm
          field={{
            type: "email",
            name: "email",
            label: "Email",
          }}
          onChange={(e: any) => setEmail(e.target.value)}
          text={email}
          error={""}
        />
        <PasswordInput
          onChange={(e: any) => setPassword(e.target.value)}
          name="password"
          label="Password"
          error={""}
          inputValue={password}
        />
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="check"
            >
              <input
                type="checkbox"
                className="before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-md border bg-[#fef8ee] transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:border-[#391f0f] before:opacity-0 before:transition-opacity checked:border-primary-yellow checked:bg-primary-yellow hover:before:opacity-10 4xl:h-8 4xl:w-8"
                id="check"
              />
              <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-primary-purple opacity-0 transition-opacity peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 4xl:h-7 4xl:w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            <label className="mt-1 text-lg font-medium text-white 2xl:mt-2 3xl:text-2xl 4xl:text-[16px]">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="mt-3 text-lg font-medium text-primary-yellow 2xl:mt-4 3xl:text-2xl 4xl:text-[16px]"
          >
            Forgot password?
          </Link>
        </div>
        <div>
          <Button1
            text="Log In"
            type="button"
            disabled={disabled}
            onClick={handleLogin}
          />
        </div>
      </form>
      <p className="mt-9 mt-[10px] w-full rounded-3xl bg-primary-purple py-3 text-center text-[12px] text-lg text-white 2xl:rounded-full 2xl:py-5 3xl:py-8 3xl:text-2xl 4xl:text-[16px]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary-yellow underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
