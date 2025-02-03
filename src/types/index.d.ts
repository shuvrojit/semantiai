export interface TabContent {
  text: string;
  title: string;
  url: string;
}

export interface ContentState {
  isLoading: boolean;
  error: string | null;
  content: TabContent | null;
}
