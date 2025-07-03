// 📁 server/routes/ai.js
import express from 'express';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
dotenv.config();

const router = express.Router();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post('/generate-plan', async (req, res) => {
  const { subjects, hours, days } = req.body;

  if (!Array.isArray(subjects) || !hours || !days) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const prompt = `Create a ${days}-day personalized study plan for these subjects: ${subjects.join(
    ', '
  )}, using ${hours} study hours per day.`;

  try {
    const chatStream = await cohere.chat({
      model: 'command-r', // ✅ works with chat(), not generate()
      message: prompt,
    });

    const plan = chatStream.text;
    res.json({ plan });
  } catch (error) {
    console.error('Cohere API error:', error);
    res.status(500).json({ error: 'Cohere API error' });
  }
});

export default router;
