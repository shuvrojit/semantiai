import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./buttons/NavButton";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Tabs", path: "/tabs" },
    { name: "Jobs", path: "/jobs" },
    { name: "CV", path: "/cv" },
    { name: "Scholarship", path: "/scholarships" },
    { name: "Article", path: "/cv-template" },
    { name: "Links", path: "/links" },
  ];

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate("/tabs");
    }
  }, [location.pathname, navigate]);

  const buttonProps = {
    variant: "nav" as const,
    width: "w-[140px]",
    height: "h-[40px]",
    bgColor: "bg-blue-600",
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-48 bg-white shadow-lg flex flex-col py-6">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-blue-600 text-center">
          SemanticAI
        </h1>
      </div>
      <div className="flex flex-col items-center justify-start gap-4 flex-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            {...buttonProps}
            name={item.name}
            onClick={() => navigate(item.path)}
            className={`transition-all hover:scale-105 ${
              location.pathname === item.path
                ? "ring-2 ring-blue-300 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
