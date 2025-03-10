// components/buttons/Button.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "nav";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  width?: string;
  height?: string;
  name?: string;
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  iconPosition = "left",
  width,
  height,
  name,
  bgColor,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: `${bgColor || 'bg-blue-500'} text-white hover:bg-blue-600`,
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    nav: `${bgColor || 'bg-blue-600'} text-white hover:bg-blue-700 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] active:scale-95 active:shadow-[0_4px_8px_rgba(0,0,0,0.1)]`
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  };

  const customStyles = {
    width: width || "",
    height: height || ""
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${!height && sizes[size]}
        ${width || ''}
        ${height || ''}
        ${className}
      `}
      style={customStyles}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="mr-2 h-5 w-5" />}
      {children || name}
      {Icon && iconPosition === "right" && <Icon className="ml-2 h-5 w-5" />}
    </button>
  );
};

export default Button;
