# SnipCode ✂️💡

A clean, fast, and modern code snippet manager for developers. Add, search, and manage your favorite snippets all stored locally in your browser.

Built with React, Tailwind CSS, and localStorage.

## 🚀 Features

- 🧾 Add and delete code snippets
- 🏷️ Tag each snippet with custom keywords
- 🔍 Search by tag or code content (with highlight)
- 💾 All data stored locally in your browser

## 🤖 AI-Powered Features

- ✨ **Summarize code:** Get concise, AI-generated summaries and language detection for any code snippet.
- 🚀 **Optimize code:** Instantly improve and refactor your code with AI suggestions.
- 🌐 **Translate code:** Convert code between programming languages using AI.
- 🛠️ **Generate code:** Create new code snippets from natural language prompts.

All AI features are powered by HuggingFace Inference API and are securely accessed via a backend proxy—**your API key is never exposed to the frontend**.

## 🔒 Secure AI Integration

To keep your HuggingFace API key safe, the app uses a backend (serverless function or API route) as a proxy. The frontend never sees your secret key. In production, secrets are managed securely and never sent to the browser.

## 🛠 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run the app locally
npm run dev

```
