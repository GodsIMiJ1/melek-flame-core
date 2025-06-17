
type OllamaChatRequest = {
  model: string
  messages: { role: "user" | "assistant" | "system"; content: string }[]
  stream?: boolean
}

export async function streamOllamaResponse({
  model,
  messages,
}: OllamaChatRequest): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  })

  if (!res.ok) {
    throw new Error(`Ollama API error: ${res.status} ${res.statusText}`)
  }

  if (!res.body) throw new Error("No response stream from Ollama")

  return res.body
}

export async function getOllamaModels(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:11434/api/tags")
    if (!res.ok) throw new Error("Failed to fetch models")
    const data = await res.json()
    return data.models?.map((model: any) => model.name) || []
  } catch (error) {
    console.error("Error fetching Ollama models:", error)
    return []
  }
}
