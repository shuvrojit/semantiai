chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "GET_TAB_CONTENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        try {
          const [result] = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => ({
              text: document.body.innerText,
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
