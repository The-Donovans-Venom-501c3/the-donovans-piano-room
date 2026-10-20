import "./InfoButton.scss";

const infoIcon = "/games/infoIcon.svg";

interface InfoButtonProps {
  label: string;
}

export default function InfoButton({ label }: InfoButtonProps) {
  return (
    <button
      type="button"
      className="info-button"
      aria-label={label}>
      <img src={infoIcon} alt="" className="info-icon" />
    </button>
  );
}
