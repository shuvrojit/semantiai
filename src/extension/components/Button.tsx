import React, { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  iconOnly = false,
  title,
}) => {
  const baseStyles = "rounded transition-colors";
  
  const variantStyles = {
    primary: "bg-[#ff9999] text-black hover:bg-[#ff8080]",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-100 text-gray-600 hover:bg-red-100 hover:text-red-600",
    purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  };
  
  const sizeStyles = {
    sm: iconOnly 
      ? "p-1 w-10 h-10" // 40px square for icon-only buttons
      : "px-3 py-1 text-sm h-10", // 40px height for normal buttons
    md: iconOnly 
      ? "p-2 w-14 h-14" // 56px square for icon-only buttons  
      : "px-4 py-2 h-14", // 56px height for normal buttons
    lg: iconOnly 
      ? "p-3 w-16 h-16" // Keeping proportional for large
      : "px-6 py-3 h-16",
  };
  
  const iconStyles = iconOnly ? "flex items-center justify-center" : "";
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${iconStyles} ${className}`;
  
  return (
    <button
      onClick={onClick}
      className={buttonStyles}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
