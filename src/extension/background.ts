// Types
interface TabSnapshot {
  id?: number;
  title: string;
  url: string;
  favIconUrl?: string;
  pinned: boolean;
}

interface ChromeTab extends chrome.tabs.Tab {
  id: number; // Force id to be required and non-null for our use cases
}

interface SessionSnapshot {
  timestamp: string;
  tabs: TabSnapshot[];
}

// Tab history management
const saveTabsToHistory = async () => {
  const tabs = await chrome.tabs.query({});
  const timestamp = new Date().toISOString();
  const history = JSON.parse(localStorage.getItem('tabHistory') || '[]') as SessionSnapshot[];
  
  const tabSnapshots: TabSnapshot[] = tabs.map((tab: chrome.tabs.Tab) => ({
    id: tab.id,
    title: tab.title || '',
    url: tab.url || '',
    favIconUrl: tab.favIconUrl,
    pinned: tab.pinned || false
  }));

  history.push({
    timestamp,
    tabs: tabSnapshots
  });

  localStorage.setItem('tabHistory', JSON.stringify(history.slice(-100))); // Keep last 100 snapshots
};

// Bookmark management
const bookmarkAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  const bookmarkFolder = await chrome.bookmarks.create({
    title: `Session - ${new Date().toLocaleString()}`
  });
  
  await Promise.all(tabs.map((tab: chrome.tabs.Tab) => {
    return chrome.bookmarks.create({
      parentId: bookmarkFolder.id,
      title: tab.title || '',
      url: tab.url
    });
  }));
};

// Session management
const saveSession = async () => {
  const tabs = await chrome.tabs.query({});
  const sessions = JSON.parse(localStorage.getItem('savedSessions') || '[]') as SessionSnapshot[];
  
  const tabSnapshots: TabSnapshot[] = tabs.map((tab: chrome.tabs.Tab) => ({
    id: tab.id,
    title: tab.title || '',
    url: tab.url || '',
    favIconUrl: tab.favIconUrl,
    pinned: tab.pinned || false
  }));

  sessions.push({
    timestamp: new Date().toISOString(),
    tabs: tabSnapshots
  });

  localStorage.setItem('savedSessions', JSON.stringify(sessions));
};

const restoreSession = async (timestamp?: string) => {
  const sessions = JSON.parse(localStorage.getItem('savedSessions') || '[]') as SessionSnapshot[];
  if (sessions.length === 0) return;

  // Get the most recent session if no timestamp provided
  const session = timestamp 
    ? sessions.find(s => s.timestamp === timestamp)
    : sessions[sessions.length - 1];

  if (session) {
    await chrome.windows.create({ 
      url: session.tabs.map(tab => tab.url),
      focused: true
    });
  }
};

// Save tabs to history every 5 minutes
setInterval(saveTabsToHistory, 5 * 60 * 1000);

// Initialize folders in localStorage if not exists
if (!localStorage.getItem('tabFolders')) {
  localStorage.setItem('tabFolders', JSON.stringify({}));
}

// Message handling
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "BOOKMARK_ALL") {
    bookmarkAllTabs()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  else if (request.type === "SAVE_SESSION") {
    saveSession()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  else if (request.type === "RESTORE_SESSION") {
    restoreSession(request.timestamp)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  else if (request.type === "GET_TAB_HISTORY") {
    const history = JSON.parse(localStorage.getItem('tabHistory') || '[]');
    sendResponse(history);
    return true;
  }

  else if (request.type === "GET_TAB_FOLDERS") {
    const folders = JSON.parse(localStorage.getItem('tabFolders') || '{}');
    sendResponse(folders);
    return true;
  }

  else if (request.type === "SAVE_TABS_TO_FOLDER") {
    const { folderName, tabs } = request;
    const folders = JSON.parse(localStorage.getItem('tabFolders') || '{}');
    folders[folderName] = tabs;
    localStorage.setItem('tabFolders', JSON.stringify(folders));
    sendResponse({ success: true });
    return true;
  }

  else if (request.type === "OPEN_TABS_FROM_FOLDER") {
    const { folderName } = request;
    const folders = JSON.parse(localStorage.getItem('tabFolders') || '{}');
    const tabs = folders[folderName];
    if (tabs) {
      chrome.windows.create({ url: tabs.map(tab => tab.url) });
    }
    sendResponse({ success: true });
    return true;
  }

  else if (request.type === "GET_TABS") {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
      const tabList = tabs.map((tab: chrome.tabs.Tab) => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        active: tab.active,
        pinned: tab.pinned
      }));
      sendResponse(tabList);
    });
    return true;
  } 
  
  else if (request.type === "MANAGE_TAB") {
    const { action, tabId, windowId } = request;
    switch (action) {
      case "close":
        chrome.tabs.remove(tabId);
        break;
      case "focus":
        chrome.tabs.update(tabId, { active: true });
        if (windowId) {
          chrome.windows.update(windowId, { focused: true });
        }
        break;
      case "pin":
        chrome.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
          if (tab.id !== undefined) {
            chrome.tabs.update(tab.id, { pinned: !tab.pinned });
          }
        });
        break;
      case "moveToNewWindow":
        chrome.windows.create({ tabId });
        break;
      case "moveToWindow":
        if (windowId) {
          chrome.tabs.move(tabId, { windowId, index: -1 });
        }
        break;
    }
    sendResponse({ success: true });
    return true;
  }

  else if (request.type === "GET_TAB_CONTENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        try {
          const [result] = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => ({
              text: document.body.innerText,
              html: document.body.innerHTML,
              title: document.title,
              url: window.location.href,
            }),
          });
          sendResponse(result.result);
        } catch (error) {
          sendResponse(null);
        }
      }
    });
    return true; // Keep the message channel open for async response
  }
});
