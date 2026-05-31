require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { initDb, getDb } = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL || 'https://cse341-book-library.onrender.com/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDb();
        const users = db.db('booklibrary').collection('users');

        let user = await users.findOne({ githubId: profile.id });

        if (!user) {
          const result = await users.insertOne({
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            username: profile.username,
            email: profile.emails?.[0]?.value || '',
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos?.[0]?.value || '',
            createdAt: new Date()
          });
          user = await users.findOne({ _id: result.insertedId });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = getDb();
    const user = await db
      .db('booklibrary')
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Book Library API is running. Visit /api-docs for documentation.');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', require('./routes/index'));

// Start server
initDb((err) => {
  if (err) {
    console.log('Error Name:', err.name);
    console.log('Failed to connect to MongoDB');
    console.log('Error details:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  }
});