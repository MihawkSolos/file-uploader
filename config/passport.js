// config/passport.js
const bcrypt = require('bcryptjs'); // includes hashing & comparing ..
const { Strategy: LocalStrategy } = require('passport-local'); // for authentication 
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// for a successful login, called automatically
passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only the user ID in the session
  });
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {id: id},
      })
      done(null, user);  // Fetch user data by ID and pass it into req.user
    } catch (err) {
      done(err);  // Pass any errors to the next callback
    }
});
  
