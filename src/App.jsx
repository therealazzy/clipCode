import React, { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import SnippetForm from "./components/snippetForm";
import SnippetCard from "./components/snippetCard";
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [snippets, setSnippets] = useLocalStorage("snippets", []);
  const [searchQuery, setSearchQuery] = useState("");

  const addSnippet = (snippet) => {
    setSnippets([snippet, ...snippets]);
  };

  const deleteSnippet = (id) => {
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const query = searchQuery.toLowerCase();
    return (
      snippet.code.toLowerCase().includes(query) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl w-full p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-400">clipCode[..]</h1>

        <SnippetForm onAdd={addSnippet} />

        <input
          type="text"
          placeholder="Search by tag or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-6 border rounded bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
        />

        {filteredSnippets.length === 0 ? (
          <p className="text-slate-600 dark:text-gray-400 text-center">No matching snippets found.</p>
        ) : (
          filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              searchQuery={searchQuery}
              onDelete={deleteSnippet}
            />
          ))
        )}
      </div>
      <Analytics />
    </div>
  );
}

export default App;