const express         = require("express");
const authRoutes      = express.Router();
const bcrypt          = require("bcrypt");
const bcryptSalt      = 10 ;
const User            = require("../models/user");


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
      password: hashPass
    })
    .then((createdUser) => {
      res.json({
        createdUser
      });
    })
    .catch(error => {
      console.log(error);
    })

  })
  .catch(error =>{
    next(error)
  })
})

module.exports = authRoutes;