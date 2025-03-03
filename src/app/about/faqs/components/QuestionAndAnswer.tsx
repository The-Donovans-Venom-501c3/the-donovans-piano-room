import Image from "next/image";
import React from "react";

export default function QuestionAndAnswer({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group mb-7 w-full lg:w-[75%]">
      <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
        <span className="flex justify-between">
          <span className="text-[18px] font-bold text-primary-purple">
            {question}
          </span>
        </span>
        <Image
          className="h-5 w-5 text-gray-500 transition group-open:rotate-180"
          src="/about/FAQs/DropdownIcon.svg"
          width={18}
          height={18}
          alt=""
        />
      </summary>

      <article className="px-2 pb-4 text-[15px]">{children}</article>
    </details>
  );
}
