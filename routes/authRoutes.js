const express     = require("express");
const authRoutes  = express.Router();
const bcrypt      = require("bcrypt");
const bcryptSalt  = process.env.BCRYPT_SALT;
const User        = require("../models/user");


authRoutes.post("/signup", (req, res, next) => {
  const username  = req.body.username;
  const email     = req.body.email;
  const password  = req.body.password;
  const salt      = bcrypt.genSaltSync(bcryptSalt);
  const hashPass  = bcrypt.hashSync(password, salt);

  User.create({
    username,
    email,
    password: hashPass
  })
  .then(authUser => {
    res.status(200).json({
      message: "User created"
    })
  })
  .catch(err => next(res.json(err)))
})

module.export = authRoutes;