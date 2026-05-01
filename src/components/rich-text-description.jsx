"use client";

import { stripHtml } from "@/lib/utils";
import { useState } from "react";

export function RichTextDescription({ content, limit = 150 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const plainText = stripHtml(content);
  const isLong = plainText.length > limit;

  return (
    <div className="space-y-2">
      <div
        className={`prose prose-sm max-w-none ${
          !isExpanded && isLong ? "line-clamp-2" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
