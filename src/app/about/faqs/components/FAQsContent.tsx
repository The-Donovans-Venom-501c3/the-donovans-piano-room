"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import QuestionAndAnswer from "./QuestionAndAnswer";
import "./FAQsContent.css";

const faqsList: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Are you a 501(c)(3) organization?",
    answer: (
      <>
        <br />
        <p>
          Yes! The Donovan&apos;s Venom, INC. 501(c)(3) was established in 2014 and
          became a 501(c)(3) organization in 2020.
        </p>
        <br />
        <p>Our Employer Identification Number (EIN) is 27-3996051.</p>
      </>
    ),
  },
  {
    question: "What is Beta Mode?",
    answer: (
      <>
        <br />
        <p>
          Beta Mode means you’re getting early access to The Donovan’s Piano Room while we continue building and improving the experience. You may notice new features, updates, or changes along the way. Your feedback helps us make the Piano Room experience better.
        </p>
      </>
    ),
  },
  {
    question: "How can I receive free music lessons?",
    answer: (
      <>
        <br />
        <p>
          All qualifying and permitted applicants are eligible to receive
          scholarships for music lessons. You can apply for a scholarship by
          filling out our{" "}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSczYBC5tnRZcjjTBN4J4BXEDxO-8NuM1ZuNlfR4z9heXk3T6w/viewform"
            className="text-primary-blue underline"
          >
            intake form
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    question:
      "Are there income requirements to receive services and scholarships from The Donovan's Venom?",
    answer: (
      <>
        <br />
        <p>
          Families and participants who meet the Federal Poverty Level (FPL)
          qualify for our full scholarships and services. Please refer to the
          chart below.
        </p>
        <br />
        <table className="w-full text-left">
          <thead className="bg-[#FCF0D8]">
            <tr>
              <th className="px-2 py-5 font-semibold">Family size</th>
              <th className="font-semibold">2021 income number</th>
              <th className="font-semibold">2022 income number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BDB4A2]">
            <tr>
              <td className="px-2 py-5">For individuals</td>
              <td>$12,880</td>
              <td>$13,590</td>
            </tr>
            <tr>
              <td className="px-2 py-5">For a family of 2</td>
              <td>$17,420</td>
              <td>$18,310</td>
            </tr>
            <tr>
              <td className="px-2 py-5">For a family of 3</td>
              <td>$21,960</td>
              <td>$23,030</td>
            </tr>
            <tr>
              <td className="border-b border-[#BDB4A2] px-2 py-5">
                For a family of 4
              </td>
              <td className="border-b border-[#BDB4A2]">$26,500</td>
              <td className="border-b border-[#BDB4A2]">$27,750</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    question:
      "Are there age restrictions or requirements to receive services and scholarships from The Donovan's Venom?",
    answer: (
      <>
        <br />
        <p>
          The Donovan&apos;s Venom, INC. 501(c)(3) services our community with
          vigor. Our primary focus is to service underserved and underprivileged
          youth aged 21 and below. We also would like to focus on the
          often-forgotten seniors aged 60 and older who are within the
          parameters of the Federal Poverty Line (FPL).
        </p>
      </>
    ),
  },
  {
    question: "What if I make more money than the listed requirement?",
    answer: (
      <>
        <br />
        <p>
          We want to service our entire community. Thank goodness you are
          fortunate enough to have access beyond the Federal Poverty Line. We
          are still able to service you, and you still may be eligible for a
          scholarship provided by our organization for services and music
          education. Please{" "}
          <Link href="/contact-us" className="text-primary-blue underline">
            contact us
          </Link>{" "}
          for more information.
        </p>
      </>
    ),
  },
  {
    question: "Are there fees for the music lessons?",
    answer: (
      <>
        <br />
        <p>
          Families and participants who meet the Federal Poverty Level (FPL)
          requirement will qualify for our full scholarships and services. There
          will be NO FEES for such participants.
        </p>
      </>
    ),
  },
  {
    question: "What things can I learn if I participate?",
    answer: (
      <>
        <br />
        <p>All students can choose to take classes in the following:</p>
        <br />
        <ul className="ml-10 list-disc">
          <li>Piano</li>
          <li>Guitar</li>
          <li>Vocals</li>
          <li>Sight reading</li>
          <li>Music theory</li>
        </ul>
      </>
    ),
  },
  {
    question: "How are the classes taught?",
    answer: (
      <>
        <br />
        <p>
          The classes are taught in a group setting. Individual lessons may be
          available, depending on the availability of our staff.
        </p>
        <br />
        <p>
          We give both in-person and virtual classes based on the location of
          each student.
        </p>
      </>
    ),
  },
  {
    question: "Can I donate to your organization?",
    answer: (
      <>
        <br />
        <p>
          Thank you for your generosity! We currently accept donations via our{" "}
          <Link
            href="https://www.paypal.com/donate/?hosted_button_id=3HAXBG4AGR83Y"
            className="text-primary-blue underline"
          >
            Paypal page
          </Link>
          . Paypal will ensure that your sensitive information is protected. On
          the payment page, you can choose the area to which you would like your
          money to go.
        </p>
        <br />
        <p>
          If you wish to donate via another method, please{" "}
          <Link href="/contact-us" className="text-primary-blue underline">
            contact us
          </Link>{" "}
          to arrange your donation.
        </p>
      </>
    ),
  },
  {
    question: "Can I become a sponsor?",
    answer: (
      <>
        <br />
        <p>
          Yes! We welcome sponsors at many of our events. Please{" "}
          <Link href="/contact-us" className="text-primary-blue underline">
            contact us
          </Link>{" "}
          to discuss more about working with our organization.
        </p>
      </>
    ),
  },
  {
    question: "How can I volunteer?",
    answer: (
      <div>
        <br />
        <p>
          Thank you so much for your interest in volunteering! As a nonprofit
          organization, we wouldn&apos;t be able to serve the community without
          your help.
        </p>
        <br />
        <p>
          You can find open volunteer positions on our{" "}
          <Link
            href="https://www.volunteermatch.org/search/org1183807.jsp"
            className="text-primary-blue underline"
          >
            VolunteerMatch page
          </Link>
          . If there is a position that fits your area of interest, please let
          us know. We would love to talk with you!
        </p>
      </div>
    ),
  },
  {
    question: "Can I receive community service hours as a volunteer?",
    answer: (
      <>
        <br />
        <p>
          Yes! The Donovan&apos;s Venom will happily accommodate, moderate, and
          satisfy community service hours if you need them.
        </p>
      </>
    ),
  },
];

export default function FAQsContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-auto">
      <div className="h-[82%] w-[90%]">
        <h4 className="text-center font-montserrat text-6xl font-semibold text-secondary-brown 3xl:text-7xl 4xl:text-8xl">
          Your questions, answered.
        </h4>
        <div className="mt-6 flex flex-col justify-between w-full lg:flex-row">
          <div className="w-full select-none">
            {faqsList.map((item, i) => (
              <QuestionAndAnswer question={item.question} key={i}>
                {item.answer}
              </QuestionAndAnswer>
            ))}
          </div>
          <div>
            <div className="w-[240px] rounded-2xl bg-[#FCF0D8] p-7 justify-items-center">
              <div className="flex justify-center w-full">
                <Image
                  className="mb-4"
                  src="/about/FAQs/CatImage.svg"
                  alt=""
                  width={90}
                  height={90}
                />
              </div>
              <p className="mb-4 text-[14px] font-semibold text-gray-800">
                Still got questions? Reach out!
              </p>
              <div className="flex justify-center w-full">
                <Link
                  className="button rounded-3xl bg-[#6F219E] px-14 py-2 text-[15px] font-semibold text-white"
                  href="/contact-us"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}