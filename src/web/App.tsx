import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/navbar";

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-screen h-screen flex flex-col flex-start bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <Routes>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
