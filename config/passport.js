// config/passport.js
const bcrypt = require('bcryptjs'); // includes hashing & comparing ..
const { Strategy: LocalStrategy } = require('passport-local'); // for authentication 
const pool = require('../db/pool'); 
const passport = require('passport');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]); // check for user
      const user = rows[0];

      if (!user) {
        // done (error, user, info(optional))
        return done(null, false, { message: "Incorrect username" });
      }
      // compare the entered password with the hashed password in db
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
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
      done(null, user);  // Fetch user data by ID and pass it into req.user
    } catch (err) {
      done(err);  // Pass any errors to the next callback
    }
});
  
