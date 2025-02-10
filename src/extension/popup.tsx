import React from "react";
import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";

const Popup = () => {
  const { content, isLoading, error, readContent } = useTabContent();

  return (
    <div className="w-96 p-4">
      <p>Hello jackass</p>
      <button
        onClick={readContent}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        {isLoading ? "Reading..." : "Read Tab Content"}
      </button>
      {error && <div className="mt-4 p-4 bg-red-100 text-red-700">{error}</div>}
      {content && <ContentDisplay content={content} />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);
