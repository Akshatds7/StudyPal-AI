import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

/* ===== ROUTES ===== */
app.use("/auth", authRoutes);
app.use("/api", aiRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
