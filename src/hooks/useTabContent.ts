import { useState, useCallback } from "react";
import { ContentState } from "../types";

export const useTabContent = () => {
  const [state, setState] = useState<ContentState>({
    isLoading: false,
    error: null,
    content: null,
  });

  const readContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_TAB_CONTENT",
      });

      if (!response) {
        throw new Error('Failed to get tab content');
      }

      setState({
        isLoading: false,
        error: null,
        content: response,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        content: null,
      });
    }
  }, []);

  return {
    ...state,
    readContent,
  };
};
