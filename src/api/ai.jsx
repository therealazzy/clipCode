// ai.jsx: API functions for interacting with HuggingFace inference for code tasks
import { HfInference } from '@huggingface/inference'

// Prompts for different AI tasks
const SYSTEM_PROMPT = `
You are an expert code assistant. Given a code snippet, provide a short, clear summary (1-2 sentences) of what the code does. Also, identify the programming language of the snippet. Respond in the following JSON format:
{"summary": "<short summary>", "language": "<language>"}`

const OPTIMIZE_PROMPT = `
You are an expert code optimizer. Given a code snippet, return an improved and optimized version of the code. Only return the optimized code, do not include any explanation or comments.`

const TRANSLATE_PROMPT = `
You are an expert code translator. Given a code snippet and a target programming language, translate the code to the target language, preserving the algorithm and logic. Only return the translated code, do not include any explanation or comments.`

const GENERATE_CODE_PROMPT = `
You are an expert developer. Given a prompt describing a coding task, generate a code snippet that fulfills the prompt. Remember that it is important to only return the code, do not include any explanation, comments, or markdown formatting.`

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)

// Get summary and language for a code snippet
export async function getCodeSummaryAndLanguage(codeSnippet) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Here is the code snippet:\n${codeSnippet}` },
            ],
            max_tokens: 512,
        })
        // Parse the JSON response
        const content = response.choices[0].message.content
        return JSON.parse(content)
    } catch (err) {
        console.error(err.message)
        return { summary: "Could not generate summary.", language: "Unknown" }
    }
}

// Get optimized version of a code snippet
export async function getOptimizedCode(codeSnippet) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: OPTIMIZE_PROMPT },
                { role: "user", content: `Optimize this code:\n${codeSnippet}` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
        return "Could not optimize code."
    }
}

// Translate code to a target language
export async function getTranslatedCode(codeSnippet, targetLanguage) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: TRANSLATE_PROMPT },
                { role: "user", content: `Translate this code to ${targetLanguage}:\n${codeSnippet}` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
        return "Could not translate code."
    }
}

// Generate code from a prompt, with basic prompt injection prevention
export async function getCodeFromPrompt(prompt) {
    // Block suspicious or dangerous prompt content
    const forbiddenPatterns = [
        /<\/?(script|iframe|object|embed|form|img|svg|link|style)[^>]*>/i, // HTML/script tags
        /system\s*:/i, // system prompt injection
        /role\s*:/i, // role prompt injection
        /openai\s*:/i, // openai prompt injection
        /\b(import|require|process|child_process|fs|eval|Function\(|window|document)\b/, // dangerous JS (case sensitive, Function only if used as constructor)
    ];
    for (const pattern of forbiddenPatterns) {
        if (pattern.test(prompt)) {
            console.log('Prompt blocked:', prompt);
            console.log('Blocked by pattern:', pattern);
            throw new Error("Prompt contains forbidden or potentially dangerous content.");
        }
    }
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: GENERATE_CODE_PROMPT },
                { role: "user", content: prompt },
            ],
            max_tokens: 1024,
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error(err.message);
        return "Could not generate code.";
    }
}