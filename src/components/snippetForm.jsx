import React, { useState } from "react";
import { getCodeSummaryAndLanguage } from '../api/ai';

export default function SnippetForm({ onAdd }) {
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    let summary = "", language = "";
    try {
      const aiResult = await getCodeSummaryAndLanguage(code.trim());
      summary = aiResult.summary;
      language = aiResult.language;
    } catch (err) {
      summary = "Could not generate summary.";
      language = "Unknown";
    }
    const newSnippet = {
      id: Date.now().toString(),
      code: code.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      summary,
      language,
    };
    onAdd(newSnippet);
    setCode("");
    setTags("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code snippet here..."
        className="w-full p-2 border rounded mb-2 font-mono bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200 min-h-[100px] max-h-[300px] overflow-y-auto resize-y"
        rows={6}
        disabled={loading}
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
        disabled={loading}
      />
      <div className="flex justify-end items-center gap-2">
        {loading && <span className="text-indigo-600 dark:text-indigo-300 text-sm">Generating summary...</span>}
        <button
          type="submit"
          className="bg-indigo-700 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-800 dark:hover:bg-indigo-600 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Snippet"}
        </button>
      </div>
    </form>
  );
}