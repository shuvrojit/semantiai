import { createRoot } from "react-dom/client";
import { useTabContent } from "@/hooks/useTabContent";
import { ContentDisplay } from "@/components/content";
import { useState, useEffect } from "react";
import TabManager from "./components/TabManager";
import { saveTab } from "@/api/content";

interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
}

const Popup = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { content, readContent } = useTabContent();

  useEffect(() => {
    const loadTabs = async () => {
      try {
        const tabList = await chrome.runtime.sendMessage({ type: "GET_TABS" });
        setTabs(tabList);
      } catch (err) {
        setError('Failed to load tabs');
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
      if (action === 'summary' || action === 'overview' || action === 'info') {
        await readContent();
      } else if (action === 'save') {
        if (content) {
          await saveTab(content);
        }
      } else {
        await chrome.runtime.sendMessage({
          type: "MANAGE_TAB",
          action,
          tabId
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      switch (action) {
        case 'closeAll':
          await Promise.all(tabs.map(tab => 
            chrome.runtime.sendMessage({
              type: "MANAGE_TAB",
              action: "close",
              tabId: tab.id
            })
          ));
          break;
        case 'bookmark':
          // TODO: Implement bookmark all tabs
          break;
        case 'saveTab':
          if (content) {
            await saveTab(content);
          }
          break;
        case 'restoreSession':
          // TODO: Implement restore session
          break;
        case 'saveSession':
          // TODO: Implement save session
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform bulk action');
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <TabManager 
        tabs={tabs} 
        onTabAction={handleTabAction}
        onBulkAction={handleBulkAction}
      />
      {content && <ContentDisplay content={content} />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Popup />);
