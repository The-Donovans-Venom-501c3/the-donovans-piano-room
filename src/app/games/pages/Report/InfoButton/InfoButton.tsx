import "./InfoButton.scss";

const infoIcon = "/games/infoIcon.svg";

interface InfoButtonProps {
  label: string;
  expanded?: boolean;
  controls?: string;
  onClick?: () => void;
}

export default function InfoButton({
  label,
  expanded,
  controls,
  onClick
}: InfoButtonProps) {
  return (
    <button
      type="button"
      className="info-button"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      <img src={infoIcon} alt="" className="info-icon" />
    </button>
  );
}
