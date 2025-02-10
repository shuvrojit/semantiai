import React from "react";
import { TabContent } from "../types";

interface Props {
  content: TabContent;
}

export const ContentDisplay: React.FC<Props> = ({ content }) => {
  console.log(content);
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">{content.title}</h2>
      <p className="text-sm text-gray-500 mb-4">{content.url}</p>
      <div className="max-h-96 overflow-y-auto">
        <p className="text-sm whitespace-pre-wrap">{content.text}</p>
      </div>
    </div>
  );
};
