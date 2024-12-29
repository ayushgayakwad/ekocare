import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { symptoms, severity, days, pdfSummary } = req.body;

    if (!symptoms || !severity || !days) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let prompt = `Patient has the following symptoms: ${symptoms}. The severity is ${severity} and the symptoms started ${days} days ago. Predict the disease, give potential reasons and suggest a treatment plan in brief. Give the output in proper markdown language.`;

    if (pdfSummary) {
      prompt += ` The following document content may also be relevant: ${pdfSummary}`;
    }

    try {
      const result = await model.generateContent(prompt);
      res.status(200).json({ prediction: result.response.text() });
    } catch (error) {
      console.error("Error generating prediction:", error);
      res.status(500).json({ error: "Failed to generate prediction." });
    }
  } else {
    res.status(405).send({ error: "Method not allowed" });
  }
}
