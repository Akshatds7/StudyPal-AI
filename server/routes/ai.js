import express from "express";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

dotenv.config();

const router = express.Router();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post("/generate-plan", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { subjects, hours, days } = req.body;

    if (!subjects || !hours || !days) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
Create a ${days}-day study plan.

Subjects: ${subjects.join(", ")}
Study hours per day: ${hours}

Rules:
- Divide time evenly
- Be concise
- Use bullet points
- STRICT format:

Day 1:
- Topic A
- Topic B

Day 2:
- Topic A
- Topic B
`;

    const response = await cohere.chat({
      model: "command-r-plus-08-2024", // ✅ THIS IS THE KEY
      message: prompt,
      temperature: 0.6,
    });

    res.json({ plan: response.text });

  } catch (error) {
    console.error("❌ COHERE CHAT ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
