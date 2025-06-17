import React, { useState } from "react";

function highlightMatch(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-amber-100 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SnippetCard({ snippet, searchQuery, onDelete }) {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 border border-slate-200 dark:border-gray-700 transition-colors duration-200 group">
      <div className="relative">
        <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-48 text-slate-900 dark:text-gray-100">
          {highlightMatch(snippet.code, searchQuery)}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800"
        >
          Copy
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-semibold transition-colors duration-200"
          >
            {highlightMatch(tag, searchQuery)}
          </span>
        ))}
      </div>

      <button
        onClick={() => onDelete(snippet.id)}
        className="mt-3 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold text-sm transition-colors duration-200"
      >
        Delete
      </button>

      {showToast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out border border-indigo-200 dark:border-indigo-800">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}