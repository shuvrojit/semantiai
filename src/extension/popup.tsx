import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";
import Button from "@/components/buttons/NavButton";

const Popup = () => {
  const { content, isLoading, error, readContent } = useTabContent();

  const handleSaveTab = () => {
    // TODO: Implement save functionality
    console.log("Save tab clicked");
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
      {content && <ContentDisplay content={content} />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);
