// Chrome API type definitions for development

interface ChromeTab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active?: boolean;
  pinned?: boolean;
  windowId?: number;
}

interface ChromeEvent {
  addListener: (callback: Function) => void;
  removeListener: (callback: Function) => void;
}

interface ChromeTabs {
  onUpdated: ChromeEvent;
  onRemoved: ChromeEvent;
  onMoved: ChromeEvent;
  onDetached: ChromeEvent;
  onAttached: ChromeEvent;
}

interface ChromeRuntime {
  sendMessage: (message: any) => Promise<any>;
}

interface Chrome {
  tabs?: ChromeTabs;
  runtime?: ChromeRuntime;
}

declare global {
  interface Window {
    chrome?: Chrome;
  }
  const chrome: Chrome;
}

export {};
