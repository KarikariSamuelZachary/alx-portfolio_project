const express = require("express");
const User = require("../models/User");
const createHttpError = require("http-errors");
const router = express.Router();

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw createHttpError.BadRequest("All fields are required");

    const userExists = await User.findOne({ username });
    if (userExists) throw createHttpError.Conflict("Username already exists");

    const newUser = new User({ username, password });
    await newUser.save();
    req.session.user = { id: newUser._id, username: newUser.username };
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/signin", (req, res) => res.render("signin"));

router.post("/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw createHttpError.BadRequest("All fields are required");

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      throw createHttpError.Unauthorized("Invalid username or password");

    req.session.user = { id: user._id, username: user.username };
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/signin"));
});

module.exports = router;
