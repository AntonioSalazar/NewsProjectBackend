const express         = require("express");
const authRoutes      = express.Router();
const bcrypt          = require("bcrypt");
const bcryptSalt      = 10 ;
const User            = require("../models/user");
const passport        = require("passport")


authRoutes.post("/signup", (req, res, next ) =>{
  const username = req.body.username;
  const email    = req.body.email;
  const password = req.body.password;

  if (username == "" || password == "" || email == "") {
    res.json( {
      message: "Debes indicar los datos solicitados para poder continuar ☝🌝"
    })
    return
  }

  User.findOne({username})
  .then(user =>{
    if(user != null){
      res.json({
        message: "El usuario ingresado Ya existe! 😬"
      }) 
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      email,
      password: hashPass
    })
    .then((createdUser) => {
      res.json({
        createdUser
      });
      res.redirect("/")  //check if this works, after authorizing the user it should redirect to home page
    })
    .catch(error => {
      next(res.json(error));
    })

  })
  .catch(error =>{
    next(error)
  })
})

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}), (req, res) => {
  res.json({
    message: "logged in!"
  })
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRoutes;