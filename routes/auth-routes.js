const express         = require("express");
const authRoutes      = express.Router();
const bcrypt          = require("bcrypt");
const bcryptSalt      = 10 ;
const User            = require("../models/user");
const passport        = require("passport")


authRoutes.post("/signup", (req, res, next ) =>{
  const {username, email, password} = req.body;

  if (username == "" || password == "" || email == "") {
    res.json( {
      message: "Debes indicar los datos solicitados para poder continuar ☝🌝"
    })
    return
  }

  if(password.length < 7){
    res.status(400).json({ message: 'Tu contraseña debe ser de al menos 8 caracteres' });
    return;
}

  User.findOne({email}, (err, foundUser) => {
    if(err){
      res.status(500).json({message: "No pudimos revisar tu usuario"})
      return;
    }

    if(foundUser){
      res.status(400).json({message: "El usuario ingresado ya existe"})
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass
    })

    newUser.save(err => {
      if (err) {
          res.status(400).json({ message: 'No pudimos salvar el usuario en la base de datos.' });
          return;
      }

      req.login(newUser, (err) => {
          if (err) {
              res.status(500).json({ message: 'No se pudo loggear despues del signup' });
              return;
          }           
          res.status(200).json(newUser);
      });
    });    
  }) 
})


authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
          res.status(500).json({ message: 'Algo salio mal al momento de autenticar al usurio' });
          return;
      }
      if (!theUser) {
          // "failureDetails" contains the error messages
          res.status(401).json(failureDetails);
          return;
      }
      req.login(theUser, (err) => {
          if (err) {
              res.status(500).json({ message: 'No se pudo  salvar la sesion'});
              return;re
          }
          res.status(200).json(theUser);
      });
  })(req, res, next);
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.json({
    message: "user logged out"
  });
});

module.exports = authRoutes;