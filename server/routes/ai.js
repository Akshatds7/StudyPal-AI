import express from "express";
const router = express.Router();

router.post("/generate-plan", (req, res) => {
  console.log("🔥 ROUTE HIT");
  console.log("📦 BODY:", req.body);

  res.json({
    plan: "✅ BACKEND IS WORKING. THIS IS A TEST RESPONSE."
  });
});

export default router;
