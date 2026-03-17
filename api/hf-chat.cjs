const HF_CHAT_COMPLETIONS_URL = 'https://api-inference.huggingface.co/v1/chat/completions'

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const token = process.env.HF_ACCESS_TOKEN
  if (!token) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error:
          'Server misconfigured: missing HF_ACCESS_TOKEN environment variable',
      }),
    )
    return
  }

  let body
  try {
    body = await readJson(req)
  } catch (e) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: e.message || 'Invalid request body' }))
    return
  }

  const model = body?.model
  const messages = body?.messages
  const max_tokens = body?.max_tokens

  if (typeof model !== 'string' || !Array.isArray(messages)) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing or invalid model/messages' }))
    return
  }

  try {
    const hfRes = await fetch(HF_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens }),
    })

    const text = await hfRes.text()
    res.statusCode = hfRes.status
    res.setHeader('Content-Type', 'application/json')
    res.end(text)
  } catch (e) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Upstream request failed' }))
  }
}

