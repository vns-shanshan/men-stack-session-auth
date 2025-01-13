const bcrypt = require("bcrypt");
const express = require("express");
// This router object we can attach all the http endpoints
// for every RESTful route for a particular resource
const router = express.Router();

const UserModel = require("../models/user");

// /auth/sign-up (/auth comes from the server)
router.get("/sign-up", function (req, res) {
    res.render("auth/sign-up.ejs");
});

// /auth/sign-in (/auth comes from the server)
router.get("/sign-in", function (req, res) {
    res.render("auth/sign-in.ejs");
});

router.get("/sign-out", function (req, res) {
    // this destroys the cookie!
    req.session.destroy();
    // back to root route or whereever you want
    res.redirect("/");
});

// post request to /auth/sign-up
router.post("/sign-up", async function (req, res) {
    console.log(req.body, "<--- req.body aka the contents of the form");

    // lets disallow repeated usernames
    const userInTheDatabase = await UserModel.findOne({ username: req.body.username });
    if (userInTheDatabase) {
        return res.send("Username already taken");
    };

    // Check to make sure the password and confirmPassword match
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    };

    // hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    // update req.body with the hashed password
    req.body.password = hashedPassword;
    // create our user
    const userDoc = await UserModel.create(req.body);

    res.send(`Thanks for signing up ${userDoc.username}`);
});

// post request to /auth/sign-in
router.post("/sign-in", async function (req, res) {
    console.log(req.body);

    // find the user
    const userInTheDatabase = await UserModel.findOne({ username: req.body.username });
    if (!userInTheDatabase) {
        return res.send("Login failed. Please try again");
    }

    // Check if password is match
    // bycrypt compare sync returns true/false
    const isValidPassword = bcrypt.compare(req.body.password, userInTheDatabase.password);
    if (!isValidPassword) {
        return res.send("Login failed. Please try again");
    }

    // Otherwise setup the session cookie and store whatever want in it
    // NOT THE PASSWORD
    // user in req.session.user is what we created
    req.session.user = {
        username: userInTheDatabase.username,
        _id: userInTheDatabase._id
    };

    // redirect where you want the user to go
    res.redirect("/"); // redirect to the root route in this case
});


// Setup the router in the serverm so our server is listening for the http requests
// This folder is just definitions
module.exports = router;