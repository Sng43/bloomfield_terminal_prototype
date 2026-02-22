export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

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
        return res.status(200).json(data);
    } catch (error) {
        console.error("Server API Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
