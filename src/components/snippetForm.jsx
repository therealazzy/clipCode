// SnippetForm: Form for adding or generating code snippets with tags and summary
import React, { useState } from "react";
import { getCodeSummaryAndLanguage, getCodeFromPrompt } from '../api/ai';

export default function SnippetForm({ onAdd }) {
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Patterns to prevent prompt injection
  const forbiddenPatterns = [
    /<\/?(script|iframe|object|embed|form|img|svg|link|style)[^>]*>/i,
    /system\s*:/i,
    /role\s*:/i,
    /openai\s*:/i,
    /\b(import|require|process|child_process|fs|eval|Function|window|document)\b/i,
    /[`$]/,
  ];

  // Returns error string if prompt is invalid
  const validatePrompt = (prompt) => {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(prompt)) {
        return "Prompt contains forbidden or potentially dangerous content.";
      }
    }
    return "";
  };

  // Handle code generation from prompt and auto-submit as snippet
  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setPromptError("");
    const error = validatePrompt(prompt);
    if (error) {
      setPromptError(error);
      return;
    }
    setGenerating(true);
    try {
      const generated = await getCodeFromPrompt(prompt);
      setLoading(true);
      try {
        const aiResult = await getCodeSummaryAndLanguage(generated);
        // Use language and up to 4 keywords from summary as tags
        let autoTags = aiResult.language ? [aiResult.language] : [];
        if (aiResult.summary) {
          // Extract up to 4 keywords from summary for tags
          const stopwords = [
            "the","and","for","with","that","this","from","are","but","can","has","have","was","will","not","you","all","any","use","one","two","out","get","set","let","var","new","now","how","why","who","its","his","her","she","him","our","their","they","them","which","when","where","what","does","did","had","been","more","than","just","like","into","also","each","other","some","such","only","very","may","should","could","would","about","over","after","before","then","these","those","while","because","between","under","above","upon","again","against","during","without","within","upon","using","used"
          ];
          const keywords = aiResult.summary
            .split(/\W+/)
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length > 2 && !stopwords.includes(w));
          autoTags = [...new Set([...autoTags, ...keywords.slice(0, 4)])];
        }
        // Add the new snippet to the list
        const newSnippet = {
          id: Date.now().toString(),
          code: generated.trim(),
          tags: autoTags,
          summary: aiResult.summary || '',
          language: aiResult.language || '',
        };
        onAdd(newSnippet);
        setPrompt("");
        setPromptError("");
      } catch (err) {
        setPromptError("Failed to analyze generated code.");
      }
      setLoading(false);
    } catch (err) {
      setPromptError(err.message || "Failed to generate code.");
      setLoading(false);
    }
    setGenerating(false);
  };

  // Handle manual snippet submission
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
    setPrompt("");
    setPromptError("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        {/* Prompt input and generate button */}
        <div className="md:w-1/3 w-full flex flex-col">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what code you want..."
            className="p-2 border rounded mb-1 bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200 min-h-[100px] max-h-[300px] resize-y"
            rows={6}
            disabled={loading || generating}
          />
          <button
            type="button"
            onClick={handleGenerateCode}
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200 text-sm mt-1"
            disabled={loading || generating || !prompt.trim()}
          >
            {generating ? "Generating..." : "Generate Code"}
          </button>
          {promptError && <span className="text-red-600 dark:text-red-400 text-xs mt-1">{promptError}</span>}
        </div>
        {/* 'or' separator */}
        <div className="flex flex-col justify-center items-center select-none mx-2 md:mx-0">
          <span className="text-slate-400 dark:text-gray-500 font-semibold pointer-events-none user-select-none">or</span>
        </div>
        {/* Code textarea and tags input */}
        <div className="md:w-2/3 w-full flex flex-col">
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
        </div>
      </div>
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