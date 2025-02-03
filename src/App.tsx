import React from "react";
import { useTabContent } from "./hooks/useTabContent";
import { ContentDisplay } from "./components/content.tsx";

const App: React.FC = () => {
  const { isLoading, error, content, readContent } = useTabContent();

  return (
    <div className="w-96 p-4">
      <button
        onClick={readContent}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Reading..." : "Read Tab Content"}
      </button>

      <div className="mt-4">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {content && <ContentDisplay content={content} />}
      </div>
    </div>
  );
};

export default App;
