"use client";

import InputForm from "@/components/atoms/form-input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// --- Inline Info Icon ---
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 6a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0V8zm-1.5 3.75a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PublicContactUsForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const res = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, message }),
      });
      const data = await res.json();
      if (data.status === 400) {
        setError(data.error);
        return;
      }
      if (res.ok) {
        setFullName("");
        setEmail("");
        setMessage("");
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError("");
    setFullName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      {/* Header */}
      <div className="mb-8 max-w-[600px] text-white">
        <h2 className="mb-3 text-5xl font-extrabold tracking-tight md:text-6xl">
          Get in touch
        </h2>
        <p className="text-base font-normal leading-relaxed text-white/90 md:text-lg">
          Have any questions, concerns, or need assistance? Fill out the form
          below and one of our representatives will reach out to you in a timely
          manner.
        </p>
      </div>

      {error && <p className="mb-4 text-lg text-red-300">{error}</p>}

      {/* Main Two-Column Layout */}
      <div className="flex w-full flex-col items-start justify-start gap-8 md:flex-row">
        {/* LEFT COLUMN: Form or Submission Confirmation */}
        <div className="w-full flex-1 md:max-w-[560px]">
          {submitted ? (
            /* SUBMITTED STATE */
            <div className="flex flex-col space-y-4">
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-[#FFFDEE] px-8 py-10 text-center text-black shadow-sm">
                <h3 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
                  Thank you for your submission!
                </h3>
                <p className="mb-2 text-base font-medium text-gray-800 md:text-lg">
                  A member from our team will get back to you soon.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-full bg-[#521C75] py-3.5 text-center text-lg font-bold text-white transition hover:bg-[#431562]"
              >
                Add Another Submission
              </button>
            </div>
          ) : (
            /* DEFAULT FORM STATE */
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <InputForm
                  field={{ type: "text", name: "fullName", label: "Name" }}
                  onChange={(e: any) => setFullName(e.target.value)}
                  text={fullName}
                  error=""
                />
                <InputForm
                  field={{ type: "email", name: "email", label: "Email" }}
                  onChange={(e: any) => setEmail(e.target.value)}
                  text={email}
                  error=""
                />
                <InputForm
                  field={{
                    type: "textarea",
                    name: "Message",
                    label: "Comment or message",
                  }}
                  onChange={(e: any) => setMessage(e.target.value)}
                  text={message}
                  error=""
                  numRows={5}
                />
              </div>

              <button
                className="w-full rounded-full bg-[#521C75] py-3.5 text-center text-lg font-bold text-white transition hover:bg-[#431562]"
                type="submit"
              >
                Submit
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Contact Info Card */}
        <div className="flex w-full flex-col justify-between rounded-2xl bg-[#5B1A83] p-8 text-white shadow-xl md:w-[460px]">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5B1A83]">
                <InfoIcon />
              </div>
              <h3 className="text-3xl font-extrabold text-[#F0D454]">
                Contact info
              </h3>
            </div>

            {/* Information Sections */}
            <div className="mt-6 space-y-5 tracking-wider">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                  SEND YOUR LETTERS OR DONATIONS TO
                </p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  P.O. Box 452 Redan Georgia 30074
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                  CALL US AT
                </p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  +1 678.369.3748
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                  EMAIL US AT
                </p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  contact@thedonovan.org
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              FOLLOW US ON OUR SOCIAL MEDIA
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Link
                href="https://www.instagram.com/tdv501c3"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center transition hover:opacity-80"
              >
                <Image
                  src="/footer/Instagram.svg"
                  width={32}
                  height={32}
                  alt="Instagram"
                  className="h-8 w-8 object-contain"
                />
              </Link>
              <Link
                href="https://www.facebook.com/TheDonovansVenomINC/"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center transition hover:opacity-80"
              >
                <Image
                  src="/footer/Facebook.svg"
                  width={40}
                  height={40}
                  alt="Facebook"
                  className="h-10 w-10 object-contain"
                />
              </Link>
              <Link
                href="https://www.youtube.com/@TDV501C3"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center transition hover:opacity-80"
              >
                <Image
                  src="/footer/Youtube.svg"
                  width={40}
                  height={40}
                  alt="YouTube"
                  className="h-10 w-10 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}