import { useEffect, useRef } from "react";
import "./HelpCenter.scss";

const infoIcon = "/games/brownInfoIcon.svg";
const closeIcon = "/games/purpleX.svg";

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  return (
    <aside
      ref={panelRef}
      id="help-center"
      tabIndex={-1}
      className={`help-center font-roboto ${isOpen ? "is-open" : ""}`}
      aria-labelledby="help-center-heading"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <h2
        className="help-center-heading"
        id="help-center-heading"
      >
        <img src={infoIcon} alt="" className="info-icon" />
        <span>Help Center</span>
      </h2>
      <button
        type="button"
        className="close-btn"
        aria-label="Close help center"
        onClick={onClose}
      >
        <img src={closeIcon} alt="" className="close-btn-icon" />
      </button>
      <div className="help-center-body">
        <h3 className="help-center-subheading">
          Average score
        </h3>
        <p className="help-center-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="help-center-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </aside>
  );
}
