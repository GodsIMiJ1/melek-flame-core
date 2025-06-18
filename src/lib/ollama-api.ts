
type OllamaChatRequest = {
  model: string
  messages: { role: "user" | "assistant" | "system"; content: string }[]
  stream?: boolean
}

export async function streamOllamaResponse({
  model,
  messages,
}: OllamaChatRequest): Promise<ReadableStream<Uint8Array>> {
  // Try both localhost and 127.0.0.1
  const urls = ["http://127.0.0.1:11434/api/chat", "http://localhost:11434/api/chat"];

  let lastError;
  for (const url of urls) {
    try {
      console.log(`🔗 Attempting Ollama connection to: ${url}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
      }

      if (!res.body) throw new Error("No response stream from Ollama");

      console.log(`✅ Successfully connected to Ollama at: ${url}`);
      return res.body;
    } catch (error) {
      console.warn(`❌ Failed to connect to ${url}:`, error);
      lastError = error;
    }
  }

  throw new Error(`Failed to connect to Ollama on any URL. Last error: ${lastError}`);
}

export async function getOllamaModels(): Promise<string[]> {
  const urls = ["http://127.0.0.1:11434/api/tags", "http://localhost:11434/api/tags"];

  for (const url of urls) {
    try {
      console.log(`🔗 Fetching models from: ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      const models = data.models?.map((model: any) => model.name) || [];
      console.log(`✅ Found ${models.length} models:`, models);
      return models;
    } catch (error) {
      console.warn(`❌ Failed to fetch models from ${url}:`, error);
    }
  }

  console.error("❌ Could not connect to Ollama on any URL");
  return [];
}
