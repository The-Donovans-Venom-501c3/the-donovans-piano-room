import "./HelpCenter.scss";

const infoIcon = "/games/infoIcon.svg";
const closeIcon = "/games/purpleX.svg";

export default function HelpCenter() {
  return (
    <aside
      className="help-center font-roboto"
      aria-labelledby="help-center-heading"
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
      >
        <img src={closeIcon} alt="" className="close-btn-icon" />
      </button>
      <h3 className="help-center-subheading">
        Average score
      </h3>
      <p className="help-center-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </aside>
  );
}
