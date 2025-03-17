import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  borderRadius?: string;
  padding?: string;
  disabled?: boolean;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  disabledBackgroundColor?: string;
  disabledTextColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  width = 'auto',
  height = 'auto',
  backgroundColor = '#F08080',
  textColor = '#000000',
  fontSize = '14px',
  borderRadius = '10px',
  padding = '10px 20px',
  disabled = false,
  hoverBackgroundColor = '#FF6B6B',
  hoverTextColor,
  disabledBackgroundColor = '#cccccc',
  disabledTextColor = '#666666',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: disabled ? disabledBackgroundColor : isHovered ? hoverBackgroundColor : backgroundColor,
    color: disabled ? disabledTextColor : isHovered && hoverTextColor ? hoverTextColor : textColor,
    padding,
    borderRadius,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize,
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
