"use client";

import TermsOfUseContent from "./TermsOfUseContent";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import CloseIcon from "@mui/icons-material/Close";

interface TermsandConditionProps {
  isOpen: boolean;
  onClose: () => void;
  content: "terms" | "privacy";
}

const TermsandCondition = ({
  isOpen,
  onClose,
  content,
}: TermsandConditionProps) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (content) {
      case "terms":
        return <TermsOfUseContent />;
      case "privacy":
        return <PrivacyPolicyContent />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-primary-purple hover:opacity-80 transition-opacity p-1"
        >
          <CloseIcon className="text-3xl font-bold" />
        </button>

        <div className="mt-4 max-h-[70vh] overflow-y-auto text-black pr-2">
          <div className="text-base md:text-lg">{getContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TermsandCondition;