// app.js
const express = require("express"); // for handling routes & http requests
const path = require("node:path"); // for views/public directories
const session = require("express-session"); // to store the session data
const passport = require("passport"); // middleware for managing user authentication
const router = require('./routes/router'); // Import routes
require('./config/passport');  // Import Passport configuration
const methodOverride = require('method-override');


const app = express();

// set up the views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// serving static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false })); // lets me get form data

// Session setup (to store and manage session data between requests)
app.use(session({ 
    secret: "cats",         // Secret key used to sign the session ID cookie
    resave: false,          // Don't save the session if it hasn't been modified
    saveUninitialized: false // Don't save uninitialized sessions (only save a session if it's actually been modified)
  }));
app.use(passport.session()); // initialize the session handling, lets me get req.user
app.use(methodOverride('_method'));  // Allow DELETE using the _method field

// Use routes
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
})