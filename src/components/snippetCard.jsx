import React from "react";

function highlightMatch(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SnippetCard({ snippet, searchQuery, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 mb-4">
      <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-48">
        {highlightMatch(snippet.code, searchQuery)}
      </pre>

      <div className="mt-3 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold"
          >
            {highlightMatch(tag, searchQuery)}
          </span>
        ))}
      </div>

      <button
        onClick={() => onDelete(snippet.id)}
        className="mt-3 text-red-600 hover:text-red-800 font-semibold text-sm"
      >
        Delete
      </button>
    </div>
  );
}