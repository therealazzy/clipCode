import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an expert code assistant. Given a code snippet, provide a short, clear summary (1-2 sentences) of what the code does. Also, identify the programming language of the snippet. Respond in the following JSON format:
{"summary": "<short summary>", "language": "<language>"}`

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