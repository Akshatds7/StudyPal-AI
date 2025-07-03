import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/dashboard',
    failureRedirect: 'http://localhost:5173',
  })
);

export default router;
