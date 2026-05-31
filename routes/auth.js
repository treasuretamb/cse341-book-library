const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login with GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('/');
  });
});

// Check login status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ loggedIn: true, user: req.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

module.exports = router;