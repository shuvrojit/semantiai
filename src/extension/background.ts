// Tab history management
const saveTabsToHistory = async () => {
  const tabs = await chrome.tabs.query({});
  const timestamp = new Date().toISOString();
  const history = JSON.parse(localStorage.getItem('tabHistory') || '[]');
  history.push({
    timestamp,
    tabs: tabs.map(tab => ({
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl,
      pinned: tab.pinned
    }))
  });
  localStorage.setItem('tabHistory', JSON.stringify(history.slice(-100))); // Keep last 100 snapshots
};

// Save tabs to history every 5 minutes
setInterval(saveTabsToHistory, 5 * 60 * 1000);

// Initialize folders in localStorage if not exists
if (!localStorage.getItem('tabFolders')) {
  localStorage.setItem('tabFolders', JSON.stringify({}));
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "GET_TAB_HISTORY") {
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
    chrome.tabs.query({}, (tabs) => {
      const tabList = tabs.map(tab => ({
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
        chrome.windows.update(windowId, { focused: true });
        break;
      case "pin":
        chrome.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
          chrome.tabs.update(tabId, { pinned: !tab.pinned });
        });
        break;
      case "moveToNewWindow":
        chrome.windows.create({ tabId });
        break;
      case "moveToWindow":
        chrome.tabs.move(tabId, { windowId, index: -1 });
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
