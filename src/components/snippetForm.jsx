import React, { useState } from "react";

export default function SnippetForm({ onAdd }) {
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newSnippet = {
      id: Date.now().toString(),
      code: code.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    onAdd(newSnippet);
    setCode("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code snippet here..."
        className="w-full p-2 border rounded mb-2 font-mono bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
        rows={6}
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
      />
      <button
        type="submit"
        className="bg-indigo-700 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-800 dark:hover:bg-indigo-600 transition-colors duration-200"
      >
        Add Snippet
      </button>
    </form>
  );
}