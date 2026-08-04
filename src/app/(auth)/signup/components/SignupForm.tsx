"use client";

import PasswordCases from "@/components/auth/PasswordCases";
import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import SignupHeader from "./SignupHeader";
import { useSetAtom } from "jotai";
import { signupStepAtom, profileAtom } from "@/utils/stores";
import TermsandCondition from "./TermsandCondition";
import Checkbox from "@/components/atoms/Checkbox";
import { signup } from "@/lib/api/authService";
import { profileInterface } from "@/interfaces/profileInterface";
import Button1 from "@/components/atoms/Button1";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allPasswordCasesCorrect, setAllPasswordCasesCorrect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [modalContent, setModalContent] = useState<"terms" | "privacy">("terms");

  const [isAckChecked, setIsAckChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (type: "terms" | "privacy") => {
    setModalContent(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const setSignupStep = useSetAtom(signupStepAtom);
  const setProfileAtom = useSetAtom(profileAtom);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setDisabled(true);

    if (process.env.NEXT_PUBLIC_RESTRICT_TO_ORG_DOMAIN === "true") {
      if (!email.trim().toLowerCase().endsWith("@thedonovan.org")) {
        setError("Please use your thedonovan.org email!");
        setDisabled(false);
        return;
      }
    }

    const { data, ok } = await signup(fullName, email, password);
    if (ok) {
      // ✅ Handle null state when initializing profileAtom during signup
      setProfileAtom((obj: profileInterface | null) => ({
        ...(obj || {}),
        fullName: fullName,
        email: email,
      } as profileInterface));
      
      setSignupStep((prev) => prev + 1);
    } else {
      console.log("Failed");
      alert(`Error: ${data?.message || "Something went wrong"}`);
      setDisabled(false);
    }
  };

  useEffect(() => {
    const isFormValid =
      isAckChecked &&
      isTermsChecked &&
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      allPasswordCasesCorrect &&
      password === confirmPassword;

    setDisabled(!isFormValid);
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    allPasswordCasesCorrect,
    isAckChecked,
    isTermsChecked,
  ]);

  return (
    <div className="w-[24vw] min-w-[340px] max-w-[440px] 3xl:w-[26vw] mx-auto flex flex-col justify-center text-left">
      <SignupHeader
        navName="Home"
        navLink="/"
        stepNum={1}
        totalSteps={5}
        stepName="Create your account"
      />

      <p className="text-white text-base md:text-lg font-medium mb-4 mt-1">
        Fields marked * are required.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" autoComplete="off">
        <InputForm
          field={{
            type: "text",
            name: "fullName",
            label: "Full name *",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFullName(e.target.value)}
          text={fullName}
          error={""}
        />

        <InputForm
          field={{
            type: "email",
            name: "email",
            label: "Email *",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setEmail(e.target.value);
            setError(null);
          }}
          text={email}
          error={error || ""}
        />

        <PasswordInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          name="password"
          label="Password *"
          inputValue={password}
          error={
            allPasswordCasesCorrect &&
            confirmPassword.length > 0 &&
            password !== confirmPassword
              ? "The password you entered does not match"
              : ""
          }
        />

        <PasswordCases
          password={password}
          testCasesCB={setAllPasswordCasesCorrect}
          allCasesIsCorrect={allPasswordCasesCorrect}
        />

        {(allPasswordCasesCorrect || !password) && (
          <PasswordInput
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            name="confirm password"
            label="Confirm password *"
            inputValue={confirmPassword}
            error={
              allPasswordCasesCorrect &&
              confirmPassword.length > 0 &&
              password !== confirmPassword
                ? "The password you entered does not match"
                : ""
            }
          />
        )}

        {/* Checkbox Group */}
        <div className="flex flex-col gap-3 py-2">
          <Checkbox checked={isAckChecked} onChange={setIsAckChecked}>
            <span className="ms-3 text-base md:text-lg leading-snug text-white font-medium block">
              <span className="text-red-500 font-bold me-1">*</span>
              I acknowledge that all information above is correct, as I will not be able to change my Full Name or Email after creating an account
            </span>
          </Checkbox>

          <Checkbox checked={isTermsChecked} onChange={setIsTermsChecked}>
            <span className="ms-3 text-base md:text-lg leading-snug text-white font-medium block">
              <span className="text-red-500 font-bold me-1">*</span>
              I agree to The Donovan&apos;s piano room{" "}
              <button
                type="button"
                onClick={() => handleOpenModal("terms")}
                className="text-primary-yellow underline font-bold focus:outline-none"
              >
                terms of use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => handleOpenModal("privacy")}
                className="text-primary-yellow underline font-bold focus:outline-none"
              >
                privacy policy
              </button>
              .
            </span>
          </Checkbox>
        </div>

        {/* Action Button */}
        <div className="mt-2 w-full">
          <Button1
            text="Continue to verify account"
            type="submit"
            disabled={disabled}
          />
        </div>
      </form>

      <p className="w-full text-center text-lg md:text-xl text-white py-4 mt-2 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-yellow underline font-semibold">
          Log in
        </Link>
      </p>

      <TermsandCondition
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={modalContent}
      />
    </div>
  );
}