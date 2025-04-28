import { useState } from "react";

export const DescToggle = ({ text, expanded, setExpanded }) => {
  const previewText = text.length > 100 ? text.slice(0, 100) + "..." : text;

  return (
    <div className="w-full text-gray-700 text-center mt-3 text-base leading-relaxed">
      <p>{expanded ? text : previewText}</p>
      {text.length > 100 && (
        <button
          className="mt-2 text-blue-600 text-sm font-semibold hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
