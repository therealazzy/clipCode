import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getOptimizedCode, getTranslatedCode } from '../api/ai';

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

const COMMON_LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'ruby', 'php', 'rust', 'kotlin', 'swift'
];

export default function SnippetCard({ snippet, searchQuery, onDelete }) {
  const [showToast, setShowToast] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState("");
  const [loadingOptimized, setLoadingOptimized] = useState(false);
  const [optError, setOptError] = useState("");

  const [showTranslate, setShowTranslate] = useState(false);
  const [translatedCode, setTranslatedCode] = useState("");
  const [loadingTranslated, setLoadingTranslated] = useState(false);
  const [transError, setTransError] = useState("");
  const [targetLang, setTargetLang] = useState("");

  const [showCopyOptimized, setShowCopyOptimized] = useState(false);
  const [showCopyTranslated, setShowCopyTranslated] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleShowOptimized = async () => {
    setShowOptimized(true);
    setLoadingOptimized(true);
    setOptError("");
    try {
      const result = await getOptimizedCode(snippet.code);
      setOptimizedCode(result);
    } catch (err) {
      setOptError("Failed to optimize code.");
    }
    setLoadingOptimized(false);
  };

  const handleCloseOptimized = () => {
    setShowOptimized(false);
    setOptimizedCode("");
    setOptError("");
  };

  // Translate logic
  const availableLanguages = COMMON_LANGUAGES.filter(
    lang => lang.toLowerCase() !== (snippet.language || '').toLowerCase()
  );

  const handleShowTranslate = () => {
    setShowTranslate(true);
    setTranslatedCode("");
    setTransError("");
    setTargetLang(availableLanguages[0] || "");
  };

  const handleTranslate = async () => {
    if (!targetLang) return;
    setLoadingTranslated(true);
    setTransError("");
    try {
      const result = await getTranslatedCode(snippet.code, targetLang);
      setTranslatedCode(result);
    } catch (err) {
      setTransError("Failed to translate code.");
    }
    setLoadingTranslated(false);
  };

  const handleCloseTranslate = () => {
    setShowTranslate(false);
    setTranslatedCode("");
    setTransError("");
    setTargetLang("");
  };

  const handleCopyOptimized = () => {
    navigator.clipboard.writeText(optimizedCode);
    setShowCopyOptimized(true);
    setTimeout(() => setShowCopyOptimized(false), 1500);
  };

  const handleCopyTranslated = () => {
    navigator.clipboard.writeText(translatedCode);
    setShowCopyTranslated(true);
    setTimeout(() => setShowCopyTranslated(false), 1500);
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

      <div className="flex gap-2 mt-3 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={handleShowOptimized}
            className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-200 border border-blue-200 dark:border-blue-800 rounded px-2 py-1"
          >
            Optimize
          </button>
          <button
            onClick={handleShowTranslate}
            className="text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold text-sm transition-colors duration-200 border border-purple-200 dark:border-purple-800 rounded px-2 py-1"
          >
            Translate
          </button>
        </div>
        <button
          onClick={() => onDelete(snippet.id)}
          className="ml-auto text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 p-2 rounded-full border border-transparent hover:bg-red-100 dark:hover:bg-red-900"
          aria-label="Delete snippet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M6.5 4.5A1.5 1.5 0 0 1 8 3h4a1.5 1.5 0 0 1 1.5 1.5V5H17a.75.75 0 0 1 0 1.5h-.638l-.6 9.008A2.25 2.25 0 0 1 13.517 17H6.483a2.25 2.25 0 0 1-2.245-2.492l-.6-9.008H3a.75.75 0 0 1 0-1.5h2.5v-.5ZM8 4.5v.5h4v-.5A.5.5 0 0 0 12 4H8a.5.5 0 0 0-.5.5Zm-2.61 2l.6 9.008a.75.75 0 0 0 .75.742h7.034a.75.75 0 0 0 .75-.742l.6-9.008H5.39Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {showToast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out border border-indigo-200 dark:border-indigo-800">
          Copied to clipboard!
        </div>
      )}

      {/* Optimized Code Modal */}
      {showOptimized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
            <button
              onClick={handleCloseOptimized}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300">Optimized Code</h2>
            {loadingOptimized ? (
              <div className="text-blue-600 dark:text-blue-200">Optimizing...</div>
            ) : optError ? (
              <div className="text-red-600 dark:text-red-400">{optError}</div>
            ) : (
              <div>
                <SyntaxHighlighter
                  language={getSyntaxLanguage(snippet.language)}
                  style={oneDark}
                  customStyle={{ borderRadius: '0.375rem', fontSize: '0.95rem', maxHeight: '24rem', overflowX: 'auto' }}
                  wrapLongLines={true}
                >
                  {optimizedCode}
                </SyntaxHighlighter>
                <button
                  onClick={handleCopyOptimized}
                  className="mt-2 px-3 py-1 rounded bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-100 text-sm font-medium hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Copy
                </button>
                {showCopyOptimized && (
                  <span className="ml-2 text-green-600 dark:text-green-400 text-sm">Copied!</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Translated Code Modal */}
      {showTranslate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
            <button
              onClick={handleCloseTranslate}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-slate-700 dark:text-gray-200">Translate Code</h2>
            <div className="mb-4 flex items-center gap-2">
              <label htmlFor="targetLang" className="text-sm font-medium text-slate-700 dark:text-gray-200">Target Language:</label>
              <select
                id="targetLang"
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                className="border border-slate-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <button
                onClick={handleTranslate}
                className="ml-2 px-3 py-1 rounded bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-100 text-sm font-medium hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors duration-200"
                disabled={loadingTranslated}
              >
                {loadingTranslated ? "Translating..." : "Translate"}
              </button>
            </div>
            {loadingTranslated ? (
              <div className="text-slate-600 dark:text-gray-300">Translating...</div>
            ) : transError ? (
              <div className="text-red-600 dark:text-red-400">{transError}</div>
            ) : translatedCode ? (
              <div>
                <SyntaxHighlighter
                  language={getSyntaxLanguage(targetLang)}
                  style={oneDark}
                  customStyle={{ borderRadius: '0.375rem', fontSize: '0.95rem', maxHeight: '24rem', overflowX: 'auto' }}
                  wrapLongLines={true}
                >
                  {translatedCode}
                </SyntaxHighlighter>
                <button
                  onClick={handleCopyTranslated}
                  className="mt-2 px-3 py-1 rounded bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-100 text-sm font-medium hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Copy
                </button>
                {showCopyTranslated && (
                  <span className="ml-2 text-green-600 dark:text-green-400 text-sm">Copied!</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}