import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./buttons/NavButton";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Jobs", path: "/jobs" },
    { name: "Scholarship", path: "/scholarships" },
    { name: "Article", path: "/cv-template" },
    { name: "Links", path: "/links" },
  ];

  const buttonProps = {
    variant: "nav" as const,
    width: "w-[160px]",
    height: "h-[48px]",
    bgColor: "bg-blue-600",
  };

  return (
    <nav className="w-auto flex bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-start gap-5">
        {navItems.map((item) => (
          <Button
            key={item.path}
            {...buttonProps}
            name={item.name}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? 'ring-2 ring-blue-300' : ''}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
