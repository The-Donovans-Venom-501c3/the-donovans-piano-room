import InputForm from "@/components/atoms/form-input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { set } from "zod";

export default function Contact() {
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" h-full w-full max-md2:mt-28 max-md2:mb-24">
      <div>
        {submitted && (
          <div className="my-8">
            <div className="flex items-center rounded-md bg-secondary-yellow p-3 shadow-md">
              <Image
                src="/about/membership/Icon-include.svg"
                width={20}
                height={20}
                alt="Info"
              />
              <p className="ml-3">
                <strong>Thanks for submitting: </strong>We will get back to you
                soon.
              </p>
              <button className="ml-auto" onClick={() => setSubmitted(false)}>
                <Image src="/Close.svg" width={20} height={20} alt="Close" />
              </button>
            </div>
          </div>
        )}
        {error && <p>{error}</p>}
      </div>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 mb-8 flex flex-col items-start">
        <h2 className="mb-8 text-6xl font-semibold">Get in touch</h2>
        <p className="md:w-1/2 text-xl">
          Have any questions, concerns, or need assistance? Fill out the form
          below and one of our representatives will reach out to you in a timely
          manner.
        </p>
      </div>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 flex flex-col items-start justify-between md:flex-row">
        <div className="mb-10 w-full md:mb-0 md:mr-10 md:w-1/2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputForm
              field={{
                type: "text",
                name: "fullName",
                label: "Name",
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
            <InputForm
              field={{
                type: "textarea",
                name: "Message",
                label: "Comment or message",
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
        </div>
        <div className="w-full rounded-2xl bg-yellow-500 text-primary-brown md:w-1/3">
          <div className="p-5 font-medium">
            <div className="mb-5 flex">
              <Image src="/Info.svg" width={25} height={100} alt="Info" />
              <h3 className="ml-4 text-4xl font-semibold">Contact info</h3>
            </div>
            <hr className="mb-5 h-1 border-primary-brown" />
            <p className="text-lg">SEND YOUR LETTERS OR DONATIONS TO</p>
            <p className="mb-4 text-lg">P.O. Box 452 Redan Georgia 30074</p>
            <p className="text-lg">CALL US TO</p>
            <p className="mb-4 text-lg">+1 678.369.3748</p>
            <p className="text-lg">EMAIL US AT:</p>
            <p className="mb-5 text-lg">info@theDonovan.org</p>
            <hr className="mb-5 h-1 border-primary-brown" />
            <p className="text-lg">FOLLOW US ON OUR SOCIAL MEDIA</p>
            <div className="mt-4 flex space-x-3">
              <Link
                href="https://twitter.com/IamTheDonovan"
                target="_blank"
                className="w-15 h-15 flex items-center justify-center rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Twitter.svg"
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </Link>
              <Link
                href="https://www.facebook.com/TheDonovansVenomINC/"
                target="_blank"
                className="w-15 h-15 flex items-center justify-center rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Facebook.svg"
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </Link>
              <a
                href="https://www.youtube.com/@thedonovansvenom2848"
                target="_blank"
                className="w-15 h-15 flex items-center justify-center rounded-full text-white transition duration-300 hover:bg-purple-800"
              >
                <Image
                  src="/footer/Youtube.svg"
                  width={40}
                  height={40}
                  alt="Twitter"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
