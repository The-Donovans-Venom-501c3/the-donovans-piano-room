"use client";
import { ButtonConfig, PopupType, POPUP_CONFIG } from "../config";

interface PopupProps {
  isOpen: boolean;
  type: PopupType;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export default function Popup({ isOpen, type, primaryButton, secondaryButton }: PopupProps) {
  if (!isOpen) return null;

  const config = POPUP_CONFIG[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-[#FFF2E5] rounded-2xl p-8 max-w-3xl shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-black mb-6">
          {config.title}
        </h2>
        
        {/* Content */}
        <div className="space-y-4 mb-8">
          {config.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-xl text-black">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={primaryButton?.onClick}
            disabled={primaryButton?.disabled || primaryButton?.loading}
            className={primaryButton?.style || `flex-1 text-white px-6 py-3 rounded-full font-medium transition-colors ${config.primaryButtonStyle}`}
          >
            {primaryButton?.loading 
              ? (primaryButton.loadingText || 'Loading...') 
              : (primaryButton?.text || config.primaryButton)
            }
          </button>
          <button
            onClick={secondaryButton?.onClick}
            disabled={secondaryButton?.disabled || secondaryButton?.loading}
            className={secondaryButton?.style || `flex-1 px-6 py-3 rounded-full font-medium transition-colors ${config.secondaryButtonStyle}`}
          >
            {secondaryButton?.loading 
              ? (secondaryButton.loadingText || 'Loading...') 
              : (secondaryButton?.text || config.secondaryButton)
            }
          </button>
        </div>
      </div>
    </div>
  );
}
