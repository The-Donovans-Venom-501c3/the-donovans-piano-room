import InputForm from "@/components/atoms/form-input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IsNavOpenAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";

export default function Contact() {
  const isNavOpen = useAtomValue(IsNavOpenAtom);
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
    setError("");
  };

  return (
    <div
      className="relative w-[45vw]"
      style={isNavOpen ? { width: "70vw" } : { width: "80vw" }}
    >
      <div className="h-full w-full max-md2:mt-28 max-md2:mb-24">
        {/* Alignment changed from items-end to items-center */}
        <div className="flex flex-col items-center justify-center md:flex-row">
          
          {/* Left Column: Title & (Form OR In-Place Thank You Card) */}
          <div className="mb-10 w-[384px] md:mb-0 md:mr-10">
            <div className="mb-8 flex flex-col items-start text-white">
              <h2 className="mb-8 text-6xl font-semibold">Get in touch</h2>
              <p className="text-xl md:w-full">
                Have any questions, concerns, or need assistance? Fill out the
                form below and one of our representatives will reach out to you in
                a timely manner.
              </p>
            </div>

            {error && <p className="mb-4 text-red-300">{error}</p>}

            {submitted ? (
              /* NEW FLOW: In-Place Confirmation Card */
              <div className="flex flex-col space-y-6">
                <div className="rounded-2xl bg-[#FFF9E6] p-8 text-center text-black shadow-md">
                  <h3 className="mb-4 text-2xl font-bold">
                    Thank you for your submission!
                  </h3>
                  <p className="mb-4 text-base text-gray-700">
                    A member from our team will get back to you soon.
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Expect a confirmation email with your submission details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-3xl bg-[#591C80] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#481668] 2xl:rounded-full 2xl:py-5"
                >
                  Add Another Submission
                </button>
              </div>
            ) : (
              /* Standard Input Form */
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
            )}
          </div>

          {/* Right Column: Contact Info Sidebar */}
          <div className="w-[355px] rounded-2xl bg-[#6F219E] text-white">
            <div className="p-5 font-medium">
              <div className="mb-5 flex">
                <Image src="/Info.svg" width={25} height={100} alt="Info" />
                <h3 className="ml-4 text-4xl font-semibold text-[#F0D454]">
                  Contact info
                </h3>
              </div>
              <hr className="mb-5 h-1 border-[#734920]" />
              <p className="text-lg">SEND YOUR LETTERS OR DONATIONS TO</p>
              <p className="mb-4 text-lg">P.O. Box 452 Redan Georgia 30074</p>
              <p className="text-lg">CALL US TO</p>
              <p className="mb-4 text-lg">+1 678.369.3748</p>
              <p className="text-lg">EMAIL US AT:</p>
              <p className="mb-5 text-lg">info@theDonovan.org</p>
              <hr className="mb-5 h-1 border-[#734920]" />
              <p className="text-lg">FOLLOW US ON OUR SOCIAL MEDIA</p>
              <div className="mt-4 flex space-x-3">
                <Link
                  href="https://twitter.com/IamTheDonovan"
                  target="_blank"
                  className="h-13 w-12 flex items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
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
                  className="h-15 w-15 flex items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
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
                  className="h-15 w-15 flex items-center justify-between rounded-full text-white transition duration-300 hover:bg-purple-800"
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
    </div>
  );
}