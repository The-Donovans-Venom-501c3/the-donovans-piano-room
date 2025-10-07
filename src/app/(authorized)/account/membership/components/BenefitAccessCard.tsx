"use client";
import Image from "next/image";
import { ButtonConfig } from "../config";

interface BenefitAccessCardProps {
  planName: string;
  headerColor: string;
  textColor: string;
  benefits: string[];
  closeButton?: ButtonConfig;
}

export default function BenefitAccessCard({ planName, headerColor, textColor, benefits, closeButton}: BenefitAccessCardProps) {

  return (
    <div>
      {/* Character with headphones */}
      <div className="flex justify-center mb-4 mt-4">
        <div className="relative">
          <Image
            src="/memberships/upgrade/Group 48096280.svg"
            alt="Character with headphones"
            width={190}
            height={180}
          />
        </div>
      </div>
    
      <div className="w-full rounded-2xl border border-[#FCF0D8] bg-[#fff2e5] shadow-custom">
        {/* Header */}
        <div className="relative rounded-t-xl px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-[#59371D]">{planName}</div>
            <button 
              onClick={closeButton?.onClick}
              disabled={closeButton?.disabled}
              className={closeButton?.style || "text-[#59371D] hover:opacity-75 transition-colors text-3xl font-bold leading-none"}
            >
              {closeButton?.loading 
                ? (closeButton.loadingText || 'Loading...') 
                : (closeButton?.text || '×')
              }
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px w-full bg-[#391F0F]"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black rounded-full mt-3 shrink-0"></div>
                <p className="text-black text-lg leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
