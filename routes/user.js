const express = require('express');
const router  = express.Router();
const User     = require('../models/user');

router.get('/get_users', (req, res, next) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => next(res.status(400).json(err)))
})

module.exports = router;