import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";
import { useState, useEffect } from "react";
import { saveTab } from "@/api/content";
import TabManager from "./components/TabManager";
import ActionButton from "@/components/buttons/ActionButton";

const Popup = () => {
  const { content, readContent } = useTabContent();

  useEffect(() => {
    readContent();
  }, []);

  const handleSaveTab = async () => {
    if (content) {
      await saveTab(content);
    }
  };

  return (
    <div className="p-4">
      <ActionButton onClick={handleSaveTab}>Save Tab</ActionButton>
      <TabManager />
      {content && <ContentDisplay content={content} />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);
