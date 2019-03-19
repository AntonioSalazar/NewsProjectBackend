const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) { return cb(err); }
    cb(null, userDocument);
  });
});


passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},( email, password, next) => {
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return next(err);
    }
    if (!foundUser) {
      return next(null, false, { message: "Nombre de usuario incorrecto" });
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      return next(null, false, { message: "Contraseña incorrecta" });
    }
    return next(null, foundUser);
  });
}));