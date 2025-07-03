import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import pool from '../db.js';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  const email = emails?.[0]?.value;
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);
    if (existingUser.rows.length === 0) {
      await pool.query('INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3)', [id, displayName, email]);
    }
    done(null, profile);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
