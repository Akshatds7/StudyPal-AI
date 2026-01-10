import express from "express";
import dotenv from "dotenv";
import cohere from "cohere-ai";

dotenv.config();
cohere.init(process.env.COHERE_API_KEY);

const router = express.Router();

/* 🔍 Health check */
router.get("/test", (req, res) => {
  res.json({ message: "AI route working" });
});

/* 🤖 Generate Study Plan */
router.post("/generate-plan", async (req, res) => {
  try {
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
- Output strictly in this format:

Day 1:
- Topic 1
- Topic 2

Day 2:
- Topic 1
- Topic 2
`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 600,
      temperature: 0.6,
    });

    const plan = response.body.generations[0].text.trim();

    res.json({ plan });
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
