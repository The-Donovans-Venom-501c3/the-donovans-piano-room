"use client";

import PasswordCases from "@/components/auth/PasswordCases";
import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import SignupHeader from "./SignupHeader";
import { useSetAtom } from "jotai";
import { signupStepAtom, profileAtom } from "@/utils/stores";
import Button1 from "@/components/atoms/Button1";
import TermsandCondition from "./TermsandCondition";
import Checkbox from "@/components/atoms/Checkbox";
import { signup } from "@/lib/api/authService";
import { profileInterface } from "@/interfaces/profileInterface";

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
      setProfileAtom((obj: profileInterface) => ({
        ...obj,
        fullName: fullName,
        email: email,
      }));
      setSignupStep((prev) => prev + 1);
    } else {
      console.log("Failed");
      alert(`Error: ${data.message}`);
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
    <section className="w-full max-w-[420px] mx-auto py-6 flex flex-col justify-center">
      <SignupHeader
        navName="Home"
        navLink="/"
        stepNum={1}
        totalSteps={5}
        stepName="Create your account"
      />
      
      <p className="text-[11px] md:text-xs text-white/80 mb-3 mt-1">
        Fields marked * are required.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <InputForm
          field={{
            type: "text",
            name: "fullName",
            label: "Full name *",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
          text={fullName}
          error={""}
        />

        <InputForm
          field={{
            type: "email",
            name: "email",
            label: "Email *",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
          error={
            allPasswordCasesCorrect &&
            confirmPassword.length > 0 &&
            password !== confirmPassword
              ? "The password you entered does not match"
              : ""
          }
          inputValue={password}
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
            error={
              allPasswordCasesCorrect &&
              confirmPassword.length > 0 &&
              password !== confirmPassword
                ? "The password you entered does not match"
                : ""
            }
            inputValue={confirmPassword}
          />
        )}

        {/* Checkbox Group */}
        <div className="space-y-2.5 pt-2">
          <Checkbox checked={isAckChecked} onChange={setIsAckChecked}>
            <span className="ms-2.5 text-[11px] leading-tight font-medium text-white block">
              I acknowledge that all information above is correct, as I will not be able to change my Full Name or Email after creating an account
            </span>
          </Checkbox>

          <Checkbox checked={isTermsChecked} onChange={setIsTermsChecked}>
            <span className="ms-2.5 text-[11px] leading-tight font-medium text-white block">
              I agree to The Donovan&apos;s piano room{" "}
              <button
                type="button"
                onClick={() => handleOpenModal("terms")}
                className="text-primary-yellow underline font-semibold focus:outline-none"
              >
                terms of use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => handleOpenModal("privacy")}
                className="text-primary-yellow underline font-semibold focus:outline-none"
              >
                privacy policy
              </button>
              .
            </span>
          </Checkbox>
        </div>

        <div className="pt-3">
          <Button1
            type="submit"
            disabled={disabled}
            text="Continue to verify account"
          />
        </div>
      </form>

      <p className="mt-5 text-center text-xs md:text-sm text-white">
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
    </section>
  );
}