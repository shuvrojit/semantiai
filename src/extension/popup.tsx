import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";
import Button from "@/components/buttons/NavButton";
import { useState, useEffect } from "react";
import { saveTab } from "@/api/content";

interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
}

const TabsList = ({ tabs, onTabAction }: { 
  tabs: Tab[], 
  onTabAction: (action: string, tabId: number) => void 
}) => {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      {tabs.map((tab) => (
        <div key={tab.id} 
          className={`flex items-center p-2 hover:bg-gray-100 ${
            tab.active ? 'bg-blue-50' : ''
          }`}
        >
          <img 
            src={tab.favIconUrl || 'default-favicon.png'} 
            className="w-4 h-4 mr-2"
            alt=""
          />
          <div className="flex-1 truncate">
            <div className="text-sm font-medium truncate">{tab.title}</div>
            <div className="text-xs text-gray-500 truncate">{tab.url}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onTabAction('focus', tab.id)}
              className="p-1 hover:bg-blue-100 rounded"
              title="Focus tab"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            <button
              onClick={() => onTabAction('pin', tab.id)}
              className={`p-1 hover:bg-blue-100 rounded ${
                tab.pinned ? 'text-blue-600' : ''
              }`}
              title={tab.pinned ? 'Unpin tab' : 'Pin tab'}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            <button
              onClick={() => onTabAction('close', tab.id)}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
              title="Close tab"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Popup = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeView, setActiveView] = useState<'tabs' | 'content'>('tabs');
  const [summaryContent, setSummaryContent] = useState<string>("");
  const { content, isLoading, error, readContent } = useTabContent();
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadTabs = async () => {
      try {
        const tabList = await chrome.runtime.sendMessage({ type: "GET_TABS" });
        setTabs(tabList);
      } catch (err) {
        console.error('Failed to load tabs:', err);
      }
    };
    
    loadTabs();
    // Refresh tabs list when tabs are updated
    const updateTabs = () => loadTabs();
    chrome.tabs.onUpdated.addListener(updateTabs);
    chrome.tabs.onRemoved.addListener(updateTabs);
    
    return () => {
      chrome.tabs.onUpdated.removeListener(updateTabs);
      chrome.tabs.onRemoved.removeListener(updateTabs);
    };
  }, []);

  const handleTabAction = async (action: string, tabId: number) => {
    try {
      await chrome.runtime.sendMessage({
        type: "MANAGE_TAB",
        action,
        tabId
      });
    } catch (err) {
      console.error('Failed to manage tab:', err);
    }
  };

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
          name="Tabs"
          onClick={() => setActiveView('tabs')}
          width="w-[50%]"
          height="h-10"
          bgColor={activeView === 'tabs' ? 'bg-blue-600' : 'bg-gray-500'}
        >
          Tabs ({tabs.length})
        </Button>
        
        <Button
          variant="nav"
          name="Content"
          onClick={() => setActiveView('content')}
          width="w-[50%]"
          height="h-10"
          bgColor={activeView === 'content' ? 'bg-blue-600' : 'bg-gray-500'}
        />
      </div>

      {activeView === 'tabs' ? (
        <TabsList tabs={tabs} onTabAction={handleTabAction} />
      ) : (
        <div>
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
      )}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);
