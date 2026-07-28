"use client";
import InputForm from "@/components/atoms/form-input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function ContactUsForm() {
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
        headers: {
          "Content-Type": "application/json",
        },
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
    setFullName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="h-full w-full max-md2:mt-28 max-md2:mb-24">
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}

      <div className="flex flex-col items-center justify-center md:flex-row">
        {/* Left Column: Form OR Thank You Card */}
        <div className="mb-10 w-full md:mb-0 md:mr-10 md:w-1/4">
          <div className="mb-8 flex flex-col items-start text-white">
            <h2 className="mb-8 text-6xl font-semibold">Get in touch</h2>
            <p className="text-xl text-[#D9D9D9] md:w-full">
              Have any questions, concerns, or need assistance? Fill out the
              form below and one of our representatives will reach out to you in
              a timely manner.
            </p>
          </div>

          {submitted ? (
            /* Thank You Card Section */
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full rounded-xl bg-[#FFFDF0] p-6 text-center text-black shadow-lg">
                <h3 className="mb-2 text-xl font-bold">
                  Thank you for your submission!
                </h3>
                <p className="mb-2 text-xs text-gray-700">
                  A member from our team will get back to you soon.
                </p>
                <p className="text-xs text-gray-700">
                  Expect a confirmation email with your submission details.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full rounded-3xl bg-[#521379] py-3 text-center text-[12px] font-semibold text-white shadow-md transition-colors hover:bg-purple-900 2xl:rounded-full 2xl:py-5"
              >
                Add Another Submission
              </button>
            </div>
          ) : (
            /* Contact Form Section */
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputForm
                field={{
                  type: "text",
                  name: "fullName",
                  label: "Name",
                  required: true,
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
                  required: true,
                }}
                onChange={(e: any) => setEmail(e.target.value)}
                text={email}
                error={""}
              />
              <InputForm
                field={{
                  type: "textarea",
                  name: "Message",
                  label: "Comment or message",
                  required: true,
                }}
                onChange={(e: any) => setMessage(e.target.value)}
                text={message}
                error={""}
                numRows={7}
              />
              <div>
                <button
                  className="w-full rounded-3xl bg-primary-purple py-3 text-center text-[12px] font-semibold text-white 2xl:rounded-full 2xl:py-5"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Contact Info Card */}
        <div className="w-full rounded-2xl bg-[#6F219E] text-white md:w-1/5">
          <div className="p-5 font-medium">
            <div className="mb-5 flex">
              <Image src="/Info.svg" width={25} height={100} alt="Info" />
              <h3 className="ml-4 text-4xl font-semibold text-[#F0D454]">
                Contact info
              </h3>
            </div>

            {/* Contact Details */}
            <div className="mt-6 space-y-5 tracking-wider">
              <div>
                <p className="text-sm font-bold text-white/80">
                  SEND YOUR LETTERS OR DONATIONS TO
                </p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  P.O. Box 452 Redan Georgia 30074
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white/80">CALL US AT</p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  +1 678.369.3748
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white/80">EMAIL US AT</p>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  info@theDonovan.org
                </p>
              </div>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-sm font-bold tracking-wider text-white/80">
              FOLLOW US ON OUR SOCIAL MEDIA
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Link
                href="https://twitter.com/IamTheDonovan"
                target="_blank"
                className="flex h-13 w-12 items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Instagram.svg"
                  width={40}
                  height={40}
                  alt="Instagram"
                />
              </Link>
              <Link
                href="https://www.facebook.com/TheDonovansVenomINC/"
                target="_blank"
                className="flex h-15 w-15 items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Facebook.svg"
                  width={40}
                  height={40}
                  alt="Facebook"
                />
              </Link>
              <Link
                href="https://www.youtube.com/@TDV501C3"
                target="_blank"
                className="flex h-15 w-15 items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Youtube.svg"
                  width={40}
                  height={40}
                  alt="YouTube"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}