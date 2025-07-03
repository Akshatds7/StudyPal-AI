import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();

// ✅ Updated CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://studypal-ai.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', aiRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
