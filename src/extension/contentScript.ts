interface TabContent {
  text: string;
  html: string;
  title: string;
  url: string;
}

/**
 * Extract content from the current page
 */
function getPageContent(): TabContent {
  return {
    text: document.body.innerText || '',
    html: document.body.innerHTML || '',
    title: document.title,
    url: window.location.href,
  };
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'getPageContent') {
    try {
      const content = getPageContent();
      console.log('Sending page content back');
      sendResponse({ content });
    } catch (error) {
      console.error('Error extracting page content:', error);
      sendResponse({ error: 'Failed to extract page content' });
    }
    return true; // Keep the messaging channel open for async response
  }
});

console.log('SemantAI Tab Manager content script loaded');
