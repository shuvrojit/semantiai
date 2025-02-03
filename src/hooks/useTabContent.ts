import { useState, useCallback } from "react";
import { TabContent, ContentState } from "../types";

export const useTabContent = () => {
  const [state, setState] = useState<ContentState>({
    isLoading: false,
    error: null,
    content: null,
  });

  const readContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        type: "GET_TAB_CONTENT",
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      setState({
        isLoading: false,
        error: null,
        content: response.data,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        content: null,
      });
    }
  }, []);

  return {
    ...state,
    readContent,
  };
};
