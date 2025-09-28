// This service provides an example of how to call the Grok API.
// It is not currently used in the application.

// It's recommended to use environment variables for API keys instead of hardcoding them.
// For example: const API_KEY = process.env.GROK_API_KEY;
const API_KEY = "YOUR_GROK_API_KEY_HERE";

async function callGrok(prompt: string) {
  if (API_KEY === "YOUR_GROK_API_KEY_HERE" || !API_KEY) {
    console.error("Grok API key is not set in services/grokservices.ts. The call will not be made.");
    return;
  }
  
  try {
    const res = await fetch("https://api.x.ai/v1/grok", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-4",
        input: prompt,
      })
    });
    
    if (!res.ok) {
        throw new Error(`Grok API request failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error calling Grok API:", error);
  }
}

// Example of how to use the function:
// callGrok("Please explain this error: NullPointerException ...");

// This file is converted into a module to prevent global scope issues.
export {};
