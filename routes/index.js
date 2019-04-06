const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const newsIndepentArticle = require("../models/newsIndependent");
const uploadCloud = require("../config/cloudinary");



router.post('/add_article', uploadCloud.single("photo"),(req, res, next) => {
  const { newsDescription, newsTitle, newsContent, location } = req.body
  newsIndepentArticle.create({
     
    newsTitle ,
    newsDescription,
    newsContent,
    location,
    imgName : req.file.originalname,
    imgPath : req.file.url
  })
  .then(newArticle => {
    res.status(200).json({
      newArticle,
      message: "article uploaded",
      pictureUrl: req.file.url,
      pictureName: req.file.originalname
    })
  })
  .catch( err => next(res.status(400).json(err)))
});

router.get("/independent_articles", (req, res, next ) => {
  newsIndepentArticle.find()
  .then(allTheArticles => {
    res.status(200).json(
      allTheArticles
    )
  })
  .catch(err => next(res.status(400).json(err)))
})

router.patch("/independent_articles/edit/:id", (req, res, next) => {
  newsIndepentArticle.findByIdAndUpdate({"_id": req.params.id}, req.body, { new: true})
  .then(updatedArticle => {
    res.json({
      message: `article with the id ${req.params.id} has been updated`
    })
  })
  .catch(err => next(res.status(400).json(err)))
})

router.delete("/independent_article/delete/:id", (req, res, next) => {
  newsIndepentArticle.findByIdAndDelete(req.params.id)
  .then(deletedArticle => {
    res.status(200).json({
      message : `Article with id ${req.params.id} has been deleted`
    })
  })
  .catch(err => next(res.status(400).json(err)))
})

router.get("/independent_articles/:id", (req, res, next) => {
  newsIndepentArticle.findById(req.params.id)
  .then(singleArticle => res.status(200).json(singleArticle))
  .catch(err => next(res.status(400).json(err)))
})

module.exports = router;
