import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Add middleware to parse JSON payloads
  app.use(express.json());

  // API Route for Langflow Chat Proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const langflowUrl = process.env.LANGFLOW_ENDPOINT;
      const langflowApiKey = process.env.LANGFLOW_API_KEY;

      if (!langflowUrl) {
        return res.status(500).json({ error: "LANGFLOW_ENDPOINT not configured in environment." });
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-DataStax-Current-Org": "c71857a7-4056-417c-b757-7f60393c2576"
      };

      if (langflowApiKey) {
        headers["Authorization"] = `Bearer ${langflowApiKey}`;
      } else {
        console.warn("LANGFLOW_API_KEY not found. Attempting request without authorization.");
      }

      console.log(`Sending request to Langflow: ${langflowUrl}`);

      const response = await fetch(langflowUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          output_type: "chat",
          input_type: "chat",
          input_value: message,
          session_id: sessionId || `session_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Langflow API Error:", errorText);
        return res.status(response.status).json({
          error: "Upstream API error from Langflow",
          details: errorText
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Server API Error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // Serve static files from dist/public in production
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    // Handle client-side routing - serve index.html for all routes
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
