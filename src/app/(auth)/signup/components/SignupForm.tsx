import PasswordCases from "@/components/auth/PasswordCases";
import InputForm from "@/components/atoms/form-input";
import PasswordInput from "@/components/auth/password-input";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignupHeader from "./SignupHeader";
import { useSetAtom } from "jotai";
import { singupStepAtom, profileAtom } from "@/utils/stores";
import Button1 from "@/components/atoms/Button1";
import TermsandCondition from "./TermsandCondition";
import Checkbox from "@/components/atoms/Checkbox";
import { signup } from "@/lib/api/authService";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allPasswordCasesCorrect, setAllPasswordCasesCorrect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDiabled] = useState(true);
  const [modalContent, setModalContent] = useState<"terms" | "privacy">(
    "terms",
  );
  const [isChecked, setIsChecked] = useState(false);

  const handleOpenModal = (type: "terms" | "privacy") => {
    setModalContent(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const setSingupStep = useSetAtom(singupStepAtom);
  const setProfileAtom = useSetAtom(profileAtom);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setDiabled(!disabled);
    const { data, ok } = await signup(fullName, email, password);
    if (ok) {
      setProfileAtom((obj) => ({
        ...obj,
        fullName: fullName,
        email: email,
<<<<<<< HEAD
      }));
      setSingupStep((prev) => prev + 1);
    } else {
      console.log("Failed");
      alert(`Error: ${data}`);
=======
      }))
      setSingupStep(prev => prev + 1);
    } 
    else{
      console.log("Failed")
      alert(`Error: ${data.message}`)
>>>>>>> b6c4057d7611edde87c84fc643dbada0c603d067
    }
    setDiabled(!disabled);
  };

  useEffect(() => {
    const isFormValid =
      isChecked &&
      fullName &&
      email &&
      password &&
      confirmPassword &&
      allPasswordCasesCorrect &&
      password === confirmPassword;

    setDiabled(!isFormValid);
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    allPasswordCasesCorrect,
    isChecked,
  ]);

  return (
    <section className="w-[24vw] 3xl:w-[26vw]">
      <SignupHeader
        navName="Home"
        navLink="/"
        stepNum={1}
        stepName="Create your account"
      />
      <form className="space-y-4 md:space-y-6">
        <InputForm
          field={{
            type: "text",
            name: "fullName",
            label: "Full name",
          }}
          onChange={(e: any) => setFullName(e.target.value)}
          text={fullName}
          error={""}
        />

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
          error={
            allPasswordCasesCorrect &&
            confirmPassword.length &&
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
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            name="confirm password"
            label="Confirm password"
            error={
              allPasswordCasesCorrect &&
              confirmPassword.length &&
              password !== confirmPassword
                ? "The password you entered does not match"
                : ""
            }
            inputValue={confirmPassword}
          />
        )}
        <div>
          <Button1
            onClick={handleSubmit}
            disabled={disabled}
            text="Continue to verify account"
          />
        </div>
        <Checkbox checked={isChecked} onChange={setIsChecked}>
          <label
            htmlFor="check"
            className="text-l ms-2 mt-4 font-medium text-white 2xl:mt-6 2xl:text-2xl 4xl:mt-2"
          >
            I agree to The Donovan&apos;s piano room{" "}
            <span
              onClick={() => handleOpenModal("terms")}
              className="cursor-pointer text-primary-yellow underline"
            >
              terms of use
            </span>{" "}
            and{" "}
            <span
              onClick={() => handleOpenModal("privacy")}
              className="cursor-pointer text-primary-yellow underline"
            >
              privacy policy
            </span>
            .
          </label>
        </Checkbox>
      </form>
      <p className="2xl:rounded-4xl mt-9 mt-[10px] w-full rounded-3xl  bg-primary-purple py-3 text-center text-[12px] text-lg text-white 2xl:py-5 3xl:py-8 3xl:text-2xl">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-yellow underline">
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
