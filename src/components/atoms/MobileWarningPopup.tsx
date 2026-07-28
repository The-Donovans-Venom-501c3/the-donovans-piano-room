"use client";

import { useEffect, useState } from "react";

export default function MobileWarningPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prevent repeating popup in the same session
    const hasDismissed = sessionStorage.getItem("mobile_warning_dismissed");
    if (hasDismissed) return;

    const checkDevice = () => {
      const isMobileOrTablet =
        window.innerWidth < 1024 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobileOrTablet) {
        setIsOpen(true);
      }
    };

    checkDevice();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("mobile_warning_dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#FFF8EE] p-8 text-center shadow-xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo Badge */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#2D1540] text-3xl font-bold text-white shadow-md">
          T
        </div>

        {/* Header - Changed text-xl to text-2xl */}
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Welcome to The Donovan’s Piano Room
        </h2>

        {/* Subtitle - Changed text-sm to text-base */}
        <p className="mb-4 text-base font-semibold text-gray-700">
          We’re so glad you’re here to unlock the joy of music!
        </p>

        {/* Description Body - Changed text-xs to text-sm */}
        <div className="mb-6 space-y-3 text-sm leading-relaxed text-gray-600">
          <p>
            We noticed you are viewing our site via a mobile or tablet view. To
            get the best experience out of our site, please switch to a desktop.
          </p>
          <p>
            In continuing using mobile or tablet view, you will experience a
            limited site.
          </p>
        </div>

        {/* Dismiss Button - Changed text-sm to text-base */}
        <button
          onClick={handleDismiss}
          className="w-full max-w-xs rounded-full bg-[#7029A8] py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#5b208a] active:scale-95"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}