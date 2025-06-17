import React from "react";

function highlightMatch(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SnippetCard({ snippet, searchQuery, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-48 text-gray-900 dark:text-gray-100">
        {highlightMatch(snippet.code, searchQuery)}
      </pre>

      <div className="mt-3 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded text-xs font-semibold transition-colors duration-200"
          >
            {highlightMatch(tag, searchQuery)}
          </span>
        ))}
      </div>

      <button
        onClick={() => onDelete(snippet.id)}
        className="mt-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold text-sm transition-colors duration-200"
      >
        Delete
      </button>
    </div>
  );
}