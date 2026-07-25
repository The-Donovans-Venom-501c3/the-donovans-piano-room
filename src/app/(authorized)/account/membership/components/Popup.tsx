"use client";
import { ButtonConfig, PopupType, POPUP_CONFIG } from "../config";

interface PopupProps {
  isOpen: boolean;
  type: PopupType;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  // Custom dynamic content override (useful for rendering custom Beta notices)
  customTitle?: string;
  customContent?: string;
}

export default function Popup({
  isOpen,
  type,
  primaryButton,
  secondaryButton,
  customTitle,
  customContent,
}: PopupProps) {
  if (!isOpen) return null;

  const config = POPUP_CONFIG[type] || {};

  const title = customTitle || config.title;
  const content = customContent || config.content || "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-[#FFF2E5] rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-lg">
        {/* Title */}
        {title && (
          <h2 className="text-3xl font-bold text-black mb-6">
            {title}
          </h2>
        )}
        
        {/* Content */}
        {content && (
          <div className="space-y-4 mb-8">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-xl text-black">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {primaryButton && (
            <button
              type="button"
              onClick={primaryButton.onClick}
              disabled={primaryButton.disabled || primaryButton.loading}
              className={
                primaryButton.style ||
                `flex-1 text-white px-6 py-3 rounded-full font-medium transition-colors ${
                  config.primaryButtonStyle || "bg-primary-purple hover:bg-purple-700"
                }`
              }
            >
              {primaryButton.loading 
                ? (primaryButton.loadingText || 'Loading...') 
                : (primaryButton.text || config.primaryButton)
              }
            </button>
          )}

          {secondaryButton && (
            <button
              type="button"
              onClick={secondaryButton.onClick}
              disabled={secondaryButton.disabled || secondaryButton.loading}
              className={
                secondaryButton.style ||
                `flex-1 px-6 py-3 rounded-full font-medium transition-colors ${
                  config.secondaryButtonStyle || "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {secondaryButton.loading 
                ? (secondaryButton.loadingText || 'Loading...') 
                : (secondaryButton.text || config.secondaryButton)
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}