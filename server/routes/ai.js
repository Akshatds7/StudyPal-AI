import express from "express";
import dotenv from "dotenv";
import cohere from "cohere-ai";

dotenv.config();
cohere.init(process.env.COHERE_API_KEY);

const router = express.Router();

router.post("/generate-plan", async (req, res) => {
  try {
    const { subjects, hours, days } = req.body;

    if (!subjects || !hours || !days) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
Create a ${days}-day study plan.

Subjects: ${subjects.join(", ")}
Hours per day: ${hours}

Format strictly as:
Day 1:
- Topic
- Topic

Day 2:
- Topic
- Topic
`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 600,
      temperature: 0.6,
    });

    const plan = response.body.generations[0].text.trim();

    res.json({ plan });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;
