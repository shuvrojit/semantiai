import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/navbar";
import Links from "@/components/Links";
import Jobs from "@/web/pages/Jobs";
import Scholarships from "@/web/pages/Scholarships";
import Tabs from "@/web/pages/Tabs";

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-screen h-screen flex flex-col flex-start bg-gray-50">
        <Navbar />
        <div className="flex-1 ml-48 px-8 py-8 bg-gray-50/50 min-h-screen">
          <Routes>
            <Route path="/links" element={<Links />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/tabs" element={<Tabs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
