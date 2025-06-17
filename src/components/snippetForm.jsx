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
        className="w-full p-2 border rounded mb-2 font-mono"
        rows={6}
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Snippet
      </button>
    </form>
  );
}