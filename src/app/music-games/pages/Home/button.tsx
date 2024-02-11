import React, { useState } from 'react';
import './Home.scss';

const Button = (props) => {
  const [icon, setIcon] = useState(props.icon);
  const [bgColor, setbgColor] = useState('#FFFFFF');
  const [borderColor, setBorderColor] = useState('#DDDADA');
  return (
    <button
      className='HomeButton'
      onClick={props.onClick}
      onMouseOver={() => {
        setIcon(props.hoverIcon);
        setbgColor(props.hoverColor);
        setBorderColor(props.hoverBorderColor);
      }}
      onMouseOut={() => {
        setIcon(props.icon);
        setbgColor('#FFFFFF');
        setBorderColor('#DDDADA');
      }}
      style={{
        backgroundColor: bgColor,
        border: `3px solid ${borderColor}`,
        WebkitBoxShadow: `2px 4px 1px ${borderColor}`,
        MozBoxShadow: `2px 4px 1px ${borderColor}`,
        boxShadow: `2px 4px 1px ${borderColor}`,
      }}
    >
      <div className='Button-Layout'>
        <div className='Img-Layout'>
          <img src={icon} id='button-icon' />
        </div>

        <div className='Text-Layout'>
          <span id='title'>{props.title}</span>

          <span id='tips'>{props.tips}</span>
        </div>

        {/* {props.children} */}
      </div>
    </button>
  );
};

export { Button };
