chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TAB_CONTENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        try {
          const [result] = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => ({
              text: document.body.innerText,
              html:document.body.innerHTML,
              // text: document.body.textContent,
              title: document.title,
              url: window.location.href,
            }),
          });
          sendResponse({ success: true, data: result.result });
        } catch (error) {
          sendResponse({ success: false, error: String(error) });
        }
      }
    });
    return true; // Keep the message channel open for async response
  }
});
