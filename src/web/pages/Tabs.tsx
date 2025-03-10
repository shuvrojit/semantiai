import React, { useEffect, useState } from 'react';
import Button from '@/components/buttons/NavButton';

interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active?: boolean;
  pinned?: boolean;
  windowId?: number;
}

interface TabHistoryEntry {
  timestamp: string;
  tabs: Tab[];
}

interface TabFolders {
  [folderName: string]: Tab[];
}

const TabActions = ({ tab, onAction }: { 
  tab: Tab, 
  onAction: (action: string, tabId: number, windowId?: number) => void 
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onAction('focus', tab.id, tab.windowId)}
        className="p-1 hover:bg-blue-100 rounded"
        title="Focus tab"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
      <button
        onClick={() => onAction('pin', tab.id)}
        className={`p-1 hover:bg-blue-100 rounded ${
          tab.pinned ? 'text-blue-600' : ''
        }`}
        title={tab.pinned ? 'Unpin tab' : 'Pin tab'}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
        </svg>
      </button>
      <button
        onClick={() => onAction('moveToNewWindow', tab.id)}
        className="p-1 hover:bg-blue-100 rounded"
        title="Move to new window"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
          <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onAction('close', tab.id)}
        className="p-1 hover:bg-red-100 text-red-600 rounded"
        title="Close tab"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

const TabFolderManager = ({ 
  onSave, 
  folders, 
  onOpen 
}: { 
  onSave: (folderName: string) => void;
  folders: TabFolders;
  onOpen: (folderName: string) => void;
}) => {
  const [newFolderName, setNewFolderName] = useState('');

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Tab Folders</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => {
            if (newFolderName) {
              onSave(newFolderName);
              setNewFolderName('');
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Current Tabs
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(folders).map(([name, tabs]) => (
          <div key={name} className="p-2 border rounded bg-white">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{name}</span>
              <span className="text-sm text-gray-500">{tabs.length} tabs</span>
            </div>
            <button
              onClick={() => onOpen(name)}
              className="w-full px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Open in New Window
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TabHistory = ({ history }: { history: TabHistoryEntry[] }) => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Tab History</h3>
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div key={index} className="p-2 border rounded bg-white">
            <div className="text-sm text-gray-500 mb-1">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
            <div className="text-sm">
              {entry.tabs.length} tabs open
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Tabs: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<TabFolders>({});
  const [history, setHistory] = useState<TabHistoryEntry[]>([]);
  const [activeView, setActiveView] = useState<'current' | 'history' | 'folders'>('current');

  const [chromeAvailable, setChromeAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.tabs) {
      console.warn('Chrome APIs not available - using mock data for development');
      
      if (typeof window !== 'undefined' && !window.chrome) {
        window.chrome = {
          runtime: {
            sendMessage: async (message: any) => {
              console.log('Mock sendMessage called with:', message);
              switch (message.type) {
                case 'GET_TABS':
                  return [
                    { id: 1, title: 'Mock Tab 1', url: 'https://example.com', active: true, windowId: 1 },
                    { id: 2, title: 'Mock Tab 2', url: 'https://example.org', windowId: 1 },
                  ];
                case 'GET_TAB_FOLDERS':
                  return { 'Work': [{ id: 3, title: 'Work Tab', url: 'https://work.com' }] };
                case 'GET_TAB_HISTORY':
                  return [{ timestamp: new Date().toISOString(), tabs: [{ id: 4, title: 'History Tab', url: 'https://history.com' }] }];
                case 'MANAGE_TAB':
                case 'SAVE_TABS_TO_FOLDER':
                case 'OPEN_TABS_FROM_FOLDER':
                  return { success: true };
                default:
                  return null;
              }
            }
          },
          tabs: {
            onUpdated: { addListener: () => {}, removeListener: () => {} },
            onRemoved: { addListener: () => {}, removeListener: () => {} },
            onMoved: { addListener: () => {}, removeListener: () => {} },
            onDetached: { addListener: () => {}, removeListener: () => {} },
            onAttached: { addListener: () => {}, removeListener: () => {} },
          }
        };
      }
      setChromeAvailable(false);
    } else {
      setChromeAvailable(true);
    }
  }, []);

  const fetchTabs = async () => {
    try {
      const response = await safeSendMessage({ type: "GET_TABS" });
      setTabs(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tabs');
    }
  };
  
  const safeSendMessage = async (message: any) => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        return await chrome.runtime.sendMessage(message);
      } catch (err) {
        console.error('Chrome API error:', err);
        throw new Error(`Chrome API error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      console.warn('Chrome API not available, using mock data');
      if (message.type === 'GET_TABS') {
        return [{ id: 1, title: 'Mock Tab', url: 'https://example.com', active: true }];
      }
      return null;
    }
  };
  
  const loadFolders = async () => {
    try {
      const response = await safeSendMessage({ type: "GET_TAB_FOLDERS" });
      if (response) {
        setFolders(response);
      } else {
        setFolders({});
      }
    } catch (err) {
      console.error('Failed to load folders:', err);
      setError('Failed to load folders');
    }
  };

  const loadHistory = async () => {
    try {
      const response = await safeSendMessage({ type: "GET_TAB_HISTORY" });
      if (response) {
        setHistory(response);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load history');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchTabs(),
          loadFolders(),
          loadHistory()
        ]);
      } catch (err) {
        setError('Failed to initialize: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    init();

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const updateTabs = () => fetchTabs();
      
      try {
        chrome.tabs.onUpdated.addListener(updateTabs);
        chrome.tabs.onRemoved.addListener(updateTabs);
        chrome.tabs.onMoved.addListener(updateTabs);
        chrome.tabs.onDetached.addListener(updateTabs);
        chrome.tabs.onAttached.addListener(updateTabs);
        
        return () => {
          try {
            chrome.tabs.onUpdated.removeListener(updateTabs);
            chrome.tabs.onRemoved.removeListener(updateTabs);
            chrome.tabs.onMoved.removeListener(updateTabs);
            chrome.tabs.onDetached.removeListener(updateTabs);
            chrome.tabs.onAttached.removeListener(updateTabs);
          } catch (err) {
            console.error('Error removing tab listeners:', err);
          }
        };
      } catch (err) {
        console.error('Error setting up tab listeners:', err);
        setError('Error setting up tab listeners: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  }, []);

  const handleTabAction = async (action: string, tabId: number, windowId?: number) => {
    setError(null);
    try {
      await safeSendMessage({
        type: "MANAGE_TAB",
        action,
        tabId,
        windowId
      });
      await fetchTabs();
    } catch (err) {
      console.error('Failed to manage tab:', err);
      setError(`Failed to ${action} tab: ${err instanceof Error ? err.message : ''}`);
    }
  };

  const handleSaveToFolder = async (folderName: string) => {
    setError(null);
    try {
      await safeSendMessage({
        type: "SAVE_TABS_TO_FOLDER",
        folderName,
        tabs
      });
      await loadFolders();
    } catch (err) {
      console.error('Failed to save to folder:', err);
      setError(`Failed to save folder "${folderName}"`);
    }
  };

  const handleOpenFolder = async (folderName: string) => {
    setError(null);
    try {
      await safeSendMessage({
        type: "OPEN_TABS_FROM_FOLDER",
        folderName
      });
    } catch (err) {
      console.error('Failed to open folder:', err);
      setError(`Failed to open folder "${folderName}"`);
    }
  };

  const renderChromeStatus = () => {
    if (!chromeAvailable) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Running in development mode with mock Chrome API. Some features may not work as expected.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderChromeStatus()}
      
      <div className="mb-6 flex gap-4">
        <Button
          variant="nav"
          name="Current Tabs"
          onClick={() => setActiveView('current')}
          width="w-[33%]"
          height="h-10"
          bgColor={activeView === 'current' ? 'bg-blue-600' : 'bg-gray-500'}
        />
        <Button
          variant="nav"
          name="Folders"
          onClick={() => setActiveView('folders')}
          width="w-[33%]"
          height="h-10"
          bgColor={activeView === 'folders' ? 'bg-blue-600' : 'bg-gray-500'}
        />
        <Button
          variant="nav"
          name="History"
          onClick={() => setActiveView('history')}
          width="w-[33%]"
          height="h-10"
          bgColor={activeView === 'history' ? 'bg-blue-600' : 'bg-gray-500'}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 rounded">{error}</div>
      ) : (
        <>
          {activeView === 'current' && (
            <div className="space-y-2">
              {tabs.map((tab) => (
                <div 
                  key={tab.id}
                  className={`flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                    tab.active ? 'border-l-4 border-blue-600' : ''
                  }`}
                >
                  <img 
                    src={tab.favIconUrl || '/favicon.ico'} 
                    alt=""
                    className="w-6 h-6 mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{tab.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{tab.url}</p>
                  </div>
                  <TabActions tab={tab} onAction={handleTabAction} />
                </div>
              ))}
              {tabs.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                  No open tabs found.
                </div>
              )}
            </div>
          )}

          {activeView === 'folders' && (
            <TabFolderManager
              folders={folders}
              onSave={handleSaveToFolder}
              onOpen={handleOpenFolder}
            />
          )}

          {activeView === 'history' && (
            <TabHistory history={history} />
          )}
        </>
      )}
    </div>
  );
};

export default Tabs;
