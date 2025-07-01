import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an expert code assistant. Given a code snippet, provide a short, clear summary (1-2 sentences) of what the code does. Also, identify the programming language of the snippet. Respond in the following JSON format:
{"summary": "<short summary>", "language": "<language>"}`

const OPTIMIZE_PROMPT = `
You are an expert code optimizer. Given a code snippet, return an improved and optimized version of the code. Only return the optimized code, do not include any explanation or comments.`

const TRANSLATE_PROMPT = `
You are an expert code translator. Given a code snippet and a target programming language, translate the code to the target language, preserving the algorithm and logic. Only return the translated code, do not include any explanation or comments.`

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)

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

export async function getTranslatedCode(codeSnippet, targetLanguage) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: TRANSLATE_PROMPT },
                { role: "user", content: `Translate this code to ${targetLanguage}:
${codeSnippet}` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
        return "Could not translate code."
    }
}