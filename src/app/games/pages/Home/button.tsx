import React, { useState } from "react";
import "./Button.scss";

const arrowIcon = "/games/gameDashboardArrow.svg";

export interface ButtonProps {
  icon: string;
  hoverIcon?: string;
  title: string;
  tips: string;
  hoverColor?: string;
  hoverBorderColor?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  hoverIcon,
  title,
  tips,
  onClick,
}) => {
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <button
      className="HomeButton"
      onClick={onClick}
      onMouseEnter={() => {
        if (hoverIcon) setCurrentIcon(hoverIcon);
      }}
      onMouseLeave={() => {
        setCurrentIcon(icon);
      }}
    >
      <div className="Button-Layout">
        <div className="Img-Layout">
          <img src={currentIcon} id="button-icon" alt={title} />
        </div>

        <div className="Text-Layout">
          <span id="title">{title}</span>
          <span id="tips">{tips}</span>
        </div>

        <img src={arrowIcon} className="arrow-icon" alt="" />
      </div>
    </button>
  );
};

export { Button };