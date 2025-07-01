import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function highlightMatch(text, query) {
  if (!query) return text;

  // Escape special characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  try {
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-amber-100 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch (error) {
    // If there's any error in the regex, just return the original text
    console.error('Error in highlightMatch:', error);
    return text;
  }
}

// Helper to normalize language names for syntax highlighter
function getSyntaxLanguage(lang) {
  if (!lang) return 'text';
  const normalized = lang.trim().toLowerCase();
  if (normalized === 'c++') return 'cpp';
  return normalized;
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
      {/* Summary and Language */}
      {snippet.summary && (
        <div className="mb-2">
          <div className="text-sm text-slate-700 dark:text-gray-300 font-semibold">Summary:</div>
          <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">{snippet.summary}</div>
        </div>
      )}
      {snippet.language && (
        <div className="mb-2">
          <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">{snippet.language}</span>
        </div>
      )}
      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language={getSyntaxLanguage(snippet.language)}
          style={oneDark}
          customStyle={{ margin: 0, borderRadius: '0.375rem', fontSize: '0.875rem', maxHeight: '12rem', overflowX: 'auto' }}
          wrapLongLines={true}
        >
          {searchQuery ? highlightMatch(snippet.code, searchQuery) : snippet.code}
        </SyntaxHighlighter>
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