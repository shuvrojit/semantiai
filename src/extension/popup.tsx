import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";
import Button from "@/components/buttons/NavButton";
import { useState } from "react";
import { saveTab } from "@/api/content";

const Popup = () => {
  const [summaryContent, setSummaryContent] = useState<string>("");
  const { content, isLoading, error, readContent } = useTabContent();
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveTab = async () => {
    try {
      if (content) {
        await saveTab(content);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save tab');
    }
  };

  return (
    <div className="min-w-[400px] min-h-[200px] p-4">
      <div className="flex gap-4 mb-4">
        <Button
          variant="nav"
          name="Read Content"
          onClick={readContent}
          disabled={isLoading}
          width="w-[50%]"
          height="h-10"
          bgColor="bg-blue-600"
        >
          {isLoading ? "Reading..." : "Read Tab"}
        </Button>
        
        <Button
          variant="nav"
          name="Save Tab"
          onClick={handleSaveTab}
          width="w-[50%]"
          height="h-10"
          bgColor="bg-green-600"
        />
      </div>
      {error && <div className="mt-4 p-4 bg-red-100 text-red-700">{error}</div>}
      {saveError && <div className="mt-4 p-4 bg-red-100 text-red-700">{saveError}</div>}
      {summaryContent && <ContentDisplay content={summaryContent} />}
      {content && <ContentDisplay content={content} />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);


