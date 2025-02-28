function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = isAuthenticated;
