import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { severity, location, pdfSummary, emergencyService } = req.body;

    if (!severity || !emergencyService) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let prompt = `Write steps to be taken by a person after sending a SOS with severity ${severity}. The required emergency service was ${emergencyService}. Give the output in proper markdown language.`;

    // Include PDF summary if provided
    if (pdfSummary) {
      prompt += ` The following document content may also be relevant: ${pdfSummary}`;
    }

    try {
      const result = await model.generateContent(prompt);
      res.status(200).json({ sosText: result.response.text() });
    } catch (error) {
      console.error("Error generating sosText:", error);
      res.status(500).json({ error: "Failed to generate sosText." });
    }
  } else {
    res.status(405).send({ error: "Method not allowed" });
  }
}
