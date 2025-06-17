import React, { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import SnippetForm from "./components/snippetForm";
import SnippetCard from "./components/snippetCard";

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">clipCode[..]</h1>

      <SnippetForm onAdd={addSnippet} />

      <input
        type="text"
        placeholder="Search by tag or code..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-6 border rounded"
      />

      {filteredSnippets.length === 0 ? (
        <p className="text-gray-500 text-center">No matching snippets found.</p>
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
  );
}

export default App;