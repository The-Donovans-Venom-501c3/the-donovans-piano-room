"use client";

import { useRef } from "react";

interface VerificationCodeInputProps {
  verificationCode: string[];
  setVerificationCode: (code: string[]) => void;
}

export default function VerificationCodeInput({
  verificationCode,
  setVerificationCode,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d?$/.test(value)) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      const newVerificationCode = [...verificationCode];
      if (newVerificationCode[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        newVerificationCode[index] = "";
        setVerificationCode(newVerificationCode);
      }
    }
  };

  return (
    <div className="flex gap-3 sm:gap-4 w-full justify-between my-6">
      {verificationCode.map((code, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          maxLength={1}
          type="text"
          value={code}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-16 h-20 sm:w-20 sm:h-24 text-center text-3xl sm:text-4xl font-extrabold rounded-2xl bg-[#FEF8EE] border-2 border-[#391f0f] text-[#391f0f] outline-none focus:ring-4 focus:ring-yellow-400 focus:bg-white transition-all shadow-md"
        />
      ))}
    </div>
  );
}