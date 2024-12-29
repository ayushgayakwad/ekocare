import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ipfsUrl } = req.body;
    if (!ipfsUrl) {
      return res.status(400).send({ error: "IPFS URL is required" });
    }

    try {
      const pdfResponse = await fetch(ipfsUrl);
      const pdfBuffer = await pdfResponse.arrayBuffer();

      const result = await model.generateContent([
        {
          inlineData: {
            data: Buffer.from(pdfBuffer).toString("base64"),
            mimeType: "application/pdf",
          },
        },
        "Summarize this document",
      ]);

      res.json({ summary: result.response.text() });
    } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).send({ error: "Error while summarizing the document" });
    }
  } else {
    res.status(405).send({ error: "Method not allowed" });
  }
}
