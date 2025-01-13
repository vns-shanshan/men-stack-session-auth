const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

// require our controllers
const authController = require("./controllers/auth");
// setup this on the server below our middleware

// Set the port from environment variable or default to 3000
// Checking are we in production if so there would be an envitonment for the port
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); // This defines req.body
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// This setsup session cookie
// In your controller functions you will have access to the session object (cookie) via req.session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// ------------- Endpoints --------------
app.get("/", function (req, res) {
    console.log(req.session, "<--- req.session");
    // Session {
    //     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
    //     user: { username: 'jin', _id: '66e086f38a80331c6983f54b' }
    //   } <--- req.session
    res.render("index.ejs", { user: req.session.user });
});

// the /auth prepens the whole route at /auth
app.use("/auth", authController);

// ---------------------------------------

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
