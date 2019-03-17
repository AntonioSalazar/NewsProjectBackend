const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const newsIndepentArticle = require("../models/newsIndependent");
const uploadCloud = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({dest: "uploads/"});

router.post('/add_article', uploadCloud.single("photo"),(req, res, next) => {

  const {author, newsContent} = req.body
  console.log(req.body);
  newsIndepentArticle.create({
    author ,
    newsContent ,
    imgName : req.file.originalname,
    imgPath : req.file.url
  })
  .then(newArticle => {
    res.status(200).json({
      newArticle,
      message: "article uploaded"
    })
  })
  .catch( err => next(res.status(400).json(err)))
});

module.exports = router;
